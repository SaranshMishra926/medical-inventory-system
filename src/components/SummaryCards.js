import React from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, Clock } from 'lucide-react';

const SummaryCards = () => {
  const cards = [
    {
      title: 'Total Medicines',
      value: '1,250',
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Low Stock Alerts',
      value: '35',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      change: '+5%',
      changeType: 'negative'
    },
    {
      title: 'Expiring Soon',
      value: '12',
      icon: Clock,
      color: 'bg-red-500',
      change: '-8%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-primary/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-muted text-sm font-medium mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-dark-text mb-2">{card.value}</p>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${
                    card.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {card.change}
                  </span>
                  <span className="text-dark-muted text-sm ml-2">vs last month</span>
                </div>
              </div>
              <div className={`${card.color} p-3 rounded-xl`}>
                <Icon size={24} className="text-white" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
