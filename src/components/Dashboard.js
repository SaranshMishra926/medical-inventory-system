import React from 'react';
import { motion } from 'framer-motion';
import SummaryCards from './SummaryCards';
import StockTrends from './StockTrends';
import AddMedicine from './AddMedicine';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-400">
          Welcome back! Here's what's happening with your pharmacy today.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Section */}
      <StockTrends />

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add Medicine', icon: 'Package' },
            { label: 'New Order', icon: 'ShoppingCart' },
            { label: 'Add Supplier', icon: 'Users' },
            { label: 'Generate Report', icon: 'BarChart3' }
          ].map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center p-4 rounded-lg border border-dark-border hover:border-purple-primary/50 transition-all duration-200 group"
            >
              <div className="p-3 bg-purple-primary/10 rounded-lg mb-2 group-hover:scale-110 transition-transform duration-200">
                <div className="w-6 h-6 bg-purple-primary rounded"></div>
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white">
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
