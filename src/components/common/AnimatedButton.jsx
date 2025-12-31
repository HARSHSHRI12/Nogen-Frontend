import React from 'react';
import { motion } from 'framer-motion';
import './AnimatedButton.css';

const AnimatedButton = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button', icon }) => {
    return (
        <motion.button
            className={`animated-btn ${variant} ${className}`}
            onClick={onClick}
            disabled={disabled}
            type={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            {icon && <span className="btn-icon">{icon}</span>}
            {children}
        </motion.button>
    );
};

export default AnimatedButton;
