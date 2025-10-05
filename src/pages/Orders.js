import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ShoppingCart, 
  Search, 
  Eye,
  Trash2,
  Package,
  Calendar,
  DollarSign,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useDebounce, getStatusColor, formatDate, formatCurrency } from '../utils';
import Card from '../components/Card';

const Orders = () => {
  const { orders, addOrder, deleteOrder } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    medicineName: '',
    quantity: '',
    supplierName: '',
    orderDate: '',
    status: 'Pending'
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.supplierName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         order.medicineName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         order.id.toString().includes(debouncedSearch);
    
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.medicineName.trim()) {
      errors.medicineName = 'Medicine name is required';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }
    
    if (!formData.supplierName.trim()) {
      errors.supplierName = 'Supplier name is required';
    }
    
    if (!formData.orderDate) {
      errors.orderDate = 'Order date is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new order object
      const newOrder = {
        id: Date.now(), // Simple ID generation
        medicineName: formData.medicineName.trim(),
        quantity: parseInt(formData.quantity),
        supplierName: formData.supplierName.trim(),
        orderDate: formData.orderDate,
        status: formData.status,
        total: formData.quantity * 10, // Mock pricing - $10 per unit
        createdAt: new Date().toISOString()
      };

      // Add order to context (which handles localStorage)
      addOrder(newOrder);

      // Show success message
      setShowSuccess(true);
      
      // Clear form
      setFormData({
        medicineName: '',
        quantity: '',
        supplierName: '',
        orderDate: '',
        status: 'Pending'
      });
      
      // Close form after delay
      setTimeout(() => {
        setShowCreateForm(false);
        setShowSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle delete order
  const handleDeleteOrder = (orderId) => {
    deleteOrder(orderId);
    setShowDeleteConfirm(null);
  };

  // Close form
  const handleCloseForm = () => {
    setShowCreateForm(false);
    setFormData({
      medicineName: '',
      quantity: '',
      supplierName: '',
      orderDate: '',
      status: 'Pending'
    });
    setFormErrors({});
  };

  const statuses = ['All', 'Pending', 'Approved', 'Delivered', 'Cancelled'];
  const orderStatuses = ['Pending', 'Approved', 'Delivered'];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">Orders Management</h1>
        <p className="text-text-secondary text-lg">
          Track and manage all your pharmacy orders.
        </p>
        <div className="w-full h-px bg-border-primary mt-6"></div>
      </motion.div>

      {/* Search and Filters */}
      <Card delay={0.1}>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Create Order Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <Plus size={16} />
            <span>Create Order</span>
          </button>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card delay={0.2}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{orders.length}</p>
            </div>
            <div className="p-3 bg-primary-500 rounded-lg">
              <ShoppingCart size={20} className="text-white" />
            </div>
          </div>
        </Card>

        <Card delay={0.3}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Orders</p>
              <p className="text-2xl font-bold text-white">
                {orders.filter(order => order.status === 'Pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <Calendar size={20} className="text-white" />
            </div>
          </div>
        </Card>

        <Card delay={0.4}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Delivered Orders</p>
              <p className="text-2xl font-bold text-white">
                {orders.filter(order => order.status === 'Delivered').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <Package size={20} className="text-white" />
            </div>
          </div>
        </Card>

        <Card delay={0.5}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
              </p>
            </div>
            <div className="p-3 bg-primary-500 rounded-lg">
              <DollarSign size={20} className="text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Create Order Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && handleCloseForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create New Order</h2>
                <button
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center space-x-3"
                  >
                    <CheckCircle size={20} className="text-green-400" />
                    <span className="text-green-400 font-medium">Order created successfully!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Medicine Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      name="medicineName"
                      value={formData.medicineName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                        formErrors.medicineName ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Enter medicine name"
                    />
                    {formErrors.medicineName && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {formErrors.medicineName}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="1"
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                        formErrors.quantity ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Enter quantity"
                    />
                    {formErrors.quantity && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {formErrors.quantity}
                      </p>
                    )}
                  </div>

                  {/* Supplier Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Supplier Name *
                    </label>
                    <input
                      type="text"
                      name="supplierName"
                      value={formData.supplierName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                        formErrors.supplierName ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Enter supplier name"
                    />
                    {formErrors.supplierName && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {formErrors.supplierName}
                      </p>
                    )}
                  </div>

                  {/* Order Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Order Date *
                    </label>
                    <input
                      type="date"
                      name="orderDate"
                      value={formData.orderDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                        formErrors.orderDate ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                    {formErrors.orderDate && (
                      <p className="mt-1 text-sm text-red-400 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {formErrors.orderDate}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    >
                      {orderStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        <span>Create Order</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orders Table */}
      <Card delay={0.6}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Order ID</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Medicine</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Quantity</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Supplier</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Date</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Status</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Total</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-border-primary hover:bg-background-tertiary transition-colors"
                  >
                    <td className="py-4 px-4 text-text-primary font-medium">#{order.id}</td>
                    <td className="py-4 px-4 text-text-primary">{order.medicineName}</td>
                    <td className="py-4 px-4 text-text-primary">{order.quantity}</td>
                    <td className="py-4 px-4 text-text-primary">{order.supplierName}</td>
                    <td className="py-4 px-4 text-text-primary">{formatDate(order.orderDate)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.status === 'Approved' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-text-primary">{formatCurrency(order.total)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowOrderDetails(order)}
                          className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} className="text-gray-400" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(order.id)}
                          className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No orders found</p>
              <p className="text-gray-500 text-sm">Create your first order to get started</p>
            </div>
          )}
        </div>
      </Card>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowOrderDetails(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Order Details</h3>
                <button
                  onClick={() => setShowOrderDetails(null)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Order ID</label>
                  <p className="text-white font-medium">#{showOrderDetails.id}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Medicine Name</label>
                  <p className="text-white">{showOrderDetails.medicineName}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Quantity</label>
                  <p className="text-white">{showOrderDetails.quantity}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Supplier</label>
                  <p className="text-white">{showOrderDetails.supplierName}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Order Date</label>
                  <p className="text-white">{formatDate(showOrderDetails.orderDate)}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Status</label>
                  <p className="text-white">{showOrderDetails.status}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Total</label>
                  <p className="text-white font-bold">{formatCurrency(showOrderDetails.total)}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} className="text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Order</h3>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete this order? This action cannot be undone.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(showDeleteConfirm)}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;