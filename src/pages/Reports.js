import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Download, 
  TrendingUp,
  Package,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useInventory } from '../context/InventoryContext';
import { formatCurrency, formatDate } from '../utils';
import Card from '../components/Card';
import ChartCard from '../components/ChartCard';

const Reports = () => {
  const { medicines, orders, suppliers, getDashboardStats } = useInventory();
  const [reportType, setReportType] = useState('Inventory');
  const [period, setPeriod] = useState('This Month');
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = getDashboardStats();

  // Generate sample chart data
  const generateInventoryData = () => {
    return medicines.slice(0, 10).map(medicine => ({
      name: medicine.name,
      quantity: medicine.quantity,
      threshold: medicine.threshold
    }));
  };

  const generateSalesData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      sales: Math.floor(Math.random() * 50000) + 20000,
      orders: Math.floor(Math.random() * 50) + 20
    }));
  };

  const generateExpiryData = () => {
    const expiryCategories = [
      { name: 'Expired', value: medicines.filter(m => new Date(m.expiryDate) < new Date()).length },
      { name: 'Expiring Soon', value: medicines.filter(m => {
        const days = Math.ceil((new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return days <= 30 && days > 0;
      }).length },
      { name: 'Good', value: medicines.filter(m => {
        const days = Math.ceil((new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return days > 30;
      }).length }
    ];
    return expiryCategories;
  };

  const generateSupplierData = () => {
    return suppliers.map(supplier => ({
      name: supplier.name,
      orders: supplier.totalOrders,
      value: Math.floor(Math.random() * 100000) + 50000
    }));
  };

  const COLORS = ['#8B5CF6', '#3B82F6', '#22C55E', '#F97316', '#EF4444'];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create CSV content based on report type
    let csvContent = '';
    let filename = '';
    
    switch (reportType) {
      case 'Inventory':
        csvContent = [
          ['Medicine Name', 'Generic Name', 'Quantity', 'Threshold', 'Status', 'Expiry Date'],
          ...medicines.map(medicine => [
            medicine.name,
            medicine.generic,
            medicine.quantity,
            medicine.threshold,
            medicine.status,
            medicine.expiryDate
          ])
        ].map(row => row.join(',')).join('\n');
        filename = 'inventory-report.csv';
        break;
      case 'Sales':
        csvContent = [
          ['Order ID', 'Supplier', 'Date', 'Total Value', 'Status'],
          ...orders.map(order => [
            order.id,
            order.supplierName,
            order.orderDate,
            order.total,
            order.status
          ])
        ].map(row => row.join(',')).join('\n');
        filename = 'sales-report.csv';
        break;
      case 'Expiry':
        const expiringMedicines = medicines.filter(m => {
          const days = Math.ceil((new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
          return days <= 30;
        });
        csvContent = [
          ['Medicine Name', 'Generic Name', 'Expiry Date', 'Days Until Expiry', 'Quantity'],
          ...expiringMedicines.map(medicine => [
            medicine.name,
            medicine.generic,
            medicine.expiryDate,
            Math.ceil((new Date(medicine.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)),
            medicine.quantity
          ])
        ].map(row => row.join(',')).join('\n');
        filename = 'expiry-report.csv';
        break;
      default:
        break;
    }

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    
    setIsGenerating(false);
  };

  const reportTypes = ['Inventory', 'Sales', 'Expiry'];
  const periods = ['This Month', 'Last 3 Months', 'Year'];

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
              <h1 className="text-3xl font-bold text-text-primary mb-2">Reports & Analytics</h1>
              <p className="text-text-secondary text-lg">
                Generate comprehensive reports and analyze your pharmacy data.
              </p>
              <div className="w-full h-px bg-border-primary mt-6"></div>
            </motion.div>

            {/* Report Controls */}
            <Card delay={0.1}>
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Report Type
                    </label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    >
                      {reportTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Period
                    </label>
                    <select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    >
                      {periods.map(period => (
                        <option key={period} value={period}>{period}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                    isGenerating 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}
                >
                  <Download size={16} />
                  <span>{isGenerating ? 'Generating...' : 'Generate Report'}</span>
                </button>
              </div>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Total Sales', value: formatCurrency(orders.reduce((sum, order) => sum + order.total, 0)), icon: DollarSign, color: 'bg-green-500' },
                { title: 'Expired Medicines', value: medicines.filter(m => new Date(m.expiryDate) < new Date()).length, icon: AlertTriangle, color: 'bg-red-500' },
                { title: 'Top Supplier', value: suppliers.length > 0 ? suppliers[0].name : 'N/A', icon: Users, color: 'bg-blue-500' },
                { title: 'Total Orders', value: orders.length, icon: Package, color: 'bg-primary-500' }
              ].map((card, index) => {
                const Icon = card.icon;
                return (
                  <Card key={card.title} delay={0.2 + index * 0.1}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-text-secondary text-sm font-medium mb-1">{card.title}</p>
                        <p className="text-2xl font-bold text-text-primary mb-2">{card.value}</p>
                      </div>
                      <div className={`${card.color} p-3 rounded-xl`}>
                        <Icon size={24} className="text-white" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inventory Chart */}
              <ChartCard title="Inventory Levels" delay={0.4}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateInventoryData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                      fontSize={10}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }}
                    />
                    <Bar 
                      dataKey="quantity" 
                      fill="#8B5CF6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="threshold" 
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Sales Chart */}
              <ChartCard title="Sales Trend" delay={0.5}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateSalesData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Expiry Chart */}
              <ChartCard title="Medicine Expiry Status" delay={0.6}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={generateExpiryData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {generateExpiryData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Supplier Chart */}
              <ChartCard title="Supplier Performance" delay={0.7}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateSupplierData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                      fontSize={10}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }}
                    />
                    <Bar 
                      dataKey="orders" 
                      fill="#22C55E"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* KPI Section */}
            <Card delay={0.8}>
              <h3 className="text-xl font-semibold text-white mb-6">Key Performance Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Inventory Turnover', value: '4.2x', trend: '+12%', icon: TrendingUp },
                  { title: 'Average Order Value', value: formatCurrency(1250), trend: '+8%', icon: DollarSign },
                  { title: 'Customer Satisfaction', value: '94%', trend: '+3%', icon: Users },
                  { title: 'On-Time Delivery', value: '96%', trend: '+2%', icon: Calendar }
                ].map((kpi, index) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={kpi.title} className="text-center">
                      <div className="flex justify-center mb-2">
                        <div className="p-2 bg-primary-500/20 rounded-lg">
                          <Icon size={20} className="text-primary-400" />
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-1">{kpi.value}</h4>
                      <p className="text-sm text-gray-400 mb-1">{kpi.title}</p>
                      <p className="text-xs text-green-400">{kpi.trend}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
