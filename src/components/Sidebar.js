import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  HelpCircle,
  Pill,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Suppliers', path: '/suppliers', icon: Users },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.aside 
      initial={{ x: 0 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-background-secondary border-r border-border-primary shadow-lg h-full flex flex-col z-20"
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-border-primary">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-3"
          >
            <div className="p-2 bg-primary-500 rounded-lg">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">MediTrack</span>
          </motion.div>
        )}
        
        <button
          onClick={toggleSidebar}
          className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'text-white shadow-lg bg-primary-500'
                  : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Icon 
                size={20} 
                className={`transition-colors duration-200 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-text-tertiary group-hover:text-text-primary'
                } ${isCollapsed ? '' : 'mr-3'}`}
              />
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  {item.name}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Help Section */}
      <div className="p-4 border-t border-border-primary">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-text-secondary hover:bg-background-tertiary hover:text-text-primary ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <HelpCircle 
            size={20} 
            className={`text-text-tertiary hover:text-text-primary ${isCollapsed ? '' : 'mr-3'}`}
          />
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-medium"
            >
              Help
            </motion.span>
          )}
        </motion.button>
      </div>

    </motion.aside>
  );
};

export default Sidebar;