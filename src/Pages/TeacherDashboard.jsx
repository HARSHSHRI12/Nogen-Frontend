import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlusSquare, FaTasks, FaClipboardList, FaUserCheck, FaUser, FaChalkboardTeacher } from 'react-icons/fa';
import GlassCard from '../components/common/GlassCard';
import './TeacherDashboard.css'; // Assuming you will create this CSS file

const TeacherDashboard = () => {
  const features = [
    { name: 'Create Quiz', icon: <FaPlusSquare />, link: '/quiz/create' },
    { name: 'Manage Questions', icon: <FaTasks />, link: '/questions/manage' },
    { name: 'View Submissions', icon: <FaClipboardList />, link: '/submissions' },
    { name: 'Student Progress', icon: <FaUserCheck />, link: '/progress/students' },
    { name: 'My Profile', icon: <FaUser />, link: '/profile' }
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
    <div className="teacher-dashboard">
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="welcome-banner">
          <h1><FaChalkboardTeacher /> Welcome, Teacher!</h1>
          <p>Manage your courses, quizzes, and students from here.</p>
        </div>
      </motion.div>

      <div className="dashboard-stats-row">
        <GlassCard className="stat-card" delay={0.1}>
          <div className="stat-icon-wrapper"><FaClipboardList /></div>
          <div>
            <h3>5</h3>
            <p>Active Quizzes</p>
          </div>
        </GlassCard>
        <GlassCard className="stat-card" delay={0.2}>
          <div className="stat-icon-wrapper"><FaUserCheck /></div>
          <div>
            <h3>120</h3>
            <p>Students Enrolled</p>
          </div>
        </GlassCard>
        <GlassCard className="stat-card" delay={0.3}>
          <div className="stat-icon-wrapper"><FaTasks /></div>
          <div>
            <h3>15</h3>
            <p>Pending Reviews</p>
          </div>
        </GlassCard>
      </div>

      <h2 className="section-heading">Management Tools</h2>
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

export default TeacherDashboard;