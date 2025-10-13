const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  profileImageUrl: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['Administrator', 'Pharmacist', 'Inventory Manager', 'Staff', 'Viewer'],
    default: 'Staff'
  },
  permissions: {
    dashboard: { type: Boolean, default: true },
    inventory: { type: Boolean, default: true },
    orders: { type: Boolean, default: true },
    suppliers: { type: Boolean, default: false },
    reports: { type: Boolean, default: false },
    settings: { type: Boolean, default: false }
  },
  notifications: {
    orderUpdates: { type: Boolean, default: true },
    lowStockAlerts: { type: Boolean, default: true },
    expiryReminders: { type: Boolean, default: true },
    supplierMessages: { type: Boolean, default: false },
    systemUpdates: { type: Boolean, default: true }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get role permissions
userSchema.statics.getRolePermissions = function(role) {
  const permissions = {
    Administrator: {
      dashboard: true,
      inventory: true,
      orders: true,
      suppliers: true,
      reports: true,
      settings: true
    },
    Pharmacist: {
      dashboard: true,
      inventory: true,
      orders: true,
      suppliers: false,
      reports: true,
      settings: false
    },
    'Inventory Manager': {
      dashboard: true,
      inventory: true,
      orders: false,
      suppliers: true,
      reports: true,
      settings: false
    },
    Staff: {
      dashboard: true,
      inventory: true,
      orders: true,
      suppliers: false,
      reports: false,
      settings: false
    },
    Viewer: {
      dashboard: true,
      inventory: true,
      orders: true,
      suppliers: true,
      reports: true,
      settings: false
    }
  };
  return permissions[role] || permissions.Viewer;
};

// Instance method to check permissions
userSchema.methods.hasPermission = function(page) {
  return this.permissions[page] || false;
};

// Instance method to update permissions based on role
userSchema.methods.updatePermissionsByRole = function() {
  this.permissions = User.getRolePermissions(this.role);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
