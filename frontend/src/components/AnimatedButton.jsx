import React from 'react';
import { motion } from 'framer-motion';
import './AnimatedButton.css';

const AnimatedButton = ({ children, onClick, className = '', disabled = false, variant = 'primary' }) => (
  <motion.button
    whileHover={disabled ? {} : { scale: 1.03, y: -2 }}
    whileTap={disabled ? {} : { scale: 0.97 }}
    className={`btn btn-${variant} animated-btn ${className}`}
    onClick={onClick}
    disabled={disabled}
    style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
  >
    {children}
  </motion.button>
);

export default AnimatedButton;