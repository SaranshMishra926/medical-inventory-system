import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StockTrends = () => {
  // Sample data for Medicine Stock Levels chart
  const stockLevelsData = [
    { month: 'Jan', stock: 1200 },
    { month: 'Feb', stock: 1350 },
    { month: 'Mar', stock: 1280 },
    { month: 'Apr', stock: 1450 },
    { month: 'May', stock: 1380 },
    { month: 'Jun', stock: 1420 }
  ];

  // Sample data for Top 5 Medicines chart
  const topMedicinesData = [
    { name: 'Medicine A', quantity: 450, change: -5 },
    { name: 'Medicine B', quantity: 380, change: -3 },
    { name: 'Medicine C', quantity: 320, change: -7 },
    { name: 'Medicine D', quantity: 290, change: -2 },
    { name: 'Medicine E', quantity: 250, change: -4 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card border border-dark-border rounded-lg p-3 shadow-lg">
          <p className="text-dark-text font-medium">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Medicine Stock Levels Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-dark-text">Medicine Stock Levels</h3>
          <div className="flex items-center text-green-400">
            <TrendingUp size={16} className="mr-1" />
            <span className="text-sm font-medium">+15%</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockLevelsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
              <XAxis 
                dataKey="month" 
                stroke="#a0a0a0"
                fontSize={12}
              />
              <YAxis 
                stroke="#a0a0a0"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="stock" 
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Top 5 Medicines Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-dark-text">Top 5 Medicines by Quantity</h3>
          <div className="flex items-center text-red-400">
            <TrendingDown size={16} className="mr-1" />
            <span className="text-sm font-medium">-5%</span>
          </div>
        </div>
        <div className="space-y-4">
          {topMedicinesData.map((medicine, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-dark-text font-medium text-sm">{medicine.name}</span>
                  <span className="text-dark-text font-bold">{medicine.quantity}</span>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(medicine.quantity / 500) * 100}%` }}
                    transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                    className="bg-gradient-to-r from-purple-primary to-purple-secondary h-2 rounded-full"
                  />
                </div>
              </div>
              <div className="ml-4 flex items-center text-red-400">
                <TrendingDown size={12} className="mr-1" />
                <span className="text-xs font-medium">{medicine.change}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default StockTrends;
