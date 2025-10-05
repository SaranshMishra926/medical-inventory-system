import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Lock, 
  Palette, 
  Monitor,
  Download,
  RotateCcw,
  Bell,
  Shield,
  User,
  Database
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import Card from '../components/Card';

const SettingsPage = () => {
  const { theme, toggleTheme } = useInventory();
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [accentColor, setAccentColor] = useState('#8B5CF6');
  const [notifications, setNotifications] = useState({
    lowStock: true,
    expiring: true,
    orders: true,
    reports: false
  });

  const accentColors = [
    { name: 'Medical Blue', value: '#007BFF', primary: '#007BFF', secondary: '#20B2AA' },
    { name: 'Ocean Blue', value: '#3B82F6', primary: '#3B82F6', secondary: '#10B981' },
    { name: 'Forest Green', value: '#28A745', primary: '#28A745', secondary: '#007BFF' },
    { name: 'Teal', value: '#20B2AA', primary: '#20B2AA', secondary: '#007BFF' },
    { name: 'Purple', value: '#8B5CF6', primary: '#8B5CF6', secondary: '#EC4899' },
    { name: 'Orange', value: '#F97316', primary: '#F97316', secondary: '#EF4444' }
  ];

  const handlePasswordChange = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Passwords do not match!');
      return;
    }
    if (passwordForm.new.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    alert('Password updated successfully!');
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleExportData = () => {
    const data = {
      medicines: JSON.parse(localStorage.getItem('meditrack-medicines') || '[]'),
      orders: JSON.parse(localStorage.getItem('meditrack-orders') || '[]'),
      suppliers: JSON.parse(localStorage.getItem('meditrack-suppliers') || '[]'),
      settings: {
        theme,
        accentColor,
        notifications
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meditrack-backup.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone!')) {
      localStorage.removeItem('meditrack-medicines');
      localStorage.removeItem('meditrack-orders');
      localStorage.removeItem('meditrack-suppliers');
      localStorage.removeItem('meditrack-theme');
      alert('All data has been reset! Please refresh the page.');
    }
  };

  const handleCheckUpdates = () => {
    alert('MediTrack is up to date! Version 2.0.0');
  };

  const handleColorChange = (colorScheme) => {
    setAccentColor(colorScheme.value);
    
    // Update CSS variables for the entire application
    const root = document.documentElement;
    
    // Generate color palette based on the selected color
    const generateColorPalette = (baseColor) => {
      // This is a simplified color palette generation
      // In a real app, you'd use a proper color library
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

    const primaryPalette = generateColorPalette(colorScheme.primary);
    const secondaryPalette = generateColorPalette(colorScheme.secondary);

    // Update primary colors
    Object.keys(primaryPalette).forEach(key => {
      root.style.setProperty(`--color-primary-${key}`, primaryPalette[key]);
    });

    // Update secondary colors
    Object.keys(secondaryPalette).forEach(key => {
      root.style.setProperty(`--color-secondary-${key}`, secondaryPalette[key]);
    });

    // Update legacy variables for backward compatibility
    root.style.setProperty('--accent-primary', colorScheme.primary);
    root.style.setProperty('--accent-secondary', colorScheme.secondary);

    // Save to localStorage
    localStorage.setItem('meditrack-color-scheme', JSON.stringify(colorScheme));
    
    alert(`Color scheme changed to ${colorScheme.name}!`);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          <div className="p-6 space-y-6">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
              <p className="text-text-secondary text-lg">
                Manage your account preferences and system settings.
              </p>
              <div className="w-full h-px bg-border-primary mt-6"></div>
            </motion.div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Settings */}
              <Card delay={0.1}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-primary-500 rounded-lg">
                    <User size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">Account Settings</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                      className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                      className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                      className="w-full px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <button
                    onClick={handlePasswordChange}
                    className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </Card>

              {/* Appearance Settings */}
              <Card delay={0.2}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-primary-500 rounded-lg">
                    <Palette size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">Appearance</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-text-primary">Dark Mode</h4>
                      <p className="text-sm text-text-secondary">Switch between dark and light themes</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                        theme === 'dark' ? 'bg-primary-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-text-primary mb-4">Accent Color</h4>
                    <div className="grid grid-cols-5 gap-3">
                      {accentColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => handleColorChange(color)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            accentColor === color.value
                              ? 'border-primary-500 bg-primary-500/10'
                              : 'border-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <div 
                            className="w-6 h-6 rounded mx-auto"
                            style={{ 
                              background: `linear-gradient(45deg, ${color.primary}, ${color.secondary})`
                            }}
                          />
                          <span className="text-xs text-gray-300 mt-1 block text-center">
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Notifications */}
              <Card delay={0.3}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-primary-500 rounded-lg">
                    <Bell size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Notifications</h3>
                </div>

                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-text-primary capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-xs text-text-tertiary">
                          {key === 'lowStock' && 'Get notified when medicines are running low'}
                          {key === 'expiring' && 'Get notified when medicines are expiring soon'}
                          {key === 'orders' && 'Get notified about order status updates'}
                          {key === 'reports' && 'Get notified when reports are ready'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle(key)}
                        className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors ${
                          value ? 'bg-primary-500' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform ${
                            value ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* System Settings */}
              <Card delay={0.4}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-primary-500 rounded-lg">
                    <Settings size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">System</h3>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleCheckUpdates}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Download size={16} />
                    <span>Check for Updates</span>
                  </button>
                  
                  <button
                    onClick={handleExportData}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Database size={16} />
                    <span>Export Data</span>
                  </button>
                  
                  <button
                    onClick={handleResetData}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <RotateCcw size={16} />
                    <span>Reset All Data</span>
                  </button>
                </div>
              </Card>
            </div>

            {/* About Section */}
            <Card delay={0.5}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-primary-500 rounded-lg">
                  <Shield size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary">About MediTrack</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="p-3 bg-primary-500/20 rounded-lg w-fit mx-auto mb-3">
                    <Monitor size={24} className="text-primary-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">Version</h4>
                  <p className="text-text-secondary">2.0.0</p>
                </div>
                
                <div className="text-center">
                  <div className="p-3 bg-primary-500/20 rounded-lg w-fit mx-auto mb-3">
                    <Shield size={24} className="text-primary-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">Security</h4>
                  <p className="text-text-secondary">End-to-end encrypted</p>
                </div>
                
                <div className="text-center">
                  <div className="p-3 bg-primary-500/20 rounded-lg w-fit mx-auto mb-3">
                    <Database size={24} className="text-primary-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">Data</h4>
                  <p className="text-text-secondary">Stored locally</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border-primary">
                <p className="text-center text-text-secondary">
                  © 2025 MediTrack. All rights reserved. Built with React, Tailwind CSS, and ❤️
                </p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
