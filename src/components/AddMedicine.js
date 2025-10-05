import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle } from 'lucide-react';

const AddMedicine = () => {
  const [formData, setFormData] = useState({
    medicineName: '',
    saltComposition: '',
    batchNumber: '',
    price: '',
    stockQuantity: '',
    category: '',
    supplierInfo: '',
    expiryDate: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Antibiotics',
    'Pain Relief',
    'Cardiovascular',
    'Diabetes',
    'Respiratory',
    'Gastrointestinal',
    'Neurological',
    'Dermatological',
    'Vitamins & Supplements',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.medicineName.trim()) {
      newErrors.medicineName = 'Medicine name is required';
    }
    if (!formData.saltComposition.trim()) {
      newErrors.saltComposition = 'Salt composition is required';
    }
    if (!formData.batchNumber.trim()) {
      newErrors.batchNumber = 'Batch number is required';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.stockQuantity || formData.stockQuantity <= 0) {
      newErrors.stockQuantity = 'Valid stock quantity is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.supplierInfo.trim()) {
      newErrors.supplierInfo = 'Supplier information is required';
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.expiryDate = 'Expiry date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      // Reset form
      setFormData({
        medicineName: '',
        saltComposition: '',
        batchNumber: '',
        price: '',
        stockQuantity: '',
        category: '',
        supplierInfo: '',
        expiryDate: ''
      });
      alert('Medicine added successfully!');
    }, 1000);
  };

  const InputField = ({ label, name, type = 'text', placeholder, required = false, textarea = false }) => {
    const hasError = errors[name];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-dark-text">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {textarea ? (
          <textarea
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            placeholder={placeholder}
            rows={3}
            className={`
              w-full px-4 py-3 bg-dark-card border rounded-2xl text-dark-text placeholder-dark-muted
              focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent
              transition-all duration-200 resize-none
              ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-dark-border hover:border-purple-primary/50'}
            `}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`
              w-full px-4 py-3 bg-dark-card border rounded-2xl text-dark-text placeholder-dark-muted
              focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent
              transition-all duration-200
              ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-dark-border hover:border-purple-primary/50'}
            `}
          />
        )}
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center text-red-400 text-sm"
          >
            <AlertCircle size={16} className="mr-1" />
            {hasError}
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-dark-text mb-2">Add New Medicine</h1>
        <p className="text-dark-muted">Enter the details of the new medicine to add to your inventory.</p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="bg-dark-card border border-dark-border rounded-2xl p-8 shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Medicine Name */}
          <InputField
            label="Medicine Name"
            name="medicineName"
            placeholder="Enter medicine name"
            required
          />

          {/* Salt Composition */}
          <InputField
            label="Salt Composition"
            name="saltComposition"
            placeholder="Enter salt composition"
            required
          />

          {/* Batch Number */}
          <InputField
            label="Batch Number"
            name="batchNumber"
            placeholder="Enter batch number"
            required
          />

          {/* Price */}
          <InputField
            label="Price"
            name="price"
            type="number"
            placeholder="Enter price"
            required
          />

          {/* Stock Quantity */}
          <InputField
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            placeholder="Enter stock quantity"
            required
          />

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-dark-text">
              Category <span className="text-red-400 ml-1">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`
                w-full px-4 py-3 bg-dark-card border rounded-2xl text-dark-text
                focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent
                transition-all duration-200
                ${errors.category ? 'border-red-500 focus:ring-red-500' : 'border-dark-border hover:border-purple-primary/50'}
              `}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center text-red-400 text-sm"
              >
                <AlertCircle size={16} className="mr-1" />
                {errors.category}
              </motion.div>
            )}
          </div>

          {/* Supplier Info */}
          <div className="md:col-span-2">
            <InputField
              label="Supplier Information"
              name="supplierInfo"
              placeholder="Enter supplier details"
              required
              textarea
            />
          </div>

          {/* Expiry Date */}
          <div className="md:col-span-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-text">
                Expiry Date <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted" size={20} />
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className={`
                    w-full pl-12 pr-4 py-3 bg-dark-card border rounded-2xl text-dark-text
                    focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent
                    transition-all duration-200
                    ${errors.expiryDate ? 'border-red-500 focus:ring-red-500' : 'border-dark-border hover:border-purple-primary/50'}
                  `}
                />
              </div>
              {errors.expiryDate && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center text-red-400 text-sm"
                >
                  <AlertCircle size={16} className="mr-1" />
                  {errors.expiryDate}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-end mt-8"
        >
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              px-8 py-3 bg-purple-primary text-white font-semibold rounded-2xl
              hover:bg-purple-secondary transition-all duration-200 shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isSubmitting ? 'animate-pulse' : ''}
            `}
          >
            {isSubmitting ? 'Adding Medicine...' : 'Add Medicine'}
          </motion.button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default AddMedicine;
