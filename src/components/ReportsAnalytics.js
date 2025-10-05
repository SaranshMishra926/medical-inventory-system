import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  FileText
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const ReportsAnalytics = () => {
  const [reportType, setReportType] = useState('Inventory');
  const [period, setPeriod] = useState('This Month');

  // Sample data for different report types
  const inventoryData = [
    { month: 'Jan', stock: 1200, lowStock: 35 },
    { month: 'Feb', stock: 1350, lowStock: 28 },
    { month: 'Mar', stock: 1280, lowStock: 42 },
    { month: 'Apr', stock: 1450, lowStock: 25 },
    { month: 'May', stock: 1380, lowStock: 38 },
    { month: 'Jun', stock: 1420, lowStock: 31 }
  ];

  const salesData = [
    { month: 'Jan', sales: 45000, orders: 120 },
    { month: 'Feb', sales: 52000, orders: 135 },
    { month: 'Mar', sales: 48000, orders: 128 },
    { month: 'Apr', sales: 61000, orders: 145 },
    { month: 'May', sales: 55000, orders: 138 },
    { month: 'Jun', sales: 58000, orders: 142 }
  ];

  const expiryData = [
    { month: 'Jan', expiring: 15, expired: 3 },
    { month: 'Feb', expiring: 12, expired: 2 },
    { month: 'Mar', expiring: 18, expired: 5 },
    { month: 'Apr', expiring: 10, expired: 1 },
    { month: 'May', expiring: 22, expired: 4 },
    { month: 'Jun', expiring: 16, expired: 2 }
  ];

  const topSuppliersData = [
    { name: 'HealthPlus', value: 35, color: '#8B5CF6' },
    { name: 'BioMed', value: 28, color: '#3B82F6' },
    { name: 'NutriLife', value: 20, color: '#22C55E' },
    { name: 'MediCore', value: 12, color: '#F97316' },
    { name: 'Others', value: 5, color: '#6B7280' }
  ];

  const getChartData = () => {
    switch (reportType) {
      case 'Sales':
        return salesData;
      case 'Expiry':
        return expiryData;
      default:
        return inventoryData;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card border border-dark-border rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleGenerateReport = () => {
    // Mock CSV export
    const csvData = getChartData();
    const csvContent = [
      ['Month', reportType === 'Sales' ? 'Sales,Orders' : reportType === 'Expiry' ? 'Expiring,Expired' : 'Stock,Low Stock'],
      ...csvData.map(item => [
        item.month,
        reportType === 'Sales' ? `${item.sales},${item.orders}` : 
        reportType === 'Expiry' ? `${item.expiring},${item.expired}` : 
        `${item.stock},${item.lowStock}`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType.toLowerCase()}_report_${period.toLowerCase().replace(' ', '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert('Report generated successfully!');
  };

  const summaryCards = [
    {
      title: 'Total Sales',
      value: '$308,000',
      change: '+12%',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      title: 'Expired Medicines',
      value: '17',
      change: '-8%',
      changeType: 'positive',
      icon: TrendingDown
    },
    {
      title: 'Top Supplier',
      value: 'HealthPlus',
      change: '35%',
      changeType: 'neutral',
      icon: BarChart3
    }
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
          Reports & Analytics
        </h1>
        <p className="text-gray-400">
          Generate comprehensive reports and analyze your pharmacy performance
        </p>
      </motion.div>

      {/* Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
              >
                <option value="Inventory">Inventory</option>
                <option value="Sales">Sales</option>
                <option value="Expiry">Expiry</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Period
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-primary focus:border-transparent"
              >
                <option value="This Month">This Month</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="Year">Year</option>
              </select>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateReport}
            className="flex items-center space-x-2 px-6 py-2 bg-purple-primary text-white rounded-lg font-medium"
          >
            <Download size={20} />
            <span>Generate Report</span>
          </motion.button>
          </div>
        </motion.div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-dark-card border border-dark-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">
              {reportType} Report - {period}
            </h3>
            <div className="flex items-center space-x-2">
              {reportType === 'Sales' ? (
                <BarChart3 size={20} className="text-purple-primary" />
              ) : (
                <TrendingUp size={20} className="text-purple-primary" />
              )}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {reportType === 'Sales' ? (
                <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sales" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
              ) : (
                <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                    dataKey={reportType === 'Expiry' ? 'expiring' : 'stock'} 
                stroke="#8B5CF6" 
                strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
              )}
          </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Suppliers Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-dark-card border border-dark-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">
              Top Suppliers Distribution
            </h3>
            <PieChart size={20} className="text-purple-primary" />
            </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={topSuppliersData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                  outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                  {topSuppliersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-dark-card border border-dark-border rounded-lg p-3 shadow-lg">
                          <p className="text-white font-medium">{payload[0].name}</p>
                          <p className="text-sm text-gray-300">{payload[0].value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RechartsPieChart>
          </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {topSuppliersData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <span className="text-white font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
        <motion.div
              key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-dark-card border border-dark-border rounded-2xl p-6"
        >
              <div className="flex items-center justify-between">
            <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-white mb-2">{card.value}</p>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${
                      card.changeType === 'positive' ? 'text-green-400' : 
                      card.changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {card.change}
                    </span>
                    <span className="text-gray-400 text-sm ml-2">vs last period</span>
                    </div>
                  </div>
                <div className="p-3 bg-purple-primary/10 rounded-lg">
                  <Icon size={20} className="text-purple-primary" />
                  </div>
                </div>
              </motion.div>
          );
        })}
      </div>

      {/* Additional Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-dark-card border border-dark-border rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Key Performance Indicators
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Inventory Turnover', value: '4.2x', trend: '+0.3' },
            { label: 'Average Order Value', value: '$425', trend: '+$25' },
            { label: 'Customer Satisfaction', value: '94%', trend: '+2%' },
            { label: 'On-Time Delivery', value: '98%', trend: '+1%' }
          ].map((kpi, index) => (
            <div key={index} className="text-center p-4 bg-dark-bg rounded-lg">
              <p className="text-sm text-gray-400 mb-1">{kpi.label}</p>
              <p className="text-xl font-bold text-white mb-1">{kpi.value}</p>
              <p className="text-xs text-green-400">{kpi.trend}</p>
            </div>
            ))}
          </div>
      </motion.div>
    </div>
  );
};

export default ReportsAnalytics;
