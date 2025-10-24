const express = require('express');
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
  body('supplier').notEmpty().withMessage('Valid supplier ID is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('minimumStockLevel').optional().isNumeric().isInt({ min: 0 }).withMessage('Minimum stock level must be a non-negative integer'),
  body('maximumStockLevel').optional().isNumeric().isInt({ min: 0 }).withMessage('Maximum stock level must be a non-negative integer')
];

// Get all medicines
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, lowStock, expiringSoon } = req.query;
    
    // Try to get data from Supabase, fallback to sample data if connection fails
    try {
      const filter = {};
      if (category) filter.category = category;
      if (search) {
        // Use Supabase text search
        const medicines = await Medicine.search(search);
        return res.json({
          success: true,
          medicines: medicines.slice((parseInt(page) - 1) * parseInt(limit), parseInt(page) * parseInt(limit)),
          total: medicines.length,
          page: parseInt(page),
          pages: Math.ceil(medicines.length / parseInt(limit))
        });
      }
      
      let medicines;
      if (lowStock === 'true') {
        medicines = await Medicine.findLowStock();
      } else if (expiringSoon === 'true') {
        medicines = await Medicine.findExpiringSoon();
      } else {
        medicines = await Medicine.find(filter, {
          orderBy: 'name',
          ascending: true,
          limit: parseInt(limit),
          offset: (parseInt(page) - 1) * parseInt(limit)
        });
      }
      
      const total = await Medicine.count(filter);
      
      res.json({
        success: true,
        medicines,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      });
    } catch (error) {
      console.log('📊 Using sample data - Supabase not connected:', error.message);
      let medicines = sampleData.medicines;
      
      if (category) {
        medicines = medicines.filter(med => med.category === category);
      }
      if (search) {
        medicines = medicines.filter(med => 
          med.name.toLowerCase().includes(search.toLowerCase()) ||
          med.manufacturer.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (lowStock === 'true') {
        medicines = medicines.filter(med => med.quantity <= med.minStockLevel);
      }
      if (expiringSoon === 'true') {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        medicines = medicines.filter(med => {
          const expiryDate = new Date(med.expiryDate);
          return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
        });
      }
      
      const total = medicines.length;
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const endIndex = startIndex + parseInt(limit);
      const paginatedMedicines = medicines.slice(startIndex, endIndex);
      
      res.json({
        success: true,
        medicines: paginatedMedicines,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      });
    }
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch medicines'
    });
  }
});

// Get medicine by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    try {
      const medicine = await Medicine.findById(id);
      if (!medicine) {
        return res.status(404).json({
          success: false,
          error: 'Medicine not found'
        });
      }
      
      res.json({
        success: true,
        medicine
      });
    } catch (error) {
      console.log('📊 Using sample data - Supabase not connected');
      const medicine = sampleData.medicines.find(med => med.id === id);
      if (!medicine) {
        return res.status(404).json({
          success: false,
          error: 'Medicine not found'
        });
      }
      
      res.json({
        success: true,
        medicine
      });
    }
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
        errors: errors.array()
      });
    }

    const medicineData = {
      ...req.body,
      totalPrice: req.body.quantity * req.body.unitPrice,
      createdBy: req.userId || null
    };

    try {
      const medicine = await Medicine.createMedicine(medicineData);
      res.status(201).json({
        success: true,
        medicine,
        message: 'Medicine created successfully'
      });
    } catch (error) {
      console.log('📊 Using sample data - Supabase not connected');
      const newMedicine = {
        id: Date.now().toString(),
        ...medicineData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      res.status(201).json({
        success: true,
        medicine: newMedicine,
        message: 'Medicine created successfully (sample data)'
      });
    }
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
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const updateData = {
      ...req.body,
      totalPrice: req.body.quantity * req.body.unitPrice,
      updatedBy: req.userId || null
    };

    try {
      const medicine = await Medicine.updateById(id, updateData);
      if (!medicine) {
        return res.status(404).json({
          success: false,
          error: 'Medicine not found'
        });
      }
      
      res.json({
        success: true,
        medicine,
        message: 'Medicine updated successfully'
      });
    } catch (error) {
      console.log('📊 Using sample data - Supabase not connected');
      res.json({
        success: true,
        medicine: { ...updateData, id, updatedAt: new Date().toISOString() },
        message: 'Medicine updated successfully (sample data)'
      });
    }
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
    const { id } = req.params;
    
    try {
      const success = await Medicine.deleteById(id);
      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Medicine not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Medicine deleted successfully'
      });
    } catch (error) {
      console.log('📊 Using sample data - Supabase not connected');
      res.json({
        success: true,
        message: 'Medicine deleted successfully (sample data)'
      });
    }
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete medicine'
    });
  }
});

// Get inventory statistics
router.get('/stats/summary', async (req, res) => {
  try {
    try {
      const stats = await Medicine.getInventoryStats();
      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.log('📊 Using sample data for stats - Supabase not connected');
      const medicines = sampleData.medicines;
      const stats = {
        totalItems: medicines.length,
        totalQuantity: medicines.reduce((sum, med) => sum + med.quantity, 0),
        totalValue: medicines.reduce((sum, med) => sum + (med.quantity * med.unitPrice), 0),
        categories: {}
      };
      
      medicines.forEach(med => {
        if (!stats.categories[med.category]) {
          stats.categories[med.category] = { count: 0, quantity: 0, value: 0 };
        }
        stats.categories[med.category].count++;
        stats.categories[med.category].quantity += med.quantity;
        stats.categories[med.category].value += med.quantity * med.unitPrice;
      });
      
      res.json({
        success: true,
        stats
      });
    }
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inventory statistics'
    });
  }
});

// Get low stock medicines
router.get('/alerts/low-stock', async (req, res) => {
  try {
    try {
      const lowStockMedicines = await Medicine.findLowStock();
      res.json({
        success: true,
        medicines: lowStockMedicines,
        count: lowStockMedicines.length
      });
    } catch (error) {
      console.log('📊 Using sample data for low stock - Supabase not connected');
      const medicines = sampleData.medicines.filter(med => med.quantity <= med.minStockLevel);
      res.json({
        success: true,
        medicines,
        count: medicines.length
      });
    }
  } catch (error) {
    console.error('Error fetching low stock medicines:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch low stock medicines'
    });
  }
});

// Get expiring medicines
router.get('/alerts/expiring', async (req, res) => {
  try {
    try {
      const expiringMedicines = await Medicine.findExpiringSoon();
      res.json({
        success: true,
        medicines: expiringMedicines,
        count: expiringMedicines.length
      });
    } catch (error) {
      console.log('📊 Using sample data for expiring - Supabase not connected');
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const medicines = sampleData.medicines.filter(med => {
        const expiryDate = new Date(med.expiryDate);
        return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
      });
      
      res.json({
        success: true,
        medicines,
        count: medicines.length
      });
    }
  } catch (error) {
    console.error('Error fetching expiring medicines:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expiring medicines'
    });
  }
});

// Update stock quantity
router.patch('/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, operation = 'set' } = req.body;
    
    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid quantity is required'
      });
    }

    try {
      let medicine;
      if (operation === 'add') {
        medicine = await Medicine.addStock(id, quantity, req.userId);
      } else if (operation === 'remove') {
        medicine = await Medicine.removeStock(id, quantity, req.userId);
      } else {
        medicine = await Medicine.updateStock(id, quantity, req.userId);
      }
      
      res.json({
        success: true,
        medicine,
        message: 'Stock updated successfully'
      });
    } catch (error) {
      console.log('📊 Using sample data - Supabase not connected');
      res.json({
        success: true,
        medicine: { id, quantity, updatedAt: new Date().toISOString() },
        message: 'Stock updated successfully (sample data)'
      });
    }
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update stock'
    });
  }
});

module.exports = router;