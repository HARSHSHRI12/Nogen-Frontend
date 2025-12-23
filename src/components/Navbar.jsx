import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Navbar.css'
import { useAuth } from '../context/AuthContext'
import NotificationDropdown from './NotificationDropdown'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth();
  const location = useLocation()
  
  const homePath = user ? (user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard') : '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        duration: 0.5
      }
    }
  }

  const linkVariants = {
    hover: {
      scale: 1.1,
      color: '#4a6bff',
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.nav className={`navbar ${scrolled ? 'scrolled' : ''}`} initial="hidden" animate="visible" variants={navVariants}>
      <div className="navbar-container">
        <Link to={homePath} className="navbar-logo">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <i className="fas fa-brain"></i> Nogen <span>AI</span>
          </motion.div>
        </Link>

        <div className={`menu-icon ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <motion.div whileHover="hover" variants={linkVariants}>
              <Link to={homePath} className={['/', '/student-dashboard', '/teacher-dashboard'].includes(location.pathname) ? 'nav-link active' : 'nav-link'}>
                <i className="fas fa-home"></i> Home
              </Link>
            </motion.div>
          </li>

          <li className="nav-item">
            <motion.div whileHover="hover" variants={linkVariants}>
              <Link to="/contact" className={location.pathname === '/contact' ? 'nav-link active' : 'nav-link'}>
                <i className="fas fa-envelope"></i> Contact
              </Link>
            </motion.div>
          </li>

          {(user?.role === 'student' || !user) && (
            <li className="nav-item">
              <motion.div whileHover="hover" variants={linkVariants}>
                <Link to="/ecoin" className={location.pathname === '/ecoin' ? 'nav-link active' : 'nav-link'}>
                  <i className="fas fa-coins"></i> E-Coin
                </Link>
              </motion.div>
            </li>
          )}

          <li className="nav-item">
            <motion.div whileHover="hover" variants={linkVariants}>
              <Link to="/ai-assistant" className={location.pathname === '/ai-assistant' ? 'nav-link active' : 'nav-link'}>
                <i className="fas fa-robot"></i> AI Assistant
              </Link>
            </motion.div>
          </li>

          <li className="nav-item">
            <motion.div whileHover="hover" variants={linkVariants}>
              <Link to="/CodingPractice" className={location.pathname === '/CodingPractice' ? 'nav-link active' : 'nav-link'}>
                <i className="fas fa-code"></i> CodingPractice
              </Link>
            </motion.div>
          </li>

          {user?.role === 'teacher' && (
            <li className="nav-item">
              <motion.div whileHover="hover" variants={linkVariants}>
                <Link to="/teacher-syllabus" className={location.pathname === '/teacher-syllabus' ? 'nav-link active' : 'nav-link'}>
                  <i className="fas fa-book"></i> Syllabus Manager
                </Link>
              </motion.div>
            </li>
          )}

          {user ? (
            <>
              <li className="nav-item profile-info">
                <motion.div whileHover="hover" variants={linkVariants}>
                  <Link to="/profile" className={location.pathname === '/profile' ? 'nav-link active' : 'nav-link'}>
                    <img
                      src={user?.profilePic || 'https://via.placeholder.com/30'}
                      alt="Profile"
                      style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '50%', marginRight: '8px' }}
                    />
                    {user?.name || 'Profile'}
                  </Link>
                </motion.div>
              </li>
              <li className="nav-item notification-item">
                <NotificationDropdown user={user} />
              </li>
            </>
          ) : (
            <li className="nav-item">
              <motion.div whileHover="hover" variants={linkVariants}>
                <Link to="/login" className="nav-link">
                  <i className="fas fa-sign-in-alt"></i> Login
                </Link>
              </motion.div>
            </li>
          )}
        </ul>
      </div>
    </motion.nav>
  )
}

export default Navbar
