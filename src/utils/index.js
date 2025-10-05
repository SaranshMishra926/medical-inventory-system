import { useState, useEffect } from 'react';

// Compute medicine status based on quantity and threshold
export const computeStatus = (quantity, threshold) => {
  if (quantity <= threshold) {
    return 'Low Stock';
  }
  return 'Good';
};

// Format date to readable string
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Get status color for badges
export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'low stock':
      return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    case 'good':
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'delivered':
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'cancelled':
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'active':
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'inactive':
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

// Custom hook for debounced search
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Generate sample chart data
export const generateChartData = (medicines) => {
  const monthlyData = [
    { month: 'Jan', quantity: 1200 },
    { month: 'Feb', quantity: 1350 },
    { month: 'Mar', quantity: 1100 },
    { month: 'Apr', quantity: 1450 },
    { month: 'May', quantity: 1300 },
    { month: 'Jun', quantity: 1250 }
  ];

  const topMedicines = medicines
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map(medicine => ({
      name: medicine.name,
      quantity: medicine.quantity,
      change: Math.floor(Math.random() * 20) - 10 // Random change between -10% and +10%
    }));

  return { monthlyData, topMedicines };
};

// Calculate days until expiry
export const getDaysUntilExpiry = (expiryDate) => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get expiry status
export const getExpiryStatus = (expiryDate) => {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring';
  return 'good';
};

// Validate form fields
export const validateForm = (formData, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].toString().trim() === '') {
      errors[field] = `${field} is required`;
    }
  });

  // Email validation
  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }

  // Phone validation
  if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
    errors.phone = 'Invalid phone format';
  }

  // Number validation
  if (formData.quantity && (isNaN(formData.quantity) || formData.quantity < 0)) {
    errors.quantity = 'Quantity must be a positive number';
  }

  if (formData.threshold && (isNaN(formData.threshold) || formData.threshold < 0)) {
    errors.threshold = 'Threshold must be a positive number';
  }

  return errors;
};
