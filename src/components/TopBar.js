import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, Moon, Sun, LogOut, Settings } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const TopBar = () => {
  const { theme, toggleTheme, alerts } = useInventory();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement search functionality here
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotificationsDropdown(false);
  };

  const handleNotificationsClick = () => {
    setShowNotificationsDropdown(!showNotificationsDropdown);
    setShowProfileDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('meditrack-user');
    window.location.href = '/landing';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotificationsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 bg-background-secondary border-b border-border-primary px-6 flex items-center justify-between relative z-10">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
          />
          <input
            type="text"
            placeholder="Search medicines, orders, suppliers..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-colors"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={handleNotificationsClick}
            className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-colors"
          >
            <Bell size={20} />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                {alerts.length}
              </span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotificationsDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-80 bg-background-secondary border border-border-primary rounded-lg shadow-lg z-50"
              >
                <div className="p-4 border-b border-border-primary">
                  <h3 className="text-text-primary font-medium">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.slice(0, 5).map((alert, index) => (
                      <div key={alert.id} className="p-3 border-b border-border-primary hover:bg-background-tertiary transition-colors">
                        <p className="text-sm text-text-secondary">{alert.message}</p>
                        <p className="text-xs text-text-tertiary mt-1">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-text-secondary text-sm">No notifications</p>
                    </div>
                  )}
                  {alerts.length > 5 && (
                    <div className="p-3 text-center border-t border-border-primary">
                      <button className="text-sm text-primary-400 hover:text-primary-300">
                        View all {alerts.length} notifications
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={handleProfileClick}
            className="flex items-center space-x-3 p-2 hover:bg-background-tertiary rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-text-primary">Dr. Sarah Johnson</p>
              <p className="text-xs text-text-secondary">Administrator</p>
            </div>
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-48 bg-background-secondary border border-border-primary rounded-lg shadow-lg z-50"
              >
                <div className="p-2">
                  <button className="w-full flex items-center px-3 py-2 text-sm text-text-secondary hover:bg-background-tertiary rounded-lg transition-colors">
                    <User size={16} className="mr-3" />
                    Profile
                  </button>
                  <button className="w-full flex items-center px-3 py-2 text-sm text-text-secondary hover:bg-background-tertiary rounded-lg transition-colors">
                    <Settings size={16} className="mr-3" />
                    Settings
                  </button>
                  <hr className="my-2 border-border-primary" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-background-tertiary rounded-lg transition-colors"
                  >
                    <LogOut size={16} className="mr-3" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default TopBar;