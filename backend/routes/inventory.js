const express = require('express');
const mongoose = require('mongoose');
const { requireAuth, getUserFromClerk, requireActiveUser, requirePermission, logUserActivity } = require('../middleware/auth');
const Medicine = require('../models/Medicine');
const Supplier = require('../models/Supplier');
const { body, validationResult } = require('express-validator');
const sampleData = require('../data/sampleData');

const router = express.Router();

// Apply authentication middleware to all routes (temporarily disabled for testing)
// router.use(requireAuth);
// router.use(getUserFromClerk);
// router.use(requireActiveUser);

// Validation middleware
const validateMedicine = [
  body('name').notEmpty().withMessage('Medicine name is required'),
  body('category').isIn(['Prescription', 'Over-the-Counter', 'Controlled Substance', 'Medical Device', 'Supplies']).withMessage('Invalid category'),
  body('manufacturer').notEmpty().withMessage('Manufacturer is required'),
  body('batchNumber').notEmpty().withMessage('Batch number is required'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
  body('quantity').isNumeric().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('unit').isIn(['tablets', 'capsules', 'ml', 'mg', 'units', 'vials', 'boxes', 'strips']).withMessage('Invalid unit'),
  body('unitPrice').isNumeric().isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
  body('supplier').isMongoId().withMessage('Valid supplier ID is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('minimumStockLevel').optional().isNumeric().isInt({ min: 0 }).withMessage('Minimum stock level must be a non-negative integer'),
  body('maximumStockLevel').optional().isNumeric().isInt({ min: 0 }).withMessage('Maximum stock level must be a non-negative integer')
];

// Get all medicines
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('📊 Using sample data - MongoDB not connected');
      return res.json({
        success: true,
        medicines: sampleData.medicines,
        total: sampleData.medicines.length,
        page: 1,
        pages: 1
      });
    }

    const { page = 1, limit = 10, category, search, lowStock, expiringSoon } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } }
      ];
    }
    if (lowStock === 'true') {
      filter.$expr = { $lte: ['$quantity', '$minimumStockLevel'] };
    }
    if (expiringSoon === 'true') {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      filter.expiryDate = { $lte: thirtyDaysFromNow };
    }
    
    const medicines = await Medicine.find(filter)
      .populate('supplier', 'name contactPerson email phone')
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Medicine.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        medicines,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch medicines' 
    });
  }
});

// Get all medicines (alternative endpoint for frontend compatibility)
router.get('/medicines', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('📊 Using sample data - MongoDB not connected');
      return res.json({
        success: true,
        medicines: sampleData.medicines,
        total: sampleData.medicines.length,
        page: 1,
        pages: 1
      });
    }

    const { page = 1, limit = 10, category, search, lowStock, expiringSoon } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } }
      ];
    }
    if (lowStock === 'true') {
      filter.$expr = { $lte: ['$quantity', '$minimumStockLevel'] };
    }
    if (expiringSoon === 'true') {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      filter.expiryDate = { $lte: thirtyDaysFromNow };
    }
    
    const medicines = await Medicine.find(filter)
      .populate('supplier', 'name contactPerson email phone')
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Medicine.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        medicines,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch medicines' 
    });
  }
});

// Get medicine by ID
router.get('/:id', requirePermission('inventory'), logUserActivity('get medicine by id'), async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id)
      .populate('supplier', 'name contactPerson email phone address')
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email');
    
    if (!medicine) {
      return res.status(404).json({ 
        success: false,
        error: 'Medicine not found' 
      });
    }
    
    res.json({
      success: true,
      data: medicine
    });
  } catch (error) {
    console.error('Error fetching medicine:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch medicine' 
    });
  }
});

// Create new medicine
router.post('/', validateMedicine, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const medicineData = {
      ...req.body,
      createdBy: req.userId
    };
    
    const medicine = new Medicine(medicineData);
    await medicine.save();
    
    await medicine.populate('supplier', 'name contactPerson email phone');
    await medicine.populate('createdBy', 'fullName email');
    
    res.status(201).json({
      success: true,
      data: medicine,
      message: 'Medicine added successfully'
    });
  } catch (error) {
    console.error('Error creating medicine:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create medicine' 
    });
  }
});

// Create new medicine (alternative endpoint for frontend compatibility)
router.post('/medicines', validateMedicine, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const medicineData = {
      ...req.body
    };
    
    const medicine = await Medicine.create(medicineData);
    await medicine.populate('supplier', 'name contactPerson email phone');
    
    res.status(201).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    console.error('Error creating medicine:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create medicine' 
    });
  }
});

// Update medicine
router.put('/:id', validateMedicine, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const medicineData = {
      ...req.body,
      updatedBy: req.userId
    };
    
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      medicineData,
      { new: true, runValidators: true }
    )
      .populate('supplier', 'name contactPerson email phone')
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email');
    
    if (!medicine) {
      return res.status(404).json({ 
        success: false,
        error: 'Medicine not found' 
      });
    }
    
    res.json({
      success: true,
      data: medicine,
      message: 'Medicine updated successfully'
    });
  } catch (error) {
    console.error('Error updating medicine:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update medicine' 
    });
  }
});

// Delete medicine
router.delete('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedBy: req.userId },
      { new: true }
    );
    
    if (!medicine) {
      return res.status(404).json({ 
        success: false,
        error: 'Medicine not found' 
      });
    }
    
    res.json({
      success: true,
      data: medicine,
      message: 'Medicine deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete medicine' 
    });
  }
});

// Get inventory statistics
router.get('/stats/overview', requirePermission('inventory'), logUserActivity('get inventory stats'), async (req, res) => {
  try {
    const totalMedicines = await Medicine.countDocuments({ isActive: true });
    const lowStockMedicines = await Medicine.countDocuments({
      $expr: { $lte: ['$quantity', '$minimumStockLevel'] },
      isActive: true
    });
    
    const expiringSoon = await Medicine.countDocuments({
      expiryDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      isActive: true
    });
    
    const expiredMedicines = await Medicine.countDocuments({
      expiryDate: { $lt: new Date() },
      isActive: true
    });
    
    const categoryStats = await Medicine.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: '$totalPrice' }
        }
      }
    ]);
    
    const totalValue = await Medicine.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalValue: { $sum: '$totalPrice' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalMedicines,
        lowStockMedicines,
        expiringSoon,
        expiredMedicines,
        categoryStats,
        totalValue: totalValue[0]?.totalValue || 0
      }
    });
  } catch (error) {
    console.error('Error fetching inventory statistics:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch inventory statistics' 
    });
  }
});

// Get low stock medicines (alternative endpoint for frontend compatibility)
router.get('/medicines/low-stock', async (req, res) => {
  try {
    const medicines = await Medicine.find({
      $expr: { $lte: ['$quantity', '$minimumStockLevel'] }
    }).populate('supplier', 'name contactPerson email phone');
    
    res.json({
      success: true,
      data: medicines
    });
  } catch (error) {
    console.error('Error fetching low stock medicines:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch low stock medicines' 
    });
  }
});

// Get expiring medicines (alternative endpoint for frontend compatibility)
router.get('/medicines/expiring', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));
    
    const medicines = await Medicine.find({
      expiryDate: { $lte: expiryDate },
      expiryDate: { $gte: new Date() }
    }).populate('supplier', 'name contactPerson email phone');
    
    res.json({
      success: true,
      data: medicines
    });
  } catch (error) {
    console.error('Error fetching expiring medicines:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch expiring medicines'
    });
  }
});

// Get low stock medicines
router.get('/alerts/low-stock', requirePermission('inventory'), logUserActivity('get low stock medicines'), async (req, res) => {
  try {
    const medicines = await Medicine.find({
      $expr: { $lte: ['$quantity', '$minimumStockLevel'] },
      isActive: true
    })
      .populate('supplier', 'name contactPerson email phone')
      .sort({ quantity: 1 });
    
    res.json({
      success: true,
      data: medicines
    });
  } catch (error) {
    console.error('Error fetching low stock medicines:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch low stock medicines' 
    });
  }
});

// Get expiring medicines
router.get('/alerts/expiring', requirePermission('inventory'), logUserActivity('get expiring medicines'), async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));
    
    const medicines = await Medicine.find({
      expiryDate: { $lte: expiryDate },
      isActive: true
    })
      .populate('supplier', 'name contactPerson email phone')
      .sort({ expiryDate: 1 });
    
    res.json({
      success: true,
      data: medicines
    });
  } catch (error) {
    console.error('Error fetching expiring medicines:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch expiring medicines' 
    });
  }
});

module.exports = router;
