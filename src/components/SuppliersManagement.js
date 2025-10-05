import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';

const SuppliersManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    supplierName: '',
    contact: '',
    email: '',
    address: '',
    phone: '',
    status: 'Active'
  });

  // Sample suppliers data
  const suppliersData = [
  {
    id: 1,
      supplierName: 'HealthPlus Pharmaceuticals',
      contact: 'John Smith',
    email: 'john@healthplus.com',
      phone: '+1 (555) 123-4567',
      address: '123 Medical Ave, Health City, HC 12345',
      lastOrder: '2024-01-15',
      status: 'Active',
      totalOrders: 45
  },
  {
    id: 2,
      supplierName: 'BioMed Solutions',
      contact: 'Sarah Johnson',
      email: 'sarah@biomed.com',
      phone: '+1 (555) 234-5678',
      address: '456 Pharma St, Medical District, MD 67890',
      lastOrder: '2024-01-12',
      status: 'Active',
      totalOrders: 32
  },
  {
    id: 3,
      supplierName: 'NutriLife Corp',
      contact: 'Mike Davis',
      email: 'mike@nutrilife.com',
      phone: '+1 (555) 345-6789',
      address: '789 Wellness Blvd, Health Town, HT 54321',
      lastOrder: '2024-01-08',
      status: 'Inactive',
      totalOrders: 18
  },
  {
    id: 4,
      supplierName: 'MediCore Industries',
      contact: 'Lisa Wilson',
      email: 'lisa@medicore.com',
      phone: '+1 (555) 456-7890',
      address: '321 Healthcare Dr, Pharma City, PC 98765',
      lastOrder: '2024-01-10',
      status: 'Active',
      totalOrders: 28
  },
  {
    id: 5,
      supplierName: 'VitaHealth Ltd',
      contact: 'David Brown',
      email: 'david@vitahealth.com',
      phone: '+1 (555) 567-8901',
      address: '654 Medicine Way, Wellness Valley, WV 13579',
      lastOrder: '2024-01-05',
      status: 'Inactive',
      totalOrders: 12
    }
  ];

  const filteredData = suppliersData.filter(supplier => {
    return supplier.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           supplier.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
           supplier.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Supplier submitted:', formData);
    setIsModalOpen(false);
    setFormData({
      supplierName: '',
      contact: '',
      email: '',
      address: '',
      phone: '',
      status: 'Active'
    });
    // Show success toast
    alert('Supplier added successfully!');
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      supplierName: supplier.supplierName,
      contact: supplier.contact,
      email: supplier.email,
      address: supplier.address,
      phone: supplier.phone,
      status: supplier.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      console.log('Deleting supplier:', id);
      alert('Supplier deleted successfully!');
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
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
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
                    <input
                      type="text"
                      name="supplierName"
                      value={formData.supplierName}
                      onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  />
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Person *
                    </label>
                    <input
                      type="text"
                    name="contact"
                    value={formData.contact}
                      onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  />
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  />
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                    />
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent resize-none"
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
                  {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
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
              Suppliers Directory
            </h1>
            <p className="text-gray-400">
              Manage your supplier relationships and contact information
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-primary text-white rounded-lg font-medium mt-4 sm:mt-0"
          >
            <Plus size={20} />
            <span>Add Supplier</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6"
      >
        <div className="relative">
          <Search 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Search suppliers by name, contact, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredData.map((supplier, index) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-primary/30"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {supplier.supplierName}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  {supplier.contact}
                </p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  supplier.status === 'Active' 
                    ? 'text-green-400 bg-green-400/10' 
                    : 'text-red-400 bg-red-400/10'
                }`}>
                  {supplier.status === 'Active' ? (
                    <CheckCircle size={12} className="mr-1" />
                  ) : (
                    <XCircle size={12} className="mr-1" />
                  )}
                  {supplier.status}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEdit(supplier)}
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(supplier.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-300 text-sm">
                <Mail size={16} className="mr-2 text-gray-400" />
                <span className="truncate">{supplier.email}</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Phone size={16} className="mr-2 text-gray-400" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-start text-gray-300 text-sm">
                <MapPin size={16} className="mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs">{supplier.address}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400 text-xs pt-2 border-t border-dark-border">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>Last Order: {new Date(supplier.lastOrder).toLocaleDateString()}</span>
                </div>
                <span>{supplier.totalOrders} orders</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Suppliers', value: suppliersData.length, icon: CheckCircle },
          { title: 'Active Suppliers', value: suppliersData.filter(s => s.status === 'Active').length, icon: CheckCircle },
          { title: 'Inactive Suppliers', value: suppliersData.filter(s => s.status === 'Inactive').length, icon: XCircle }
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

export default SuppliersManagement;
