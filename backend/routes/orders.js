const express = require('express');
const { requireAuth, getUserFromClerk, requireActiveUser, requirePermission, logUserActivity } = require('../middleware/auth');
const Order = require('../models/Order');
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
const validateOrder = [
  body('supplier').isMongoId().withMessage('Valid supplier ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.medicine').isMongoId().withMessage('Valid medicine ID is required'),
  body('items.*.quantity').isNumeric().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('items.*.unitPrice').isNumeric().isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
  body('expectedDeliveryDate').optional().isISO8601().withMessage('Valid expected delivery date is required')
];

// Get all orders
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('📊 Using sample data - MongoDB not connected');
      return res.json({
        success: true,
        orders: sampleData.orders,
        total: sampleData.orders.length
      });
    }

    const { page = 1, limit = 10, status, supplier, startDate, endDate } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (supplier) filter.supplier = supplier;
    if (startDate || endDate) {
      filter.orderDate = {};
      if (startDate) filter.orderDate.$gte = new Date(startDate);
      if (endDate) filter.orderDate.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(filter)
      .populate('supplier', 'name contactPerson email phone')
      .populate('items.medicine', 'name category manufacturer')
      .populate('createdBy', 'fullName email')
      .populate('approvedBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch orders' 
    });
  }
});

// Get order by ID
router.get('/:id', requirePermission('orders'), logUserActivity('get order by id'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('supplier', 'name contactPerson email phone address')
      .populate('items.medicine', 'name category manufacturer batchNumber expiryDate')
      .populate('createdBy', 'fullName email')
      .populate('approvedBy', 'fullName email')
      .populate('updatedBy', 'fullName email');
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch order' 
    });
  }
});

// Create new order
router.post('/', validateOrder, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const { supplier, items, expectedDeliveryDate, notes } = req.body;
    
    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      item.totalPrice = item.quantity * item.unitPrice;
      return total + item.totalPrice;
    }, 0);
    
    const orderData = {
      supplier,
      items,
      totalAmount,
      expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : undefined,
      notes,
      createdBy: req.userId
    };
    
    const order = new Order(orderData);
    await order.save();
    
    await order.populate('supplier', 'name contactPerson email phone');
    await order.populate('items.medicine', 'name category manufacturer');
    await order.populate('createdBy', 'fullName email');
    
    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create order' 
    });
  }
});

// Update order status
router.patch('/:id/status', requirePermission('orders'), logUserActivity('update order status'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!['Pending', 'Approved', 'Ordered', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }
    
    const updateData = {
      status,
      updatedBy: req.userId
    };
    
    if (status === 'Approved') {
      updateData.approvedBy = req.userId;
    }
    
    if (status === 'Delivered') {
      updateData.actualDeliveryDate = new Date();
    }
    
    if (notes) {
      updateData.notes = notes;
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('supplier', 'name contactPerson email phone')
      .populate('items.medicine', 'name category manufacturer')
      .populate('createdBy', 'fullName email')
      .populate('approvedBy', 'fullName email')
      .populate('updatedBy', 'fullName email');
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }
    
    // If order is delivered, update medicine quantities
    if (status === 'Delivered') {
      for (const item of order.items) {
        await Medicine.findByIdAndUpdate(
          item.medicine,
          { $inc: { quantity: item.quantity } }
        );
      }
    }
    
    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update order status' 
    });
  }
});

// Update order
router.put('/:id', validateOrder, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const { supplier, items, expectedDeliveryDate, notes } = req.body;
    
    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      item.totalPrice = item.quantity * item.unitPrice;
      return total + item.totalPrice;
    }, 0);
    
    const orderData = {
      supplier,
      items,
      totalAmount,
      expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : undefined,
      notes,
      updatedBy: req.userId
    };
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      orderData,
      { new: true, runValidators: true }
    )
      .populate('supplier', 'name contactPerson email phone')
      .populate('items.medicine', 'name category manufacturer')
      .populate('createdBy', 'fullName email')
      .populate('approvedBy', 'fullName email')
      .populate('updatedBy', 'fullName email');
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }
    
    res.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update order' 
    });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }
    
    res.json({
      success: true,
      data: order,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete order' 
    });
  }
});

// Get order statistics
router.get('/stats/overview', requirePermission('orders'), logUserActivity('get order stats'), async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const approvedOrders = await Order.countDocuments({ status: 'Approved' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    const monthlyStats = await Order.aggregate([
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
    
    const totalValue = await Order.aggregate([
      { $group: { _id: null, totalValue: { $sum: '$totalAmount' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        approvedOrders,
        deliveredOrders,
        statusStats,
        monthlyStats,
        totalValue: totalValue[0]?.totalValue || 0
      }
    });
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch order statistics' 
    });
  }
});

module.exports = router;
