const express = require('express');
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
    // Try to get data from Supabase, fallback to sample data if connection fails
    try {
      const totalMedicines = await Medicine.count();
      const lowStockMedicines = await Medicine.findLowStock();
      const expiringMedicines = await Medicine.findExpiringSoon();
      const totalSuppliers = await Supplier.count();
      const pendingOrders = await Order.getPendingOrders();
      const inventoryStats = await Medicine.getInventoryStats();
      
      return res.json({
        success: true,
        data: {
          totalMedicines,
          lowStockMedicines: lowStockMedicines.length,
          expiringMedicines: expiringMedicines.length,
          totalSuppliers,
          pendingOrders: pendingOrders.length,
          totalValue: inventoryStats.totalValue
        }
      });
    } catch (error) {
      console.log('📊 Using sample data - Supabase not connected:', error.message);
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
  } catch (error) {
    console.error('Error getting inventory summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get inventory summary'
    });
  }
});

// Get recent activities for dashboard
router.get('/recent-activities', async (req, res) => {
  try {
    // Try to get data from Supabase, fallback to sample data if connection fails
    try {
      const recentOrders = await Order.find({}, { orderBy: 'created_at', ascending: false, limit: 5 });
      const lowStockItems = await Medicine.findLowStock();
      
      return res.json({
        success: true,
        data: {
          recentOrders,
          lowStockItems,
          alerts: {
            lowStock: lowStockItems.length,
            expiring: (await Medicine.findExpiringSoon()).length,
            pendingOrders: (await Order.getPendingOrders()).length
          }
        }
      });
    } catch (error) {
      console.log('📊 Using sample data for recent activities - Supabase not connected');
      const medicines = sampleData.medicines;
      const orders = sampleData.orders;
      
      const recentOrders = orders.slice(0, 5);
      const lowStockItems = medicines.filter(med => med.quantity <= med.minStockLevel);
      
      return res.json({
        success: true,
        data: {
          recentOrders,
          lowStockItems,
          alerts: {
            lowStock: lowStockItems.length,
            expiring: medicines.filter(med => {
              const expiryDate = new Date(med.expiryDate);
              const thirtyDaysFromNow = new Date();
              thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
              return expiryDate <= thirtyDaysFromNow && expiryDate >= new Date();
            }).length,
            pendingOrders: orders.filter(order => order.status === 'pending').length
          }
        }
      });
    }
  } catch (error) {
    console.error('Error getting recent activities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recent activities'
    });
  }
});

module.exports = router;
