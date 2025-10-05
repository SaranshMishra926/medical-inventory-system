import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-dark-card border-t border-dark-border px-6 py-4"
    >
      <div className="flex items-center justify-center">
        <p className="text-sm text-gray-400">
          © 2025 MediTrack. All Rights Reserved.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
