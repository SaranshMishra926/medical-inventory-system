import React, { createContext, useContext, useState, useEffect } from 'react';
import { medicineAPI, supplierAPI, orderAPI } from '../services/api';
import sampleData from '../data/sampleData.json';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApiAvailable, setIsApiAvailable] = useState(false);

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔍 Loading data from API...');
        setLoading(true);
        setError(null);
        
        // Load all data in parallel
        const [medicinesData, ordersData, suppliersData] = await Promise.all([
          medicineAPI.getAll(),
          orderAPI.getAll(),
          supplierAPI.getAll()
        ]);
        
        console.log('🔍 Medicines data:', medicinesData);
        console.log('🔍 Orders data:', ordersData);
        console.log('🔍 Suppliers data:', suppliersData);
        
        setMedicines(medicinesData.data?.medicines || medicinesData.medicines || medicinesData);
        setOrders(ordersData.data?.orders || ordersData.orders || ordersData);
        setSuppliers(suppliersData.data?.suppliers || suppliersData.suppliers || suppliersData);
        setIsApiAvailable(true);
        console.log('🔍 API data loaded successfully, isApiAvailable set to true');
        
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('meditrack-theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        
        // Load saved color scheme
        const savedColorScheme = JSON.parse(localStorage.getItem('meditrack-color-scheme')) || null;
        if (savedColorScheme) {
          const root = document.documentElement;
          
          const generateColorPalette = (baseColor) => {
            const colors = {
              50: `${baseColor}20`,
              100: `${baseColor}40`,
              200: `${baseColor}60`,
              300: `${baseColor}80`,
              400: `${baseColor}A0`,
              500: baseColor,
              600: baseColor,
              700: baseColor,
              800: baseColor,
              900: baseColor,
            };
            return colors;
          };

          const primaryPalette = generateColorPalette(savedColorScheme.primary);
          const secondaryPalette = generateColorPalette(savedColorScheme.secondary);

          Object.keys(primaryPalette).forEach(key => {
            root.style.setProperty(`--color-primary-${key}`, primaryPalette[key]);
          });

          Object.keys(secondaryPalette).forEach(key => {
            root.style.setProperty(`--color-secondary-${key}`, secondaryPalette[key]);
          });

          root.style.setProperty('--accent-primary', savedColorScheme.primary);
          root.style.setProperty('--accent-secondary', savedColorScheme.secondary);
        }
        
      } catch (err) {
        console.error('❌ Error loading data from API:', err);
        console.log('🔍 Falling back to sample data, isApiAvailable set to false');
        setError('Failed to load data from server - using sample data');
        
        // Use sample data when API fails
        setMedicines(sampleData.medicines);
        setOrders(sampleData.orders);
        setSuppliers(sampleData.suppliers);
        setIsApiAvailable(false);
        
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('meditrack-theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        
        // Load saved color scheme
        const savedColorScheme = JSON.parse(localStorage.getItem('meditrack-color-scheme')) || null;
        if (savedColorScheme) {
          const root = document.documentElement;
          
          const generateColorPalette = (baseColor) => {
            const colors = {
              50: `${baseColor}20`,
              100: `${baseColor}40`,
              200: `${baseColor}60`,
              300: `${baseColor}80`,
              400: `${baseColor}A0`,
              500: baseColor,
              600: baseColor,
              700: baseColor,
              800: baseColor,
              900: baseColor,
            };
            return colors;
          };

          const primaryPalette = generateColorPalette(savedColorScheme.primary);
          const secondaryPalette = generateColorPalette(savedColorScheme.secondary);

          Object.keys(primaryPalette).forEach(key => {
            root.style.setProperty(`--color-primary-${key}`, primaryPalette[key]);
          });

          Object.keys(secondaryPalette).forEach(key => {
            root.style.setProperty(`--color-secondary-${key}`, secondaryPalette[key]);
          });

          root.style.setProperty('--accent-primary', savedColorScheme.primary);
          root.style.setProperty('--accent-secondary', savedColorScheme.secondary);
        }
        
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update alerts whenever medicines change
  useEffect(() => {
    const newAlerts = [];
    medicines.forEach(medicine => {
      if (medicine.quantity <= (medicine.minimumStockLevel || medicine.threshold)) {
        newAlerts.push({
          id: `low-${medicine.id}`,
          type: 'low-stock',
          message: `${medicine.name} is running low (${medicine.quantity}/${medicine.minimumStockLevel || medicine.threshold})`,
          medicineId: medicine.id,
          timestamp: new Date().toISOString()
        });
      }
      const expiryDate = new Date(medicine.expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
        newAlerts.push({
          id: `expiring-${medicine.id}`,
          type: 'expiring',
          message: `${medicine.name} expires in ${daysUntilExpiry} days`,
          medicineId: medicine.id,
          timestamp: new Date().toISOString()
        });
      } else if (daysUntilExpiry <= 0) {
        newAlerts.push({
          id: `expired-${medicine.id}`,
          type: 'expired',
          message: `${medicine.name} has expired`,
          medicineId: medicine.id,
          timestamp: new Date().toISOString()
        });
      }
    });
    setAlerts(newAlerts);
  }, [medicines]);

  // Medicine functions
  const addMedicine = async (medicineData) => {
    console.log('🔍 addMedicine called with:', medicineData);
    try {
      console.log('🔍 Calling API to create medicine...');
      const response = await medicineAPI.create(medicineData);
      console.log('🔍 API Response:', response);
      const newMedicine = response.data || response;
      console.log('🔍 New medicine data:', newMedicine);
      setMedicines(prev => [...prev, newMedicine]);
      setIsApiAvailable(true);
      return newMedicine;
    } catch (error) {
      console.error('❌ Error adding medicine:', error);
      console.log('🔍 Falling back to local state');
      // Fallback to local state update
      const newMedicine = {
        ...medicineData,
        _id: Date.now().toString(),
        status: 'active'
      };
      setMedicines(prev => [...prev, newMedicine]);
      return newMedicine;
    }
  };

  const updateMedicine = async (id, updates) => {
    try {
      if (isApiAvailable) {
        const response = await medicineAPI.update(id, updates);
        const updatedMedicine = response.data || response;
        setMedicines(prev => prev.map(medicine => 
          medicine._id === id ? updatedMedicine : medicine
        ));
        return updatedMedicine;
      } else {
        // Work with local data
        setMedicines(prev => prev.map(medicine => 
          medicine._id === id ? { ...medicine, ...updates } : medicine
        ));
        return { ...updates, _id: id };
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
      // Fallback to local state update
      setMedicines(prev => prev.map(medicine => 
        medicine._id === id ? { ...medicine, ...updates } : medicine
      ));
      return { ...updates, _id: id };
    }
  };

  const deleteMedicine = async (id) => {
    try {
      if (isApiAvailable) {
        await medicineAPI.delete(id);
      }
      setMedicines(prev => prev.filter(medicine => medicine._id !== id));
    } catch (error) {
      console.error('Error deleting medicine:', error);
      // Fallback to local state update
      setMedicines(prev => prev.filter(medicine => medicine._id !== id));
    }
  };

  // Order functions
  const addOrder = async (orderData) => {
    console.log('🔍 addOrder called with:', orderData);
    try {
      console.log('🔍 Calling API to create order...');
      const response = await orderAPI.create(orderData);
      console.log('🔍 API Response:', response);
      const newOrder = response.data || response;
      console.log('🔍 New order data:', newOrder);
      setOrders(prev => [...prev, newOrder]);
      setIsApiAvailable(true);
      return newOrder;
    } catch (error) {
      console.error('❌ Error adding order:', error);
      console.log('🔍 Falling back to local state');
      // Fallback to local state update
      const newOrder = {
        ...orderData,
        _id: Date.now().toString()
      };
      setOrders(prev => [...prev, newOrder]);
      return newOrder;
    }
  };

  const updateOrder = async (id, updates) => {
    try {
      if (isApiAvailable) {
        const response = await orderAPI.update(id, updates);
        const updatedOrder = response.data || response;
        setOrders(prev => prev.map(order => 
          order._id === id ? updatedOrder : order
        ));
        return updatedOrder;
      } else {
        // Work with local data
        setOrders(prev => prev.map(order => 
          order._id === id ? { ...order, ...updates } : order
        ));
        return { ...updates, _id: id };
      }
    } catch (error) {
      console.error('Error updating order:', error);
      // Fallback to local state update
      setOrders(prev => prev.map(order => 
        order._id === id ? { ...order, ...updates } : order
      ));
      return { ...updates, _id: id };
    }
  };

  const deleteOrder = async (id) => {
    try {
      if (isApiAvailable) {
        await orderAPI.delete(id);
      }
      setOrders(prev => prev.filter(order => order._id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
      // Fallback to local state update
      setOrders(prev => prev.filter(order => order._id !== id));
    }
  };

  // Supplier functions
  const addSupplier = async (supplierData) => {
    console.log('🔍 addSupplier called with:', supplierData);
    try {
      console.log('🔍 Calling API to create supplier...');
      const response = await supplierAPI.create(supplierData);
      console.log('🔍 API Response:', response);
      const newSupplier = response.data || response;
      console.log('🔍 New supplier data:', newSupplier);
      setSuppliers(prev => [...prev, newSupplier]);
      setIsApiAvailable(true);
      return newSupplier;
    } catch (error) {
      console.error('❌ Error adding supplier:', error);
      console.log('🔍 Falling back to local state');
      // Fallback to local state update
      const newSupplier = {
        ...supplierData,
        _id: Date.now().toString(),
        status: 'active'
      };
      setSuppliers(prev => [...prev, newSupplier]);
      return newSupplier;
    }
  };

  const updateSupplier = async (id, updates) => {
    try {
      if (isApiAvailable) {
        const response = await supplierAPI.update(id, updates);
        const updatedSupplier = response.data || response;
        setSuppliers(prev => prev.map(supplier => 
          supplier._id === id ? updatedSupplier : supplier
        ));
        return updatedSupplier;
      } else {
        // Work with local data
        setSuppliers(prev => prev.map(supplier => 
          supplier._id === id ? { ...supplier, ...updates } : supplier
        ));
        return { ...updates, _id: id };
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
      // Fallback to local state update
      setSuppliers(prev => prev.map(supplier => 
        supplier._id === id ? { ...supplier, ...updates } : supplier
      ));
      return { ...updates, _id: id };
    }
  };

  const deleteSupplier = async (id) => {
    try {
      if (isApiAvailable) {
        await supplierAPI.delete(id);
      }
      setSuppliers(prev => prev.filter(supplier => supplier._id !== id));
    } catch (error) {
      console.error('Error deleting supplier:', error);
      // Fallback to local state update
      setSuppliers(prev => prev.filter(supplier => supplier._id !== id));
    }
  };

  // Dashboard stats
  const getDashboardStats = () => {
    const totalMedicines = medicines.length;
    const lowStockCount = medicines.filter(m => m.quantity <= (m.minimumStockLevel || m.minStockLevel)).length;
    const expiringSoon = medicines.filter(m => {
      const expiryDate = new Date(m.expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    return {
      totalMedicines,
      lowStockCount,
      expiringSoon,
      pendingOrders
    };
  };

  // Theme functions
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('meditrack-theme', newTheme);
    
    // Apply theme class to document
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

      const value = {
        medicines,
        orders,
        suppliers,
        alerts,
        theme,
        loading,
        error,
        isApiAvailable,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        addOrder,
        updateOrder,
        deleteOrder,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        getDashboardStats,
        toggleTheme
      };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
