import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Add error message state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3500/api/contact', formData);
      if (response.status === 200) {
        console.log('Form submitted:', formData);
        setFormSubmitted(true);
        setErrorMessage(''); // Clear any previous error message

        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
          });
          setFormSubmitted(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('Failed to send the message. Please try again later.');
    }
  };
  return (
    <div className="contact-page page-container">
      <div className="container">
        <div className="row">
          <div className="col-lg-6" data-aos="fade-right">
            <div className="contact-info">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Get In Touch
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Have questions about QuickNotes AI? We're here to help. Fill out the form and our team will get back to you as soon as possible.
              </motion.p>
              
              <div className="contact-methods">
                <motion.div 
                  className="contact-method"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Our Location</h3>
                    <p>Avviare Education Hub,Noida 62</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="contact-method"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="contact-icon">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Phone Number</h3>
                    <p>+917706961435</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="contact-method"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Email Address</h3>
                    <p>techwithharsh1301@gmail.com</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="contact-method"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="contact-details">
                    <h3>Working Hours</h3>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                className="social-links"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3>Follow Us</h3>
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
              </motion.div>
            </div>
          </div>
          
          <div className="col-lg-6" data-aos="fade-left">
            <motion.div 
              className="contact-form-container"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2>Send Us a Message</h2>
              
              {formSubmitted ? (
                <div className="form-success">
                  <i className="fas fa-check-circle"></i>
                  <h3>Thank You!</h3>
                  <p>Your message has been sent successfully. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Enter subject"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Enter your message"
                      rows="5"
                    ></textarea>
                  </div>
                  
                  <motion.button 
                    type="submit" 
                    className="btn-primary-custom"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send Message <i className="fas fa-paper-plane"></i>
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="map-container" data-aos="fade-up">
        <h2>Find Us On The Map</h2>
        <div className="map-placeholder">
          <img src="https://placehold.co/1200x400/4a6bff/ffffff?text=Google+Map+Integration" alt="Map" className="img-fluid" />
          <div className="map-overlay">
            <p>Interactive map will be integrated here</p>
          </div>
        </div>
      </div>
      
      <div className="faq-section" data-aos="fade-up">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="row">
            <div className="col-md-6">
              <div className="faq-item">
                <h3><i className="fas fa-question-circle"></i> How can I get started with QuickNotes AI?</h3>
                <p>Simply sign up for a free account on our website and follow the onboarding process. You'll be taking smart notes in minutes!</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="faq-item">
                <h3><i className="fas fa-question-circle"></i> Is my data secure with QuickNotes AI?</h3>
                <p>Absolutely! We use enterprise-grade encryption and security protocols to ensure your notes and personal information are always protected.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="faq-item">
                <h3><i className="fas fa-question-circle"></i> Can I access my notes offline?</h3>
                <p>Yes, our mobile apps support offline mode, allowing you to view and edit your notes even without an internet connection.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="faq-item">
                <h3><i className="fas fa-question-circle"></i> How does the E-Coin reward system work?</h3>
                <p>You earn E-Coins by consistently using the app, completing challenges, and inviting friends. These coins can be used to unlock premium features and templates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact