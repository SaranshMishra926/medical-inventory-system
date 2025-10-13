const express = require('express');
const mongoose = require('mongoose');
const { requireAuth, getUserFromClerk, requireActiveUser, requirePermission, logUserActivity } = require('../middleware/auth');
const Medicine = require('../models/Medicine');
const Supplier = require('../models/Supplier');
const Order = require('../models/Order');
const sampleData = require('../data/sampleData');

const router = express.Router();

// Apply authentication middleware to all routes
// router.use(requireAuth);
// router.use(getUserFromClerk);
// router.use(requireActiveUser);

// Get inventory summary for dashboard
router.get('/inventory-summary', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('📊 Using sample data - MongoDB not connected');
      const medicines = sampleData.medicines;
      const suppliers = sampleData.suppliers;
      const orders = sampleData.orders;
      
      const totalMedicines = medicines.length;
      const lowStockMedicines = medicines.filter(med => med.quantity <= med.minStockLevel).length;
      const expiringMedicines = medicines.filter(med => {
        const expiryDate = new Date(med.expiryDate);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
      }).length;
      const totalSuppliers = suppliers.length;
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      
      return res.json({
        success: true,
        data: {
          totalMedicines,
          lowStockMedicines,
          expiringMedicines,
          totalSuppliers,
          pendingOrders,
          totalValue: medicines.reduce((sum, med) => sum + (med.quantity * med.unitPrice), 0)
        }
      });
    }

    const totalMedicines = await Medicine.countDocuments();
    const lowStockMedicines = await Medicine.countDocuments({
      $expr: { $lte: ['$quantity', '$minimumStockLevel'] }
    });
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiringMedicines = await Medicine.countDocuments({
      expiryDate: { $lte: thirtyDaysFromNow, $gte: new Date() }
    });
    
    const totalSuppliers = await Supplier.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    
    // Calculate total inventory value
    const medicines = await Medicine.find({}, 'quantity unitPrice');
    const totalValue = medicines.reduce((sum, med) => sum + (med.quantity * med.unitPrice), 0);
    
    res.json({
      success: true,
      data: {
        totalMedicines,
        lowStockMedicines,
        expiringMedicines,
        totalSuppliers,
        pendingOrders,
        totalValue
      }
    });
  } catch (error) {
    console.error('Error fetching inventory summary:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch inventory summary' 
    });
  }
});

module.exports = router;
