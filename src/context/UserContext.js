import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('meditrack-user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return {
      fullName: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@meditrack.com',
      role: 'Administrator',
      profilePicture: null,
      permissions: {
        dashboard: true,
        inventory: true,
        orders: true,
        suppliers: true,
        reports: true,
        settings: true
      }
    };
  });

  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('meditrack-notifications');
    if (savedNotifications) {
      return JSON.parse(savedNotifications);
    }
    return {
      orderUpdates: true,
      lowStockAlerts: true,
      expiryReminders: true,
      supplierMessages: false,
      systemUpdates: true
    };
  });

  // Role-based permissions
  const getRolePermissions = (role) => {
    const permissions = {
      Administrator: {
        dashboard: true,
        inventory: true,
        orders: true,
        suppliers: true,
        reports: true,
        settings: true
      },
      Pharmacist: {
        dashboard: true,
        inventory: true,
        orders: true,
        suppliers: false,
        reports: true,
        settings: false
      },
      'Inventory Manager': {
        dashboard: true,
        inventory: true,
        orders: false,
        suppliers: true,
        reports: true,
        settings: false
      },
      Viewer: {
        dashboard: true,
        inventory: true,
        orders: true,
        suppliers: true,
        reports: true,
        settings: false
      }
    };
    return permissions[role] || permissions.Viewer;
  };

  // Update user profile
  const updateUser = (updates) => {
    const newUser = { ...user, ...updates };
    
    // Update permissions if role changed
    if (updates.role) {
      newUser.permissions = getRolePermissions(updates.role);
    }
    
    setUser(newUser);
    localStorage.setItem('meditrack-user', JSON.stringify(newUser));
  };

  // Update notifications
  const updateNotifications = (updates) => {
    const newNotifications = { ...notifications, ...updates };
    setNotifications(newNotifications);
    localStorage.setItem('meditrack-notifications', JSON.stringify(newNotifications));
  };

  // Check if user has permission for a specific page
  const hasPermission = (page) => {
    return user.permissions[page] || false;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('meditrack-user');
    localStorage.removeItem('meditrack-notifications');
    localStorage.removeItem('meditrack-theme');
    setUser({
      fullName: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@meditrack.com',
      role: 'Administrator',
      profilePicture: null,
      permissions: {
        dashboard: true,
        inventory: true,
        orders: true,
        suppliers: true,
        reports: true,
        settings: true
      }
    });
    setNotifications({
      orderUpdates: true,
      lowStockAlerts: true,
      expiryReminders: true,
      supplierMessages: false,
      systemUpdates: true
    });
  };

  // Reset all settings
  const resetAllSettings = () => {
    localStorage.clear();
    window.location.reload();
  };

  const value = {
    user,
    notifications,
    updateUser,
    updateNotifications,
    hasPermission,
    logout,
    resetAllSettings,
    getRolePermissions
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
