import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  onClick,
  delay = 0,
  ...props 
}) => {
  const cardClasses = `
    bg-background-secondary border border-border-primary rounded-xl p-6 shadow-lg
    ${hover ? 'hover:shadow-xl hover:border-border-secondary transition-all duration-300 cursor-pointer' : ''}
    ${className}
  `.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
