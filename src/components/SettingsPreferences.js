import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Palette, 
  Shield, 
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SettingsPreferences = () => {
  const { theme, updateTheme, resetTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('password');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const accentColors = [
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#22C55E' },
    { name: 'Orange', value: '#F97316' }
  ];

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    console.log('Password updated:', passwordForm);
    alert('Password updated successfully!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleThemeToggle = () => {
    updateTheme({ mode: theme.mode === 'dark' ? 'light' : 'dark' });
  };

  const handleAccentColorChange = (color) => {
    updateTheme({ accentColor: color });
  };

  const handleSavePreferences = () => {
    alert('Preferences saved successfully!');
  };

  const handleCheckUpdates = () => {
    alert('You\'re on the latest version!');
  };

  const handleResetTheme = () => {
    resetTheme();
    alert('Theme reset to defaults!');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const tabs = [
    { id: 'password', label: 'Change Password', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: SettingsIcon }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-400">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* Full-width Settings Layout */}
      <div className="space-y-6">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-dark-card border border-dark-border rounded-2xl p-6"
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-primary text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-bg'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-primary/10 rounded-lg">
                    <Shield size={20} className="text-purple-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Change Password</h3>
                    <p className="text-sm text-gray-400">Update your account password for security</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-3 py-2 pr-10 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                      >
                        {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full px-3 py-2 pr-10 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                      >
                        {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full px-3 py-2 pr-10 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                      >
                        {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-6 py-2 bg-purple-primary text-white rounded-lg hover:bg-purple-secondary transition-colors"
                    >
                      <Save size={16} />
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-primary/10 rounded-lg">
                    <Palette size={20} className="text-purple-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Appearance</h3>
                    <p className="text-sm text-gray-400">Customize the look and feel of your dashboard</p>
                  </div>
                </div>

                {/* Dark/Light Mode Toggle */}
                <div className="bg-dark-bg border border-dark-border rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-1">Dark / Light Mode</h4>
                      <p className="text-sm text-gray-400">Switch between dark and light themes</p>
                    </div>
                    <button
                      onClick={handleThemeToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        theme.mode === 'dark' ? 'bg-purple-primary' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          theme.mode === 'dark' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Accent Color Selector */}
                <div className="bg-dark-bg border border-dark-border rounded-lg p-6">
                  <h4 className="text-lg font-medium text-white mb-4">Accent Color</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {accentColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleAccentColorChange(color.value)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          theme.accentColor === color.value
                            ? 'border-purple-primary bg-purple-primary/10'
                            : 'border-dark-border hover:border-gray-400'
                        }`}
                      >
                        <div className="text-center">
                          <div 
                            className="w-8 h-8 rounded mx-auto mb-2"
                            style={{ backgroundColor: color.value }}
                          />
                          <span className="text-sm font-medium text-white">
                            {color.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleSavePreferences}
                    className="flex items-center space-x-2 px-6 py-2 bg-purple-primary text-white rounded-lg hover:bg-purple-secondary transition-colors"
                  >
                    <Save size={16} />
                    <span>Save Preferences</span>
                  </button>
                  <button
                    onClick={handleResetTheme}
                    className="flex items-center space-x-2 px-6 py-2 border border-dark-border text-gray-300 rounded-lg hover:bg-dark-bg transition-colors"
                  >
                    <RefreshCw size={16} />
                    <span>Reset Theme</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-primary/10 rounded-lg">
                    <SettingsIcon size={20} className="text-purple-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">System</h3>
                    <p className="text-sm text-gray-400">Manage system settings and updates</p>
                  </div>
                </div>

                {/* Check for Updates */}
                <div className="bg-dark-bg border border-dark-border rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-1">Check for Updates</h4>
                      <p className="text-sm text-gray-400">Check if there are any system updates available</p>
                    </div>
                    <button
                      onClick={handleCheckUpdates}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-primary text-white rounded-lg hover:bg-purple-secondary transition-colors"
                    >
                      <CheckCircle size={16} />
                      <span>Check Updates</span>
                    </button>
                  </div>
                </div>

                {/* Reset All Settings */}
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-red-400 mb-1">Reset All Settings</h4>
                      <p className="text-sm text-red-300">This will reset all your settings to default values. This action cannot be undone.</p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to reset all settings? This action cannot be undone.')) {
                          resetTheme();
                          alert('All settings have been reset to defaults!');
                        }
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <AlertCircle size={16} />
                      <span>Reset Settings</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPreferences;