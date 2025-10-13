import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  AlertTriangle, 
  Calendar, 
  ShoppingCart,
  Plus,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useInventory } from '../context/InventoryContext';
import Card from '../components/Card';
import ChartCard from '../components/ChartCard';
import { generateChartData } from '../utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const { medicines, getDashboardStats, loading, error, isApiAvailable } = useInventory();
  const stats = getDashboardStats();
  const { monthlyData, topMedicines } = generateChartData(medicines);

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Error Loading Data</h2>
          <p className="text-text-secondary mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Add Medicine',
      icon: Plus,
      color: 'bg-primary-500 hover:bg-primary-600',
      onClick: () => navigate('/inventory')
    },
    {
      title: 'New Order',
      icon: ShoppingCart,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => navigate('/orders')
    },
    {
      title: 'Add Supplier',
      icon: Package,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => navigate('/suppliers')
    },
    {
      title: 'Generate Report',
      icon: TrendingUp,
      color: 'bg-orange-600 hover:bg-orange-700',
      onClick: () => navigate('/reports')
    }
  ];

  const summaryCards = [
    {
      title: 'Total Medicines',
      value: stats.totalMedicines,
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockCount,
      change: '+5%',
      trend: 'up',
      icon: AlertTriangle,
      color: 'bg-orange-500'
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringSoon,
      change: '-8%',
      trend: 'down',
      icon: Calendar,
      color: 'bg-red-500'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      change: '+10%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-primary-500'
    }
  ];

      return (
        <div className="p-6 space-y-6">
          {/* Data Source Banner */}
          {!isApiAvailable && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4"
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="text-yellow-500" size={20} />
                <div>
                  <h3 className="text-yellow-500 font-semibold">Working with Local Data</h3>
                  <p className="text-yellow-400 text-sm">
                    Backend server is not connected. All changes are saved locally and will be lost on page refresh.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard Overview</h1>
            <p className="text-text-secondary text-lg">
              Welcome back! Here's what's happening with your pharmacy today.
            </p>
          </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          const TrendIcon = card.trend === 'up' ? TrendingUp : TrendingDown;
          const trendColor = card.trend === 'up' ? 'text-green-400' : 'text-red-400';
          
          return (
            <Card key={card.title} delay={index * 0.1} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-text-primary mb-2">{card.value}</p>
                  <div className="flex items-center space-x-1">
                    <TrendIcon size={16} className={trendColor} />
                    <span className={`text-sm font-medium ${trendColor}`}>
                      {card.change}
                    </span>
                    <span className="text-text-tertiary text-sm">vs last month</span>
                  </div>
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
        {/* Medicine Stock Levels Chart */}
        <ChartCard title="Medicine Stock Levels" delay={0.4}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-primary)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-background-secondary)',
                  border: '1px solid var(--color-border-primary)',
                  borderRadius: '8px',
                  color: 'var(--color-text-primary)'
                }}
              />
              <Bar 
                dataKey="quantity" 
                fill="var(--color-primary-500)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top 5 Medicines Chart */}
        <ChartCard title="Top 5 Medicines by Quantity" delay={0.5}>
          <div className="space-y-4">
            {topMedicines.map((medicine, index) => {
              const TrendIcon = medicine.change < 0 ? TrendingDown : TrendingUp;
              const trendColor = medicine.change < 0 ? 'text-red-400' : 'text-green-400';
              const percentage = (medicine.quantity / topMedicines[0].quantity) * 100;
              
              return (
                <div key={medicine.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-text-secondary">
                      {medicine.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-text-primary">
                        {medicine.quantity}
                      </span>
                      <div className="flex items-center space-x-1">
                        <TrendIcon size={14} className={trendColor} />
                        <span className={`text-xs font-medium ${trendColor}`}>
                          {medicine.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-background-tertiary rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-primary-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Quick Actions */}
      <Card delay={0.6}>
        <h3 className="text-xl font-semibold text-text-primary mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className={`${action.color} text-white rounded-xl p-4 flex flex-col items-center space-y-2 transition-all duration-200`}
              >
                <Icon size={24} />
                <span className="font-medium">{action.title}</span>
              </motion.button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
