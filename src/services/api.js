import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    // Get token from Clerk if available
    if (window.Clerk && window.Clerk.session) {
      try {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('Failed to get Clerk token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - please sign in again');
    }
    return Promise.reject(error);
  }
);

// Medicine API calls
export const medicineAPI = {
  // Get all medicines
  getAll: async () => {
    const response = await api.get('/inventory');
    return response.data;
  },

  // Get medicine by ID
  getById: async (id) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },

  // Create new medicine
  create: async (medicineData) => {
    const response = await api.post('/inventory', medicineData);
    return response.data;
  },

  // Update medicine
  update: async (id, medicineData) => {
    const response = await api.put(`/inventory/${id}`, medicineData);
    return response.data;
  },

  // Delete medicine
  delete: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },

  // Get low stock medicines
  getLowStock: async () => {
    const response = await api.get('/inventory/alerts/low-stock');
    return response.data;
  },

  // Get expiring medicines
  getExpiring: async (days = 30) => {
    const response = await api.get(`/inventory/alerts/expiring?days=${days}`);
    return response.data;
  }
};

// Supplier API calls
export const supplierAPI = {
  // Get all suppliers
  getAll: async () => {
    const response = await api.get('/suppliers');
    return response.data;
  },

  // Get supplier by ID
  getById: async (id) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  // Create new supplier
  create: async (supplierData) => {
    const response = await api.post('/suppliers', supplierData);
    return response.data;
  },

  // Update supplier
  update: async (id, supplierData) => {
    const response = await api.put(`/suppliers/${id}`, supplierData);
    return response.data;
  },

  // Delete supplier
  delete: async (id) => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  }
};

// Order API calls
export const orderAPI = {
  // Get all orders
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Get order by ID
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create new order
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Update order
  update: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },

  // Delete order
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

  // Update order status
  updateStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  }
};

// Dashboard API calls
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Get inventory summary
  getInventorySummary: async () => {
    const response = await api.get('/dashboard/inventory-summary');
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async () => {
    const response = await api.get('/dashboard/recent-activities');
    return response.data;
  }
};

// Reports API calls
export const reportsAPI = {
  // Get inventory report
  getInventoryReport: async (filters = {}) => {
    const response = await api.get('/reports/inventory', { params: filters });
    return response.data;
  },

  // Get sales report
  getSalesReport: async (filters = {}) => {
    const response = await api.get('/reports/sales', { params: filters });
    return response.data;
  },

  // Get supplier report
  getSupplierReport: async (filters = {}) => {
    const response = await api.get('/reports/suppliers', { params: filters });
    return response.data;
  }
};

// User API calls
export const userAPI = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Get user permissions
  getPermissions: async () => {
    const response = await api.get('/users/permissions');
    return response.data;
  }
};

export default api;