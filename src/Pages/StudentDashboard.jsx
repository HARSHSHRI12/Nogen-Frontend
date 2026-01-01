import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaCode, FaChartLine, FaRobot, FaPen, FaUserGraduate, FaUsers } from 'react-icons/fa';
import GlassCard from '../components/common/GlassCard';
import FeedSection from './Network/FeedSection';
import { useAuth } from '../context/AuthContext';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();

  const features = [
    { name: 'My Courses', icon: <FaBook />, link: '/courses' },
    { name: 'Coding Practice', icon: <FaCode />, link: '/coding-practice' },
    { name: 'Take a Quiz', icon: <FaPen />, link: '/quiz' },
    { name: 'AI Assistant', icon: <FaRobot />, link: '/ai-assistant' },
    { name: 'My Progress', icon: <FaChartLine />, link: '/progress' },
    { name: 'Network', icon: <FaUsers />, link: '/network/all' }
  ];

  return (
    <div className="dashboard-v2">
      <div className="dashboard-container-v2">

        {/* Left Column: Profile & Stats */}
        <aside className="dashboard-left">
          <GlassCard className="mini-profile-card">
            <div className="profile-banner"></div>
            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="" className="mini-avatar" />
            <h3>{user?.name}</h3>
            <p className="mini-role">Student at Nogen AI</p>
            <div className="mini-stats">
              <div className="mini-stat-item">
                <span>Network</span>
                <strong>24</strong>
              </div>
              <div className="mini-stat-item">
                <span>Courses</span>
                <strong>5</strong>
              </div>
            </div>
            <Link to="/profile" className="view-profile-link">View my profile</Link>
          </GlassCard>

          <GlassCard className="quick-stats-card">
            <h4>My Progress</h4>
            <div className="progress-mini-item">
              <span>Coding</span>
              <div className="progress-bar"><div className="fill" style={{ width: '75%' }}></div></div>
            </div>
            <div className="progress-mini-item">
              <span>Quizzes</span>
              <div className="progress-bar"><div className="fill" style={{ width: '60%' }}></div></div>
            </div>
          </GlassCard>
        </aside>

        {/* Center Column: Feed */}
        <main className="dashboard-center">
          <FeedSection />
        </main>

        {/* Right Column: Features & Quick Links */}
        <aside className="dashboard-right">
          <div className="dashboard-features-section">
            <h4>Quick Actions</h4>
            <div className="mini-features-grid">
              {features.map(f => (
                <Link key={f.name} to={f.link} className="mini-feature-item">
                  <span className="icon">{f.icon}</span>
                  <span className="name">{f.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <GlassCard className="ai-suggestion-card">
            <h4>AI Recommendation</h4>
            <p>Try the <strong>React Fundamentals</strong> quiz to boost your score!</p>
            <Link to="/quiz" className="btn-action-small">Start Now</Link>
          </GlassCard>
        </aside>

      </div>
    </div>
  );
};

export default StudentDashboard;