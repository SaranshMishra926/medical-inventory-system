import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

const ChartCard = ({ 
  title, 
  children, 
  className = '', 
  delay = 0,
  ...props 
}) => {
  return (
    <Card 
      className={`${className}`} 
      delay={delay}
      {...props}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <div className="w-full h-px bg-gray-700"></div>
      </div>
      <div className="h-64">
        {children}
      </div>
    </Card>
  );
};

export default ChartCard;
