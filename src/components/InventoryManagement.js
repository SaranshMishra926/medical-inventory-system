import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Calendar,
  AlertCircle
} from 'lucide-react';

const InventoryManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterManufacturer, setFilterManufacturer] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [formData, setFormData] = useState({
    medicineName: '',
    saltComposition: '',
    batchNumber: '',
    price: '',
    stockQuantity: '',
    category: '',
    manufacturer: '',
    supplierInfo: '',
    expiryDate: ''
  });

  // Sample inventory data
  const inventoryData = [
  {
    id: 1,
      medicineName: 'Paracetamol',
      category: 'Fever Reducer',
      manufacturer: 'HealthPlus',
      quantity: 1200,
      expiryDate: '2025-11-15',
      price: 2.50
  },
  {
    id: 2,
      medicineName: 'Amoxicillin',
    category: 'Antibiotic',
      manufacturer: 'BioMed',
      quantity: 500,
      expiryDate: '2025-03-20',
      price: 5.20
  },
  {
    id: 3,
      medicineName: 'Aspirin',
      category: 'Pain Relief',
      manufacturer: 'HealthPlus',
      quantity: 800,
      expiryDate: '2025-08-10',
      price: 1.80
  },
  {
    id: 4,
      medicineName: 'Vitamin D3',
      category: 'Vitamins',
      manufacturer: 'NutriLife',
      quantity: 300,
      expiryDate: '2025-12-05',
      price: 8.90
  },
  {
    id: 5,
      medicineName: 'Metformin',
    category: 'Diabetes',
      manufacturer: 'BioMed',
      quantity: 150,
      expiryDate: '2025-09-18',
      price: 3.75
    }
  ];

  const categories = ['All', 'Fever Reducer', 'Antibiotic', 'Pain Relief', 'Vitamins', 'Diabetes'];
  const manufacturers = ['All', 'HealthPlus', 'BioMed', 'NutriLife'];

  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === '' || filterCategory === 'All' || item.category === filterCategory;
    const matchesManufacturer = filterManufacturer === '' || filterManufacturer === 'All' || item.manufacturer === filterManufacturer;
    
    return matchesSearch && matchesCategory && matchesManufacturer;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsModalOpen(false);
    setFormData({
      medicineName: '',
      saltComposition: '',
      batchNumber: '',
      price: '',
      stockQuantity: '',
      category: '',
      manufacturer: '',
      supplierInfo: '',
      expiryDate: ''
    });
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      medicineName: medicine.medicineName,
      saltComposition: '',
      batchNumber: '',
      price: medicine.price.toString(),
      stockQuantity: medicine.quantity.toString(),
      category: medicine.category,
      manufacturer: medicine.manufacturer,
      supplierInfo: '',
      expiryDate: medicine.expiryDate
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      console.log('Deleting medicine:', id);
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
                {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
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
                    Medicine Name *
                    </label>
                    <input
                      type="text"
                    name="medicineName"
                    value={formData.medicineName}
                      onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  />
                      </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Salt Composition *
                  </label>
                  <input
                    type="text"
                    name="saltComposition"
                    value={formData.saltComposition}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  />
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Batch Number *
                    </label>
                    <input
                      type="text"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  />
                      </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  />
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Fever Reducer">Fever Reducer</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Vitamins">Vitamins</option>
                    <option value="Diabetes">Diabetes</option>
                    </select>
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Manufacturer *
                    </label>
                    <select
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  >
                    <option value="">Select Manufacturer</option>
                    <option value="HealthPlus">HealthPlus</option>
                    <option value="BioMed">BioMed</option>
                    <option value="NutriLife">NutriLife</option>
                    </select>
                  </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Supplier Info *
                    </label>
                  <textarea
                    name="supplierInfo"
                    value={formData.supplierInfo}
                      onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent resize-none"
                  />
                  </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Expiry Date *
                    </label>
                    <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                      />
                    </div>
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
                  {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
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
              Inventory Management
            </h1>
            <p className="text-gray-400">
              Manage your medicine inventory and track stock levels
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-primary text-white rounded-lg font-medium mt-4 sm:mt-0"
          >
            <Plus size={20} />
            <span>Add Medicine</span>
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
              placeholder="Search medicines, categories, manufacturers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent appearance-none"
            >
              {categories.map(category => (
                <option key={category} value={category === 'All' ? '' : category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Manufacturer Filter */}
          <div className="relative">
            <select
              value={filterManufacturer}
              onChange={(e) => setFilterManufacturer(e.target.value)}
              className="px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent appearance-none"
            >
              {manufacturers.map(manufacturer => (
                <option key={manufacturer} value={manufacturer === 'All' ? '' : manufacturer}>
                  {manufacturer}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Inventory Table */}
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
                  Medicine Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Manufacturer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredData.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-dark-bg transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {item.medicineName}
                    </div>
                    <div className="text-sm text-gray-400">
                      ${item.price}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">
                      {item.manufacturer}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-white">
                      {item.quantity.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
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

      {/* Modal */}
      <Modal />
    </div>
  );
};

export default InventoryManagement;
