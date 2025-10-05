import React from 'react';
import { motion } from 'framer-motion';

const ToggleSwitch = ({ 
  enabled, 
  onChange, 
  label, 
  description, 
  disabled = false,
  size = 'default' 
}) => {
  const sizeClasses = {
    small: 'w-8 h-4',
    default: 'w-12 h-6',
    large: 'w-16 h-8'
  };

  const thumbSizeClasses = {
    small: 'w-3 h-3',
    default: 'w-5 h-5',
    large: 'w-7 h-7'
  };

  const translateClasses = {
    small: enabled ? 'translate-x-4' : 'translate-x-0',
    default: enabled ? 'translate-x-6' : 'translate-x-0',
    large: enabled ? 'translate-x-8' : 'translate-x-0'
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        {label && (
          <label className="text-sm font-medium text-gray-300 cursor-pointer">
            {label}
          </label>
        )}
        {description && (
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        )}
      </div>
      
      <button
        type="button"
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`
          ${sizeClasses[size]} 
          ${enabled ? 'bg-purple-primary' : 'bg-gray-600'} 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-primary focus:ring-offset-2 focus:ring-offset-dark-bg
        `}
      >
        <motion.span
          className={`
            ${thumbSizeClasses[size]} 
            ${enabled ? 'bg-white' : 'bg-gray-300'} 
            pointer-events-none inline-block rounded-full shadow-lg transform transition-transform duration-200 ease-in-out
            ${translateClasses[size]}
          `}
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
