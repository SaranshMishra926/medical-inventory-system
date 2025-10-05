import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ColorPicker = ({ colors, selectedColor, onColorChange, className = '' }) => {
  const accentColors = [
    { name: 'Purple', value: '#8B5CF6', class: 'bg-purple-500' },
    { name: 'Blue', value: '#3B82F6', class: 'bg-blue-500' },
    { name: 'Green', value: '#10B981', class: 'bg-green-500' },
    { name: 'Orange', value: '#F59E0B', class: 'bg-orange-500' },
    { name: 'Red', value: '#EF4444', class: 'bg-red-500' },
    { name: 'Pink', value: '#EC4899', class: 'bg-pink-500' },
    { name: 'Indigo', value: '#6366F1', class: 'bg-indigo-500' },
    { name: 'Teal', value: '#14B8A6', class: 'bg-teal-500' }
  ];

  const colorsToUse = colors || accentColors;

  return (
    <div className={`grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 ${className}`}>
      {colorsToUse.map((color) => (
        <motion.button
          key={color.value}
          onClick={() => onColorChange(color.value)}
          className={`
            relative w-12 h-12 rounded-xl border-2 transition-all duration-200 hover:scale-110
            ${selectedColor === color.value 
              ? 'border-white scale-110 shadow-lg' 
              : 'border-gray-600 hover:border-gray-400'
            }
          `}
          style={{ backgroundColor: color.value }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={color.name}
        >
          {selectedColor === color.value && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Check size={16} className="text-white drop-shadow-lg" />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default ColorPicker;
