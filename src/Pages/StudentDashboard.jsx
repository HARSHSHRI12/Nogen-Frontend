import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaCode, FaChartLine, FaRobot, FaPen, FaUserGraduate } from 'react-icons/fa';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const features = [
    { name: 'My Courses', icon: <FaBook />, link: '/courses' },
    { name: 'Coding Practice', icon: <FaCode />, link: '/coding-practice' },
    { name: 'Take a Quiz', icon: <FaPen />, link: '/quiz' },
    { name: 'My Progress', icon: <FaChartLine />, link: '/progress' },
    { name: 'AI Assistant', icon: <FaRobot />, link: '/ai-assistant' },
    { name: 'Profile', icon: <FaUserGraduate />, link: '/profile' }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="student-dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Welcome, Student!</h1>
        <p>Your learning journey starts here. Choose an activity to get started.</p>
      </motion.div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            key={feature.name}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            className="feature-card-container"
          >
            <Link to={feature.link} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-name">{feature.name}</h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;