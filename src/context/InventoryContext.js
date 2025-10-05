import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMedicines = JSON.parse(localStorage.getItem('meditrack-medicines')) || [];
    const savedOrders = JSON.parse(localStorage.getItem('meditrack-orders')) || [];
    const savedSuppliers = JSON.parse(localStorage.getItem('meditrack-suppliers')) || [];
    const savedTheme = localStorage.getItem('meditrack-theme') || 'dark';
    const savedColorScheme = JSON.parse(localStorage.getItem('meditrack-color-scheme')) || null;
    
    setMedicines(savedMedicines);
    setOrders(savedOrders);
    setSuppliers(savedSuppliers);
    setTheme(savedTheme);
    
    // Apply theme class to document
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    
    // Load saved color scheme
    if (savedColorScheme) {
      const root = document.documentElement;
      
      // Generate color palette based on the saved color
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

      // Update primary colors
      Object.keys(primaryPalette).forEach(key => {
        root.style.setProperty(`--color-primary-${key}`, primaryPalette[key]);
      });

      // Update secondary colors
      Object.keys(secondaryPalette).forEach(key => {
        root.style.setProperty(`--color-secondary-${key}`, secondaryPalette[key]);
      });

      // Update legacy variables for backward compatibility
      root.style.setProperty('--accent-primary', savedColorScheme.primary);
      root.style.setProperty('--accent-secondary', savedColorScheme.secondary);
    }
    
    // Initialize with sample data if empty
    if (savedMedicines.length === 0) {
      const sampleMedicines = [
        {
          id: 1,
          name: 'Amoxicillin',
          generic: 'Amoxicillin Trihydrate',
          dosage: '500mg',
          quantity: 20,
          threshold: 50,
          expiryDate: '2024-12-15',
          status: 'Low Stock',
          supplier: 'HealthPlus',
          category: 'Antibiotic',
          manufacturer: 'HealthPlus Pharma'
        },
        {
          id: 2,
          name: 'Ibuprofen',
          generic: 'Ibuprofen',
          dosage: '200mg',
          quantity: 15,
          threshold: 30,
          expiryDate: '2025-03-20',
          status: 'Low Stock',
          supplier: 'BioMed',
          category: 'Pain Relief',
          manufacturer: 'BioMed Solutions'
        },
        {
          id: 3,
          name: 'Paracetamol',
          generic: 'Paracetamol',
          dosage: '500mg',
          quantity: 120,
          threshold: 40,
          expiryDate: '2025-08-10',
          status: 'Good',
          supplier: 'HealthPlus',
          category: 'Fever Reducer',
          manufacturer: 'HealthPlus Pharma'
        },
        {
          id: 4,
          name: 'Lisinopril',
          generic: 'Lisinopril',
          dosage: '10mg',
          quantity: 8,
          threshold: 20,
          expiryDate: '2025-01-30',
          status: 'Low Stock',
          supplier: 'MedSupply',
          category: 'Blood Pressure',
          manufacturer: 'MedSupply Corp'
        },
        {
          id: 5,
          name: 'Metformin',
          generic: 'Metformin Hydrochloride',
          dosage: '500mg',
          quantity: 5,
          threshold: 15,
          expiryDate: '2024-11-25',
          status: 'Low Stock',
          supplier: 'BioMed',
          category: 'Diabetes',
          manufacturer: 'BioMed Solutions'
        }
      ];
      setMedicines(sampleMedicines);
      localStorage.setItem('meditrack-medicines', JSON.stringify(sampleMedicines));
    }

    if (savedSuppliers.length === 0) {
      const sampleSuppliers = [
        { 
          id: 1, 
          name: 'HealthPlus', 
          contact: 'John Smith', 
          email: 'john@healthplus.com', 
          phone: '+1-555-0123',
          address: '123 Medical Ave, City, State 12345',
          status: 'Active',
          lastOrder: '2024-01-15',
          totalOrders: 45
        },
        { 
          id: 2, 
          name: 'BioMed', 
          contact: 'Sarah Johnson', 
          email: 'sarah@biomed.com', 
          phone: '+1-555-0456',
          address: '456 Pharma St, City, State 67890',
          status: 'Active',
          lastOrder: '2024-01-10',
          totalOrders: 32
        },
        { 
          id: 3, 
          name: 'MedSupply', 
          contact: 'Mike Davis', 
          email: 'mike@medsupply.com', 
          phone: '+1-555-0789',
          address: '789 Health Blvd, City, State 13579',
          status: 'Active',
          lastOrder: '2024-01-08',
          totalOrders: 28
        }
      ];
      setSuppliers(sampleSuppliers);
      localStorage.setItem('meditrack-suppliers', JSON.stringify(sampleSuppliers));
    }

    if (savedOrders.length === 0) {
      const sampleOrders = [
        {
          id: 1,
          supplierId: 1,
          supplierName: 'HealthPlus',
          items: [
            { medicineId: 1, name: 'Amoxicillin', quantity: 100, price: 2.50 },
            { medicineId: 3, name: 'Paracetamol', quantity: 200, price: 1.20 }
          ],
          total: 490.00,
          status: 'Delivered',
          orderDate: '2024-01-10',
          deliveryDate: '2024-01-15'
        },
        {
          id: 2,
          supplierId: 2,
          supplierName: 'BioMed',
          items: [
            { medicineId: 2, name: 'Ibuprofen', quantity: 150, price: 1.80 },
            { medicineId: 5, name: 'Metformin', quantity: 100, price: 3.20 }
          ],
          total: 590.00,
          status: 'Pending',
          orderDate: '2024-01-12',
          deliveryDate: '2024-01-18'
        }
      ];
      setOrders(sampleOrders);
      localStorage.setItem('meditrack-orders', JSON.stringify(sampleOrders));
    }
  }, []);

  // Update alerts whenever medicines change
  useEffect(() => {
    const newAlerts = [];
    medicines.forEach(medicine => {
      if (medicine.quantity <= medicine.threshold) {
        newAlerts.push({
          id: `low-${medicine.id}`,
          type: 'low-stock',
          message: `${medicine.name} is running low (${medicine.quantity}/${medicine.threshold})`,
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
  const addMedicine = (medicineData) => {
    const newMedicine = {
      ...medicineData,
      id: Date.now(),
      status: medicineData.quantity <= medicineData.threshold ? 'Low Stock' : 'Good'
    };
    const updatedMedicines = [...medicines, newMedicine];
    setMedicines(updatedMedicines);
    localStorage.setItem('meditrack-medicines', JSON.stringify(updatedMedicines));
    return newMedicine;
  };

  const updateMedicine = (id, updates) => {
    const updatedMedicines = medicines.map(medicine => 
      medicine.id === id 
        ? { 
            ...medicine, 
            ...updates, 
            status: updates.quantity <= updates.threshold ? 'Low Stock' : 'Good' 
          }
        : medicine
    );
    setMedicines(updatedMedicines);
    localStorage.setItem('meditrack-medicines', JSON.stringify(updatedMedicines));
  };

  const deleteMedicine = (id) => {
    const updatedMedicines = medicines.filter(medicine => medicine.id !== id);
    setMedicines(updatedMedicines);
    localStorage.setItem('meditrack-medicines', JSON.stringify(updatedMedicines));
  };

  // Order functions
  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: Date.now()
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('meditrack-orders', JSON.stringify(updatedOrders));
    return newOrder;
  };

  const updateOrder = (id, updates) => {
    const updatedOrders = orders.map(order => 
      order.id === id ? { ...order, ...updates } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('meditrack-orders', JSON.stringify(updatedOrders));
  };

  const deleteOrder = (id) => {
    const updatedOrders = orders.filter(order => order.id !== id);
    setOrders(updatedOrders);
    localStorage.setItem('meditrack-orders', JSON.stringify(updatedOrders));
  };

  // Supplier functions
  const addSupplier = (supplierData) => {
    const newSupplier = {
      ...supplierData,
      id: Date.now(),
      status: 'Active',
      lastOrder: null,
      totalOrders: 0
    };
    const updatedSuppliers = [...suppliers, newSupplier];
    setSuppliers(updatedSuppliers);
    localStorage.setItem('meditrack-suppliers', JSON.stringify(updatedSuppliers));
    return newSupplier;
  };

  const updateSupplier = (id, updates) => {
    const updatedSuppliers = suppliers.map(supplier => 
      supplier.id === id ? { ...supplier, ...updates } : supplier
    );
    setSuppliers(updatedSuppliers);
    localStorage.setItem('meditrack-suppliers', JSON.stringify(updatedSuppliers));
  };

  const deleteSupplier = (id) => {
    const updatedSuppliers = suppliers.filter(supplier => supplier.id !== id);
    setSuppliers(updatedSuppliers);
    localStorage.setItem('meditrack-suppliers', JSON.stringify(updatedSuppliers));
  };

  // Dashboard stats
  const getDashboardStats = () => {
    const totalMedicines = medicines.length;
    const lowStockCount = medicines.filter(m => m.quantity <= m.threshold).length;
    const expiringSoon = medicines.filter(m => {
      const expiryDate = new Date(m.expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;

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
