const express = require('express');
const { requireAuth, getUserFromClerk, requireActiveUser, requirePermission, logUserActivity } = require('../middleware/auth');
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');
const Supplier = require('../models/Supplier');
const User = require('../models/User');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);
router.use(getUserFromClerk);
router.use(requireActiveUser);

// Get dashboard overview
router.get('/dashboard', requirePermission('dashboard'), logUserActivity('get dashboard overview'), async (req, res) => {
  try {
    // Get inventory statistics
    const inventoryStats = await Medicine.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalMedicines: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: '$totalPrice' },
          lowStockCount: {
            $sum: {
              $cond: [{ $lte: ['$quantity', '$minimumStockLevel'] }, 1, 0]
            }
          },
          expiringSoonCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lte: ['$expiryDate', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] },
                    { $gte: ['$expiryDate', new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Get order statistics
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          approvedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] }
          },
          totalOrderValue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Get supplier statistics
    const supplierStats = await Supplier.aggregate([
      {
        $group: {
          _id: null,
          totalSuppliers: { $sum: 1 },
          activeSuppliers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      }
    ]);

    // Get recent activities
    const recentOrders = await Order.find()
      .populate('supplier', 'name')
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber supplier status totalAmount createdAt createdBy');

    const lowStockMedicines = await Medicine.find({
      $expr: { $lte: ['$quantity', '$minimumStockLevel'] },
      isActive: true
    })
      .populate('supplier', 'name contactPerson email')
      .sort({ quantity: 1 })
      .limit(5)
      .select('name quantity minimumStockLevel supplier');

    const expiringMedicines = await Medicine.find({
      expiryDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      isActive: true
    })
      .populate('supplier', 'name contactPerson email')
      .sort({ expiryDate: 1 })
      .limit(5)
      .select('name expiryDate quantity supplier');

    res.json({
      success: true,
      data: {
        inventory: inventoryStats[0] || {
          totalMedicines: 0,
          totalQuantity: 0,
          totalValue: 0,
          lowStockCount: 0,
          expiringSoonCount: 0
        },
        orders: orderStats[0] || {
          totalOrders: 0,
          pendingOrders: 0,
          approvedOrders: 0,
          deliveredOrders: 0,
          totalOrderValue: 0
        },
        suppliers: supplierStats[0] || {
          totalSuppliers: 0,
          activeSuppliers: 0
        },
        recentOrders,
        lowStockMedicines,
        expiringMedicines
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch dashboard overview' 
    });
  }
});

// Get inventory analytics
router.get('/inventory', requirePermission('reports'), logUserActivity('get inventory analytics'), async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Category distribution
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

    // Stock level analysis
    const stockLevelStats = await Medicine.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          lowStock: {
            $sum: {
              $cond: [{ $lte: ['$quantity', '$minimumStockLevel'] }, 1, 0]
            }
          },
          normalStock: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: ['$quantity', '$minimumStockLevel'] },
                    { $lt: ['$quantity', '$maximumStockLevel'] }
                  ]
                },
                1,
                0
              ]
            }
          },
          overstock: {
            $sum: {
              $cond: [{ $gte: ['$quantity', '$maximumStockLevel'] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Expiry analysis
    const expiryStats = await Medicine.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          expired: {
            $sum: {
              $cond: [{ $lt: ['$expiryDate', new Date()] }, 1, 0]
            }
          },
          expiringSoon: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lte: ['$expiryDate', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] },
                    { $gte: ['$expiryDate', new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          },
          valid: {
            $sum: {
              $cond: [{ $gt: ['$expiryDate', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        categoryStats,
        stockLevelStats: stockLevelStats[0] || { lowStock: 0, normalStock: 0, overstock: 0 },
        expiryStats: expiryStats[0] || { expired: 0, expiringSoon: 0, valid: 0 }
      }
    });
  } catch (error) {
    console.error('Error fetching inventory analytics:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch inventory analytics' 
    });
  }
});

// Get order analytics
router.get('/orders', requirePermission('reports'), logUserActivity('get order analytics'), async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Order status distribution
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Monthly order trends
    const monthlyTrends = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // Supplier performance
    const supplierPerformance = await Order.aggregate([
      {
        $group: {
          _id: '$supplier',
          orderCount: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: '_id',
          foreignField: '_id',
          as: 'supplier'
        }
      },
      { $unwind: '$supplier' },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        statusStats,
        monthlyTrends,
        supplierPerformance
      }
    });
  } catch (error) {
    console.error('Error fetching order analytics:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch order analytics' 
    });
  }
});

// Get financial reports
router.get('/financial', requirePermission('reports'), logUserActivity('get financial reports'), async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Inventory value by category
    const inventoryValueByCategory = await Medicine.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          totalValue: { $sum: '$totalPrice' },
          totalQuantity: { $sum: '$quantity' },
          avgUnitPrice: { $avg: '$unitPrice' }
        }
      }
    ]);

    // Order value trends
    const orderValueTrends = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' },
            day: { $dayOfMonth: '$orderDate' }
          },
          totalAmount: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Top suppliers by value
    const topSuppliersByValue = await Order.aggregate([
      {
        $group: {
          _id: '$supplier',
          totalValue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: '_id',
          foreignField: '_id',
          as: 'supplier'
        }
      },
      { $unwind: '$supplier' },
      { $sort: { totalValue: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        inventoryValueByCategory,
        orderValueTrends,
        topSuppliersByValue
      }
    });
  } catch (error) {
    console.error('Error fetching financial reports:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch financial reports' 
    });
  }
});

// Get system statistics
router.get('/system', requirePermission('settings'), logUserActivity('get system statistics'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalMedicines = await Medicine.countDocuments({ isActive: true });
    const totalSuppliers = await Supplier.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();

    const userRoleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentActivity = await Order.find()
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber status totalAmount createdAt createdBy');

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalMedicines,
        totalSuppliers,
        totalOrders,
        userRoleStats,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Error fetching system statistics:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch system statistics' 
    });
  }
});

module.exports = router;
