import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import React, { useEffect,useRef } from "react";
import './Home.css'
import NogenVoiceAssistant from "../components/NogenVoiceAssistant"; 
const Home = () => {
  const navigate = useNavigate();
  const nogenRef = useRef(null); //  Keeps the same instance on re-renders

  useEffect(() => {
    const nogen = new NogenVoiceAssistant();
    nogen.onNavigate = (path) => navigate(path);  // <-- React navigation!
    nogen.start();
}, []);
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <motion.div 
                className="hero-content"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1>Capture Ideas Smarter with <span>AI-Powered</span> Notes</h1>
                <p>Nogen AI transforms how you take notes with intelligent organization, summarization, and insights - all powered by advanced artificial intelligence.</p>
                <div className="hero-buttons">
                  <motion.button 
                    className="btn-primary-custom"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    
                    
                  >
                    Get Started Free <i className="fas fa-arrow-right"></i>
                  </motion.button>
                  <motion.button 
                    className="btn-secondary-custom"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    //add video (make your self ,intro video)
                  >
                    <i className="fas fa-play-circle"></i> Watch Demo
                  </motion.button>
                </div>
                <div className="hero-stats">
                  <div className="stat-item">
                    <h3>10K+</h3>
                    <p>Active Users</p>
                  </div>
                  <div className="stat-item">
                    <h3>4.8/5</h3>
                    <p>User Rating</p>
                  </div>
                  <div className="stat-item">
                    <h3>99.9%</h3>
                    <p>Uptime</p>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="col-lg-6">
              <motion.div 
                className="hero-image"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img src="https://placehold.co/600x400/4a6bff/ffffff?text=QuickNotes+AI" alt="Nogen AI Dashboard" className="img-fluid" />
                <div className="hero-image-shape"></div>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="hero-shape-1"></div>
        <div className="hero-shape-2"></div>
      </section>

      {/* Features Section */}
      <section className="features-section section-padding">
        <div className="container">
          <div className="section-header text-center" data-aos="fade-up">
            <h2>Powerful Features</h2>
            <p>Discover how Nogen AI can transform your note-taking experience</p>
          </div>
          <div className="row">
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-card card-custom">
                <div className="feature-icon">
                  <i className="fas fa-brain"></i>
                </div>
                <h3>AI-Powered Insights</h3>
                <p>Get intelligent suggestions, summaries, and connections between your notes using advanced AI algorithms.</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-card card-custom">
                <div className="feature-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <h3>Quick Capture</h3>
                <p>Instantly capture ideas with voice, text, or images. Our AI organizes everything automatically.</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-card card-custom">
                <div className="feature-icon">
                  <i className="fas fa-link"></i>
                </div>
                <h3>Smart Connections</h3>
                <p>Discover relationships between notes you never knew existed with our intelligent linking system.</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="400">
              <div className="feature-card card-custom">
                <div className="feature-icon">
                  <i className="fas fa-sync-alt"></i>
                </div>
                <h3>Real-time Sync</h3>
                <p>Access your notes from any device with instant synchronization across all platforms.</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="500">
              <div className="feature-card card-custom">
                <div className="feature-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3>Secure Storage</h3>
                <p>Your notes are encrypted and securely stored with enterprise-grade security protocols.</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="600">
              <div className="feature-card card-custom">
                <div className="feature-icon">
                  <i className="fas fa-coins"></i>
                </div>
                <h3>E-Coin Rewards</h3>
                <p>Earn E-Coins for consistent usage and unlock premium features and templates.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section section-padding">
        <div className="container">
          <div className="section-header text-center" data-aos="fade-up">
            <h2>How It Works</h2>
            <p>Simple steps to revolutionize your note-taking experience</p>
          </div>
          <div className="steps-container">
            <div className="step-item" data-aos="fade-right">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create an Account</h3>
                <p>Sign up for free and set up your personal workspace in seconds.</p>
              </div>
            </div>
            <div className="step-item" data-aos="fade-right" data-aos-delay="100">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Capture Your Ideas</h3>
                <p>Use text, voice, or images to quickly capture your thoughts.</p>
              </div>
            </div>
            <div className="step-item" data-aos="fade-right" data-aos-delay="200">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>AI Enhancement</h3>
                <p>Our AI automatically organizes, summarizes, and enhances your notes.</p>
              </div>
            </div>
            <div className="step-item" data-aos="fade-right" data-aos-delay="300">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Access Anywhere</h3>
                <p>Sync across all your devices and access your notes from anywhere.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section section-padding">
        <div className="container">
          <div className="section-header text-center" data-aos="fade-up">
            <h2>What Our Users Say</h2>
            <p>Join thousands of satisfied users who have transformed their note-taking</p>
          </div>
          <div className="row">
            <div className="col-md-4" data-aos="fade-up">
              <div className="testimonial-card card-custom">
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="testimonial-text">"Nogen AI has completely changed how I organize my thoughts. The AI suggestions are incredibly accurate and save me hours of work."</p>
                <div className="testimonial-author">
                  <img src="harsh.jpg" height={"135px"} width={"135px"} alt="Harsh Shrivastva" />
                  <div>
                    <h4>Harsh Shrivastva</h4>
                    <p>Graduate Student</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="testimonial-card card-custom">
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="testimonial-text">"As a student, Nogen AI has been a game-changer for my studies. The smart connections feature helps me see relationships between different subjects."</p>
                <div className="testimonial-author">
                  <img src="anshu.jpg" height={"135px"} width={"135px"} alt="Himanshu Shrivastava" />
                  <div>
                    <h4>Himanshu Shrivastava</h4>
                    <p>Graduate Student</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="testimonial-card card-custom">
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <p className="testimonial-text">"The E-Coin rewards system makes using Nogen AI even more enjoyable. I've unlocked several premium templates that have improved my workflow."</p>
                <div className="testimonial-author">
                  <img src="harsh.jpg" height={"135px"} width={"135px"} alt="Harsh Shrivastva" />
                  <div>
                    <h4>Emily Rodriguez</h4>
                    <p>Content Creator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  )
}

export default Home