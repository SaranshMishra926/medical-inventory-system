const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  genericName: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Prescription', 'Over-the-Counter', 'Controlled Substance', 'Medical Device', 'Supplies']
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true
  },
  batchNumber: {
    type: String,
    required: true,
    trim: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['tablets', 'capsules', 'ml', 'mg', 'units', 'vials', 'boxes', 'strips']
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  minimumStockLevel: {
    type: Number,
    default: 10,
    min: 0
  },
  maximumStockLevel: {
    type: Number,
    default: 1000,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
medicineSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

// Index for efficient queries
medicineSchema.index({ name: 1, category: 1 });
medicineSchema.index({ expiryDate: 1 });
medicineSchema.index({ quantity: 1 });
medicineSchema.index({ supplier: 1 });

// Virtual for stock status
medicineSchema.virtual('stockStatus').get(function() {
  if (this.quantity <= this.minimumStockLevel) {
    return 'Low Stock';
  } else if (this.quantity >= this.maximumStockLevel) {
    return 'Overstocked';
  } else {
    return 'Normal';
  }
});

// Virtual for expiry status
medicineSchema.virtual('expiryStatus').get(function() {
  const now = new Date();
  const expiryDate = new Date(this.expiryDate);
  const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) {
    return 'Expired';
  } else if (daysUntilExpiry <= 30) {
    return 'Expiring Soon';
  } else {
    return 'Valid';
  }
});

// Instance method to check if medicine is expiring soon
medicineSchema.methods.isExpiringSoon = function(days = 30) {
  const now = new Date();
  const expiryDate = new Date(this.expiryDate);
  const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= days && daysUntilExpiry >= 0;
};

// Instance method to check if medicine is low stock
medicineSchema.methods.isLowStock = function() {
  return this.quantity <= this.minimumStockLevel;
};

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;
