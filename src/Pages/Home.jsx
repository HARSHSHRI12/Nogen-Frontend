import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from "react";
import './Home.css'
import NogenVoiceAssistant from "../components/NogenVoiceAssistant";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const nogen = new NogenVoiceAssistant();
    nogen.onNavigate = (path) => navigate(path);
    nogen.start();
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center py-5">
            <div className="col-lg-6">
              <motion.div
                className="hero-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h1 variants={itemVariants} className="hero-title">
                  Capture Ideas Smarter with <span className="gradient-text">AI-Powered</span> Notes
                </motion.h1>

                <motion.p variants={itemVariants} className="hero-description">
                  Nogen AI transforms how you take notes with intelligent organization,
                  summarization, and insights - all powered by advanced artificial intelligence.
                </motion.p>

                <motion.div className="hero-buttons" variants={itemVariants}>
                  <button
                    className="btn-primary-custom"
                    onClick={() => navigate('/login')}
                  >
                    Get Started Free <i className="fas fa-arrow-right"></i>
                  </button>
                  <button className="btn-secondary-custom">
                    <i className="fas fa-play-circle"></i> Watch Demo
                  </button>
                </motion.div>

                <motion.div className="hero-stats" variants={itemVariants}>
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
                </motion.div>
              </motion.div>
            </div>

            <div className="col-lg-6">
              <motion.div
                className="hero-image-container"
                initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: -10 }}
                transition={{ duration: 1.2, delay: 0.4 }}
              >
                <div className="image-wrapper">
                  <div className="workspace-badge-shimmer">
                    <div className="badge-pulse-dot"></div>
                    <span>Nogen AI Workspace</span>
                  </div>
                  <img
                    src="https://placehold.co/1200x800/1a0b2e/2a1a3e?text="
                    alt="Nogen AI Dashboard"
                    className="main-hero-img img-fluid"
                  />
                  <div className="image-glow-effect"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header text-center mb-5">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Powerful Features
            </motion.h2>
            <motion.div className="title-underline mx-auto"></motion.div>
            <motion.p
              className="header-subtitle mt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Discover how Nogen AI can transform your note-taking experience
            </motion.p>
          </div>

          <div className="row g-4 mt-5">
            {[
              { icon: 'brain', title: 'AI Insights', desc: 'Get intelligent suggestions, summaries, and connections between your notes using advanced AI.' },
              { icon: 'bolt', title: 'Quick Capture', desc: 'Instantly capture ideas with voice, text, or images. Our AI organizes everything automatically.' },
              { icon: 'link', title: 'Smart Linking', desc: 'Discover relationships between notes you never knew existed with our intelligent linking system.' },
              { icon: 'sync-alt', title: 'Real-time Sync', desc: 'Access your notes from any device with instant synchronization across all platforms.' },
              { icon: 'shield-alt', title: 'Bank-Grade Security', desc: 'Your notes are encrypted and securely stored with enterprise-grade security protocols.' },
              { icon: 'coins', title: 'E-Coin Rewards', desc: 'Earn E-Coins for consistent usage and unlock premium features and templates.' }
            ].map((feature, index) => (
              <div className="col-lg-4 col-md-6" key={index}>
                <motion.div
                  className="feature-card-premium"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="card-icon-box">
                    <i className={`fas fa-${feature.icon}`}></i>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header text-center mb-5">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <motion.div className="title-underline mx-auto"></motion.div>
            <motion.p
              className="header-subtitle mt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Four simple steps to revolutionize your productivity
            </motion.p>
          </div>

          <div className="steps-wrapper mt-5">
            <div className="row g-4">
              {[
                { num: '01', title: 'Create Account', desc: 'Sign up for free and set up your personal workspace in seconds.' },
                { num: '02', title: 'Capture Ideas', desc: 'Use text, voice, or images to quickly capture your thoughts.' },
                { num: '03', title: 'AI Optimization', desc: 'Our AI automatically organizes, summarizes, and enhances your notes.' },
                { num: '04', title: 'Stay Synced', desc: 'Sync across all your devices and access your notes from anywhere.' }
              ].map((step, index) => (
                <div className="col-lg-3 col-md-6" key={index}>
                  <motion.div
                    className="step-card-modern"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <div className="step-num-badge">{step.num}</div>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header text-center mb-5">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              What Our Users Say
            </motion.h2>
            <motion.div className="title-underline mx-auto"></motion.div>
            <motion.p
              className="header-subtitle mt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Feedback from the community that drives us forward
            </motion.p>
          </div>

          <div className="row g-4 mt-5">
            {[
              {
                name: 'Harsh Shrivastva',
                role: 'Graduate Student',
                text: 'Nogen AI has completely changed how I organize my thoughts. The AI suggestions are incredibly accurate.',
                img: 'harsh.jpg'
              },
              {
                name: 'Himanshu Shrivastava',
                role: 'Graduate Student',
                text: 'As a student, Nogen AI has been a game-changer for my studies. The smart connections feature is mind-blowing.',
                img: 'anshu.jpg'
              },
              {
                name: 'Emily Rodriguez',
                role: 'Content Creator',
                text: 'The E-Coin rewards system makes using Nogen AI even more enjoyable. I love the premium templates!',
                img: 'harsh.jpg'
              }
            ].map((testimonial, index) => (
              <div className="col-lg-4" key={index}>
                <motion.div
                  className="testimonial-card-premium"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="testimonial-stars mb-3">
                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                  </div>
                  <p className="testimonial-quote">"{testimonial.text}"</p>
                  <div className="testimonial-footer mt-4">
                    <div className="author-avatar">
                      <img src={testimonial.img} alt={testimonial.name} onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=ff007f&color=fff`; }} />
                    </div>
                    <div className="author-info">
                      <h5>{testimonial.name}</h5>
                      <span>{testimonial.role}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home