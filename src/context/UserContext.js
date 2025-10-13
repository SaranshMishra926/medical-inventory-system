import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser as useClerkUser } from '@clerk/clerk-react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user: clerkUser, isSignedIn, isLoaded } = useClerkUser();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    lowStockAlerts: true,
    expiryReminders: true,
    supplierMessages: false,
    systemUpdates: true
  });

  // Sync Clerk user with local user state
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      const userData = {
        id: clerkUser.id,
        fullName: clerkUser.fullName || `${clerkUser.firstName} ${clerkUser.lastName}`,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        profilePicture: clerkUser.profileImageUrl,
        role: clerkUser.publicMetadata?.role || 'Administrator',
        permissions: getRolePermissions(clerkUser.publicMetadata?.role || 'Administrator'),
        createdAt: clerkUser.createdAt,
        lastSignInAt: clerkUser.lastSignInAt
      };
      setUser(userData);
      
      // Save to localStorage for persistence
      localStorage.setItem('meditrack-user', JSON.stringify(userData));
    } else if (isLoaded && !isSignedIn) {
      setUser(null);
      localStorage.removeItem('meditrack-user');
    }
  }, [clerkUser, isSignedIn, isLoaded]);

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
      Staff: {
        dashboard: true,
        inventory: true,
        orders: true,
        suppliers: false,
        reports: false,
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

  // Update user profile (this would typically sync with backend)
  const updateUser = async (updates) => {
    if (!user) return;
    
    const newUser = { ...user, ...updates };
    
    // Update permissions if role changed
    if (updates.role) {
      newUser.permissions = getRolePermissions(updates.role);
    }
    
    setUser(newUser);
    localStorage.setItem('meditrack-user', JSON.stringify(newUser));
    
    // Here you would typically make an API call to update the user in your backend
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await clerkUser.getToken()}`
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      // Revert changes on error
      setUser(user);
      localStorage.setItem('meditrack-user', JSON.stringify(user));
    }
  };

  // Update notifications
  const updateNotifications = (updates) => {
    const newNotifications = { ...notifications, ...updates };
    setNotifications(newNotifications);
    localStorage.setItem('meditrack-notifications', JSON.stringify(newNotifications));
  };

  // Check if user has permission for a specific page
  const hasPermission = (page) => {
    return user?.permissions?.[page] || false;
  };

  // Logout function (handled by Clerk)
  const logout = () => {
    // Clerk handles logout automatically
    setUser(null);
    localStorage.removeItem('meditrack-user');
    localStorage.removeItem('meditrack-notifications');
    localStorage.removeItem('meditrack-theme');
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
    getRolePermissions,
    isSignedIn,
    isLoaded
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};