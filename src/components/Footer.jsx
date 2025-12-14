import { motion } from 'framer-motion'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column" data-aos="fade-up">
            <h3 className="footer-logo">
              <i className="fas fa-brain"></i> QuickNotes <span>AI</span>
            </h3>
            <p className="footer-description">
              Smart AI-powered note-taking assistant that helps you capture, organize, and enhance your ideas.
            </p>
            <div className="social-icons">
              <motion.a 
                href="https://www.facebook.com/harsh.shrivastava.7587" 
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fab fa-facebook-f"></i>
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fab fa-twitter"></i>
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/tech_withharsh20/" 
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fab fa-instagram"></i>
              </motion.a>
              <motion.a 
                href="https://www.linkedin.com/in/harsh-shrivastava-737229299/" 
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fab fa-linkedin-in"></i>
              </motion.a>
            </div>
          </div>
          
          <div className="footer-column" data-aos="fade-up" data-aos-delay="100">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/"><i className="fas fa-chevron-right"></i> Home</a></li>
              <li><a href="/ai-assistant"><i className="fas fa-chevron-right"></i> AI Assistant</a></li>
              <li><a href="/ecoin"><i className="fas fa-chevron-right"></i> E-Coin</a></li>
              <li><a href="/contact"><i className="fas fa-chevron-right"></i> Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-column" data-aos="fade-up" data-aos-delay="200">
            <h4 className="footer-title">Resources</h4>
            <ul className="footer-links">
              <li><a href="#"><i className="fas fa-chevron-right"></i> Blog</a></li>
              <li><a href="#"><i className="fas fa-chevron-right"></i> Help Center</a></li>
              <li><a href="#"><i className="fas fa-chevron-right"></i> Privacy Policy</a></li>
              <li><a href="#"><i className="fas fa-chevron-right"></i> Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-column" data-aos="fade-up" data-aos-delay="300">
            <h4 className="footer-title">Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>Avviare Education Hub,Noida 62</span>
              </li>
              <li>
                <i className="fas fa-phone-alt"></i>
                <span>+917706961435</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span>techwithharsh1301@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} QuickNotes AI. All Rights Reserved.</p>
          </div>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer