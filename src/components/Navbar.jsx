import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX, FiHome, FiMail, FiCpu, FiCode, FiBook, FiUser, FiLogIn, FiLogOut, FiTrendingUp } from 'react-icons/fi'; // Using feather icons for cleaner look
import { FaCoins } from 'react-icons/fa'; // Keep FA for specific solid icons if preferred
import './Navbar.css';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { settings, updateSettings } = useSettings();
  const location = useLocation();

  const homePath = user ? (user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard') : '/';

  // Theme State
  const isDarkMode = settings.theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ ...settings, theme: newTheme }).catch(console.error);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">

        {/* Logo */}
        <Link to={homePath} className="navbar-logo">
          <i className="fas fa-brain"></i>
          <div>Nogen <span>AI</span></div>
        </Link>

        {/* Mobile Toggle */}
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </div>

        {/* Menu Items */}
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>

          <li className="nav-item">
            <Link to={homePath} className={`nav-link ${['/', '/student-dashboard', '/teacher-dashboard'].includes(location.pathname) ? 'active' : ''}`}>
              <FiHome /> Home
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/ai-assistant" className={`nav-link ${location.pathname === '/ai-assistant' ? 'active' : ''}`}>
              <FiCpu /> AI Assistant
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/CodingPractice" className={`nav-link ${location.pathname === '/CodingPractice' ? 'active' : ''}`}>
              <FiCode /> Code
            </Link>
          </li>

          {(user?.role === 'student' || !user) && (
            <li className="nav-item">
              <Link to="/ecoin" className={`nav-link ${location.pathname === '/ecoin' ? 'active' : ''}`}>
                <FaCoins /> E-Coin
              </Link>
            </li>
          )}

          {user?.role === 'teacher' && (
            <li className="nav-item">
              <Link to="/teacher-syllabus" className={`nav-link ${location.pathname === '/teacher-syllabus' ? 'active' : ''}`}>
                <FiBook /> Syllabus
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
              <FiMail /> Contact
            </Link>
          </li>

          {user && (
            <li className="nav-item network-item">
              <div className="network-dropdown-wrapper">
                <Link to="/network/all" className={`nav-link ${location.pathname.startsWith('/network') ? 'active' : ''}`}>
                  Network
                </Link>
                <div className="network-dropdown">
                  <Link to="/network/all" className="dropdown-link">All</Link>
                  <Link to="/network/suggestions" className="dropdown-link">Suggestions</Link>
                  <Link to="/network/requests" className="dropdown-link">Requests</Link>
                </div>
              </div>
            </li>
          )}

          {/* Theme Toggle */}
          <li className="nav-item">
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  style={{ display: 'inline-block' }}
                  key={isDarkMode ? 'moon' : 'sun'}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDarkMode ? <FiMoon /> : <FiSun />}
                </motion.div>
              </AnimatePresence>
            </button>
          </li>

          {/* Auth / Profile */}
          {user ? (
            <>
              <li className="nav-item notification-item">
                <NotificationDropdown user={user} />
              </li>
              <li className="nav-item profile-dropdown-container">
                <button
                  className="profile-trigger"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                >
                  <img
                    src={(user?.profilePic || user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`).replace('http://nogen-backend', 'https://nogen-backend')}
                    alt="User"
                    className="profile-img-nav"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`; }}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      className="profile-dropdown-menu"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link to="/profile" className="dropdown-item">
                        <FiUser /> Profile
                      </Link>
                      <Link to="/pricing" className="dropdown-item">
                        <FiTrendingUp /> Upgrade Plan
                      </Link>
                      <button onClick={logout} className="dropdown-item logout-btn">
                        <FiLogOut /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', color: '#fff', textDecoration: 'none' }}>
                Login
              </Link>
            </li>
          )}

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
