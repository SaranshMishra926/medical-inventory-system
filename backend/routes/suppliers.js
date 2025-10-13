const express = require('express');
const mongoose = require('mongoose');
const { requireAuth, getUserFromClerk, requireActiveUser, requirePermission, logUserActivity } = require('../middleware/auth');
const Supplier = require('../models/Supplier');
const { body, validationResult } = require('express-validator');
const sampleData = require('../data/sampleData');

const router = express.Router();

// Apply authentication middleware to all routes (temporarily disabled for testing)
// router.use(requireAuth);
// router.use(getUserFromClerk);
// router.use(requireActiveUser);

// Validation middleware
const validateSupplier = [
  body('name').notEmpty().withMessage('Supplier name is required'),
  body('contactPerson').notEmpty().withMessage('Contact person is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.zipCode').notEmpty().withMessage('Zip code is required'),
  body('licenseNumber').notEmpty().withMessage('License number is required'),
  body('gstNumber').notEmpty().withMessage('GST number is required')
];

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('📊 Using sample data - MongoDB not connected');
      return res.json({
        success: true,
        suppliers: sampleData.suppliers,
        total: sampleData.suppliers.length
      });
    }

    const { page = 1, limit = 10, search, isActive } = req.query;
    
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const suppliers = await Supplier.find(filter)
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Supplier.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        suppliers,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch suppliers' 
    });
  }
});

// Get supplier by ID
router.get('/:id', requirePermission('suppliers'), logUserActivity('get supplier by id'), async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email');
    
    if (!supplier) {
      return res.status(404).json({ 
        success: false,
        error: 'Supplier not found' 
      });
    }
    
    res.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch supplier' 
    });
  }
});

// Create new supplier
router.post('/', validateSupplier, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const supplierData = {
      ...req.body,
      createdBy: req.userId
    };
    
    const supplier = new Supplier(supplierData);
    await supplier.save();
    
    await supplier.populate('createdBy', 'fullName email');
    
    res.status(201).json({
      success: true,
      data: supplier,
      message: 'Supplier added successfully'
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field} already exists`
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'Failed to create supplier' 
    });
  }
});

// Update supplier
router.put('/:id', validateSupplier, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const supplierData = {
      ...req.body,
      updatedBy: req.userId
    };
    
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      supplierData,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email');
    
    if (!supplier) {
      return res.status(404).json({ 
        success: false,
        error: 'Supplier not found' 
      });
    }
    
    res.json({
      success: true,
      data: supplier,
      message: 'Supplier updated successfully'
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field} already exists`
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'Failed to update supplier' 
    });
  }
});

// Delete supplier
router.delete('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedBy: req.userId },
      { new: true }
    );
    
    if (!supplier) {
      return res.status(404).json({ 
        success: false,
        error: 'Supplier not found' 
      });
    }
    
    res.json({
      success: true,
      data: supplier,
      message: 'Supplier deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete supplier' 
    });
  }
});

// Get supplier statistics
router.get('/stats/overview', requirePermission('suppliers'), logUserActivity('get supplier stats'), async (req, res) => {
  try {
    const totalSuppliers = await Supplier.countDocuments();
    const activeSuppliers = await Supplier.countDocuments({ isActive: true });
    const inactiveSuppliers = totalSuppliers - activeSuppliers;
    
    const ratingStats = await Supplier.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const recentSuppliers = await Supplier.find()
      .select('name contactPerson email rating createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      success: true,
      data: {
        totalSuppliers,
        activeSuppliers,
        inactiveSuppliers,
        ratingStats,
        recentSuppliers
      }
    });
  } catch (error) {
    console.error('Error fetching supplier statistics:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch supplier statistics' 
    });
  }
});

module.exports = router;
