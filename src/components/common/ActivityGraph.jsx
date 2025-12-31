import React from 'react';
import { motion } from 'framer-motion';

const ActivityGraph = () => {
    // Mock data for the last 7 days
    const data = [4, 7, 5, 9, 6, 8, 10];
    const max = Math.max(...data);

    return (
        <div className="activity-graph-container" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px' }}>
            {data.map((value, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(value / max) * 100}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        style={{
                            width: '12px',
                            backgroundColor: '#a3b1ff',
                            borderRadius: '6px',
                            opacity: 0.8,
                        }}
                    />
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default ActivityGraph;
