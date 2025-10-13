const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Clerk authentication middleware
const requireAuth = ClerkExpressRequireAuth({
  onError: (error) => {
    console.error('Clerk authentication error:', error);
  }
});

// Middleware to get user from Clerk
const getUserFromClerk = async (req, res, next) => {
  try {
    if (req.auth && req.auth.userId) {
      // Get user from database using Clerk ID
      const User = require('../models/User');
      const user = await User.findOne({ clerkId: req.auth.userId });
      
      if (user) {
        req.user = user;
        req.userId = user._id;
      } else {
        // Create user if doesn't exist
        const newUser = new User({
          clerkId: req.auth.userId,
          email: req.auth.sessionClaims?.email,
          firstName: req.auth.sessionClaims?.firstName,
          lastName: req.auth.sessionClaims?.lastName,
          fullName: `${req.auth.sessionClaims?.firstName} ${req.auth.sessionClaims?.lastName}`,
          profileImageUrl: req.auth.sessionClaims?.imageUrl,
          role: req.auth.sessionClaims?.publicMetadata?.role || 'Staff'
        });
        
        // Set permissions based on role
        newUser.permissions = User.getRolePermissions(newUser.role);
        
        await newUser.save();
        req.user = newUser;
        req.userId = newUser._id;
      }
    }
    next();
  } catch (error) {
    console.error('Error getting user from Clerk:', error);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
};

// Middleware to check permissions
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: `You don't have permission to access ${permission}`
      });
    }
    
    next();
  };
};

// Middleware to check if user is active
const requireActiveUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (!req.user.isActive) {
    return res.status(403).json({ 
      error: 'Account deactivated',
      message: 'Your account has been deactivated. Please contact administrator.'
    });
  }
  
  next();
};

// Middleware to log user activity
const logUserActivity = (action) => {
  return (req, res, next) => {
    if (req.user) {
      console.log(`User ${req.user.email} performed ${action} at ${new Date().toISOString()}`);
    }
    next();
  };
};

module.exports = {
  requireAuth,
  getUserFromClerk,
  requirePermission,
  requireActiveUser,
  logUserActivity
};
