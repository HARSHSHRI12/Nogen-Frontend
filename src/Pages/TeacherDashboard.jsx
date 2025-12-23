import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlusSquare, FaTasks, FaClipboardList, FaUserCheck, FaUser, FaChalkboardTeacher } from 'react-icons/fa';
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
        <h1><FaChalkboardTeacher /> Welcome, Teacher!</h1>
        <p>Manage your courses, quizzes, and students from here.</p>
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

export default TeacherDashboard;