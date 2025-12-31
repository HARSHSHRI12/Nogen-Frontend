import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaCode, FaChartLine, FaRobot, FaPen, FaUserGraduate } from 'react-icons/fa';
import GlassCard from '../components/common/GlassCard';
import ActivityGraph from '../components/common/ActivityGraph';
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
        <div className="welcome-banner">
          <h1>Welcome back, Student!</h1>
          <p>You're doing great. Pick up where you left off.</p>
        </div>
      </motion.div>

      <div className="dashboard-grid-stats">
        {/* Left: Key Stats */}
        <div className="stats-column">
          <GlassCard className="stat-card" delay={0.1}>
            <div className="stat-icon-wrapper"><FaBook /></div>
            <div>
              <h3>12</h3>
              <p>Active Courses</p>
            </div>
          </GlassCard>
          <GlassCard className="stat-card" delay={0.2}>
            <div className="stat-icon-wrapper"><FaCode /></div>
            <div>
              <h3>45</h3>
              <p>Challenges Solved</p>
            </div>
          </GlassCard>
          <GlassCard className="stat-card" delay={0.3}>
            <div className="stat-icon-wrapper"><FaChartLine /></div>
            <div>
              <h3>85%</h3>
              <p>Average Score</p>
            </div>
          </GlassCard>
        </div>

        {/* Right: Activity Graph */}
        <div className="activity-column">
          <GlassCard className="graph-card" delay={0.4}>
            <h3>Weekly Activity</h3>
            <div className="graph-wrapper">
              <ActivityGraph />
            </div>
          </GlassCard>
        </div>
      </div>

      <h2 className="section-heading">Quick Actions</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            key={feature.name}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
          >
            <Link to={feature.link} style={{ textDecoration: 'none' }}>
              <GlassCard className="feature-card-glass">
                <div className="feature-icon-glass">{feature.icon}</div>
                <h3 className="feature-name-glass">{feature.name}</h3>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;