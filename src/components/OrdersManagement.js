import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Trash2, 
  X,
  Calendar,
  ShoppingCart
} from 'lucide-react';

const OrdersManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplierName: '',
    medicineList: '',
    quantity: '',
    totalPrice: '',
    orderDate: ''
  });

  // Sample orders data
  const ordersData = [
    {
      id: 'ORD-001',
      supplier: 'HealthPlus Ltd.',
      date: '2024-01-16',
      totalItems: 3,
      status: 'Pending',
      totalPrice: 125.50
    },
    {
      id: 'ORD-002',
      supplier: 'BioMed Corp.',
      date: '2024-01-15',
      totalItems: 5,
      status: 'Delivered',
      totalPrice: 450.75
    },
    {
      id: 'ORD-003',
      supplier: 'NutriLife Inc.',
      date: '2024-01-14',
      totalItems: 2,
      status: 'Cancelled',
      totalPrice: 89.25
    },
    {
      id: 'ORD-004',
      supplier: 'HealthPlus Ltd.',
      date: '2024-01-13',
      totalItems: 4,
      status: 'Delivered',
      totalPrice: 320.00
    },
    {
      id: 'ORD-005',
      supplier: 'BioMed Corp.',
      date: '2024-01-12',
      totalItems: 1,
      status: 'Pending',
      totalPrice: 75.30
    }
  ];

  const statusOptions = ['All', 'Pending', 'Delivered', 'Cancelled'];

  const filteredData = ordersData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === '' || filterStatus === 'All' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'Delivered':
        return 'text-green-400 bg-green-400/10';
      case 'Cancelled':
        return 'text-red-400 bg-red-400/10';
          default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order submitted:', formData);
    setIsModalOpen(false);
    setFormData({
      supplierName: '',
      medicineList: '',
      quantity: '',
      totalPrice: '',
      orderDate: ''
    });
  };

  const handleView = (order) => {
    console.log('Viewing order:', order);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      console.log('Deleting order:', id);
    }
  };

  const Modal = () => (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Create New Order
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Supplier Name *
                  </label>
                  <select
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  >
                    <option value="">Select Supplier</option>
                    <option value="HealthPlus Ltd.">HealthPlus Ltd.</option>
                    <option value="BioMed Corp.">BioMed Corp.</option>
                    <option value="NutriLife Inc.">NutriLife Inc.</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="totalPrice"
                    value={formData.totalPrice}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Order Date *
                  </label>
      <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      name="orderDate"
                      value={formData.orderDate}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                    />
                  </div>
          </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Medicine List *
                  </label>
                  <textarea
                    name="medicineList"
                    value={formData.medicineList}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Enter medicine names and quantities..."
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-dark-border text-gray-300 rounded-lg hover:bg-dark-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-primary text-white rounded-lg hover:bg-purple-secondary transition-colors"
                >
                  Create Order
                </button>
              </div>
            </form>
          </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Orders Management
            </h1>
            <p className="text-gray-400">
              Track and manage customer orders and deliveries
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-primary text-white rounded-lg font-medium mt-4 sm:mt-0"
          >
            <Plus size={20} />
            <span>Create Order</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
          <input
            type="text"
              placeholder="Search orders by ID or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
            />
        </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent appearance-none"
            >
              {statusOptions.map(status => (
                <option key={status} value={status === 'All' ? '' : status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredData.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-dark-bg transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {order.id}
                    </div>
                    <div className="text-sm text-gray-400">
                      ${order.totalPrice}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">
                      {order.supplier}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-white">
                      {order.totalItems}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleView(order)}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Orders', value: ordersData.length, icon: ShoppingCart },
          { title: 'Pending Orders', value: ordersData.filter(o => o.status === 'Pending').length, icon: Calendar },
          { title: 'Delivered Orders', value: ordersData.filter(o => o.status === 'Delivered').length, icon: ShoppingCart }
        ].map((summary, index) => {
          const Icon = summary.icon;
          return (
          <motion.div
              key={summary.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-dark-card border border-dark-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">{summary.title}</p>
                  <p className="text-2xl font-bold text-white">{summary.value}</p>
              </div>
                <div className="p-3 bg-purple-primary/10 rounded-lg">
                  <Icon size={20} className="text-purple-primary" />
                  </div>
                      </div>
            </motion.div>
          );
        })}
                  </div>

      {/* Modal */}
      <Modal />
    </div>
  );
};

export default OrdersManagement;
