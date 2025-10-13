import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Package, 
  AlertTriangle, 
  Search, 
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useDebounce, getStatusColor, formatDate, getDaysUntilExpiry } from '../utils';
import Card from '../components/Card';
import MedicineModal from '../components/MedicineModal';

const Inventory = () => {
  const { medicines, suppliers, addMedicine, updateMedicine, deleteMedicine, isApiAvailable } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter medicines based on search and filters
  const filteredMedicines = medicines.filter(medicine => {
    const name = medicine.name || '';
    const generic = medicine.generic || medicine.genericName || '';
    const category = medicine.category || '';
    
    const matchesSearch = name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         generic.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         category.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || 
      (filterStatus === 'Active' && medicine.isActive === true) ||
      (filterStatus === 'Inactive' && medicine.isActive === false) ||
      (medicine.status && medicine.status === filterStatus);
    const matchesCategory = filterCategory === 'All' || category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddMedicine = () => {
    setEditingMedicine(null);
    setIsModalOpen(true);
  };

  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine);
    setIsModalOpen(true);
  };

  const handleDeleteMedicine = async (medicineId) => {
    try {
      await deleteMedicine(medicineId);
      setSuccessMessage('Medicine deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
    setShowDeleteConfirm(null);
  };

  const handleSubmitMedicine = async (formData) => {
    try {
      if (editingMedicine) {
        await updateMedicine(editingMedicine._id, formData);
        setSuccessMessage('Medicine updated successfully!');
      } else {
        await addMedicine(formData);
        setSuccessMessage('Medicine added successfully!');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving medicine:', error);
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Name', 'Generic', 'Dosage', 'Quantity', 'Threshold', 'Status', 'Expiry Date', 'Supplier'],
      ...filteredMedicines.map(medicine => [
        medicine.name,
        medicine.generic,
        medicine.dosage,
        medicine.quantity,
        medicine.threshold,
        medicine.status,
        medicine.expiryDate,
        medicine.supplier?.name || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medicines-inventory.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const categories = [...new Set(medicines.map(m => m.category).filter(Boolean))];
  const statuses = ['All', 'Active', 'Inactive'];

  return (
    <div className="p-6 space-y-6">
      {/* Data Source Banner */}
      {!isApiAvailable && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-yellow-500" size={20} />
            <div>
              <h3 className="text-yellow-500 font-semibold">Working with Local Data</h3>
              <p className="text-yellow-400 text-sm">
                Backend server is not connected. All changes are saved locally and will be lost on page refresh.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-green-500 font-medium">{successMessage}</p>
          </div>
        </motion.div>
      )}
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">Inventory Management</h1>
        <p className="text-text-secondary text-lg">
          Manage your medicine inventory and track stock levels.
        </p>
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
                placeholder="Search medicines..."
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

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleAddMedicine}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Plus size={16} />
              <span>Add Medicine</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Medicines', value: medicines.length, icon: Package, color: 'bg-blue-500' },
          { title: 'Low Stock Alerts', value: medicines.filter(m => m.status === 'Low Stock').length, icon: AlertTriangle, color: 'bg-orange-500' },
          { title: 'Expiring Soon', value: medicines.filter(m => getDaysUntilExpiry(m.expiryDate) <= 30 && getDaysUntilExpiry(m.expiryDate) > 0).length, icon: Package, color: 'bg-red-500' }
        ].map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} delay={0.2 + index * 0.1}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-white mb-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-xl`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Medicines Table */}
      <Card delay={0.5}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Medicine Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Generic Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Dosage
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Threshold
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredMedicines.map((medicine, index) => (
                <motion.tr
                  key={medicine.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-700/30 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-200">
                      {medicine.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {medicine.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {medicine.generic}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {medicine.dosage}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-200">
                      {medicine.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {medicine.threshold}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(medicine.isActive ? 'active' : 'inactive')}`}>
                      {medicine.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {formatDate(medicine.expiryDate)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getDaysUntilExpiry(medicine.expiryDate) > 0 
                        ? `${getDaysUntilExpiry(medicine.expiryDate)} days left`
                        : 'Expired'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditMedicine(medicine)}
                        className="text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(medicine.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
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
      </Card>

      {/* Medicine Modal */}
      <MedicineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitMedicine}
        medicine={editingMedicine}
        suppliers={suppliers}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this medicine? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMedicine(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Inventory;
