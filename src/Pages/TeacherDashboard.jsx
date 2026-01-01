import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlusSquare, FaTasks, FaClipboardList, FaUserCheck, FaUser, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import GlassCard from '../components/common/GlassCard';
import FeedSection from './Network/FeedSection';
import { useAuth } from '../context/AuthContext';
import './StudentDashboard.css'; // Reusing the same layout CSS

const TeacherDashboard = () => {
  const { user } = useAuth();

  const features = [
    { name: 'Create Quiz', icon: <FaPlusSquare />, link: '/quiz/create' },
    { name: 'Manage Questions', icon: <FaTasks />, link: '/questions/manage' },
    { name: 'View Submissions', icon: <FaClipboardList />, link: '/submissions' },
    { name: 'Student Progress', icon: <FaUserCheck />, link: '/progress/students' },
    { name: 'Network', icon: <FaUsers />, link: '/network/all' }
  ];

  return (
    <div className="dashboard-v2">
      <div className="dashboard-container-v2">

        {/* Left Column: Profile & Management Stats */}
        <aside className="dashboard-left">
          <GlassCard className="mini-profile-card">
            <div className="profile-banner" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}></div>
            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="" className="mini-avatar" />
            <h3>{user?.name}</h3>
            <p className="mini-role">Professional Teacher at Nogen AI</p>
            <div className="mini-stats">
              <div className="mini-stat-item">
                <span>Students</span>
                <strong>1.2k</strong>
              </div>
              <div className="mini-stat-item">
                <span>Quizzes</span>
                <strong>48</strong>
              </div>
            </div>
            <Link to="/profile" className="view-profile-link">Manage Profile</Link>
          </GlassCard>

          <GlassCard className="quick-stats-card">
            <h4>Activity Overview</h4>
            <div className="progress-mini-item">
              <span>Engagement</span>
              <div className="progress-bar"><div className="fill" style={{ width: '88%', background: '#a855f7' }}></div></div>
            </div>
            <div className="progress-mini-item">
              <span>Response Rate</span>
              <div className="progress-bar"><div className="fill" style={{ width: '95%', background: '#a855f7' }}></div></div>
            </div>
          </GlassCard>
        </aside>

        {/* Center Column: Feed (Announcements & Discussions) */}
        <main className="dashboard-center">
          <div className="teacher-announcement-header">
            <h2 className="section-heading" style={{ margin: '0 0 15px 0', fontSize: '1.2rem' }}>Discussion Feed</h2>
          </div>
          <FeedSection />
        </main>

        {/* Right Column: Tools & Upcoming */}
        <aside className="dashboard-right">
          <div className="dashboard-features-section">
            <h4>Teaching Tools</h4>
            <div className="mini-features-grid">
              {features.map(f => (
                <Link key={f.name} to={f.link} className="mini-feature-item">
                  <span className="icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>{f.icon}</span>
                  <span className="name">{f.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <GlassCard className="ai-suggestion-card">
            <h4 style={{ color: '#a855f7' }}>Teacher Pro Tip</h4>
            <p>Use the <strong>AI Assistant</strong> to generate unique quiz questions in seconds!</p>
            <Link to="/ai-assistant" className="btn-action-small" style={{ borderColor: '#a855f7', color: '#a855f7' }}>Explore AI</Link>
          </GlassCard>
        </aside>

      </div>
    </div>
  );
};

export default TeacherDashboard;