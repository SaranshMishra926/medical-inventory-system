const express = require('express');
const { requireAuth, getUserFromClerk, requireActiveUser, requirePermission, logUserActivity } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);
router.use(getUserFromClerk);
router.use(requireActiveUser);

// Get current user profile
router.get('/profile', logUserActivity('get profile'), async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-__v')
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch user profile' 
    });
  }
});

// Update user profile
router.put('/profile', logUserActivity('update profile'), async (req, res) => {
  try {
    const { firstName, lastName, notifications, role } = req.body;
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (notifications) updateData.notifications = notifications;
    if (role) {
      updateData.role = role;
      updateData.permissions = User.getRolePermissions(role);
    }
    
    updateData.fullName = `${updateData.firstName || req.user.firstName} ${updateData.lastName || req.user.lastName}`;
    updateData.updatedBy = req.userId;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');
    
    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update user profile' 
    });
  }
});

// Get all users (Admin only)
router.get('/', requirePermission('settings'), logUserActivity('get all users'), async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const users = await User.find(filter)
      .select('-__v')
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch users' 
    });
  }
});

// Get user by ID (Admin only)
router.get('/:id', requirePermission('settings'), logUserActivity('get user by id'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-__v')
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch user' 
    });
  }
});

// Update user by ID (Admin only)
router.put('/:id', requirePermission('settings'), logUserActivity('update user by id'), async (req, res) => {
  try {
    const { role, isActive, permissions } = req.body;
    
    const updateData = { updatedBy: req.userId };
    if (role) {
      updateData.role = role;
      updateData.permissions = User.getRolePermissions(role);
    }
    if (isActive !== undefined) updateData.isActive = isActive;
    if (permissions) updateData.permissions = permissions;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update user' 
    });
  }
});

// Deactivate user (Admin only)
router.delete('/:id', requirePermission('settings'), logUserActivity('deactivate user'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedBy: req.userId },
      { new: true }
    ).select('-__v');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      data: user,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to deactivate user' 
    });
  }
});

// Get user statistics (Admin only)
router.get('/stats/overview', requirePermission('settings'), logUserActivity('get user stats'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = totalUsers - activeUsers;
    
    const roleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const recentUsers = await User.find()
      .select('fullName email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        roleStats,
        recentUsers
      }
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch user statistics' 
    });
  }
});

module.exports = router;
