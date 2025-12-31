import React from 'react';
import { motion } from 'framer-motion';
import './GlassCard.css';

const GlassCard = ({ children, className = '', delay = 0, ...props }) => {
    return (
        <motion.div
            className={`glass-card ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
