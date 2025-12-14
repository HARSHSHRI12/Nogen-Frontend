import { motion } from 'framer-motion'
import './ECoin.css'

const ECoin = () => {
  return (
    <div className="ecoin-page page-container">
      {/* Hero Section */}
      <section className="ecoin-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <motion.div 
                className="ecoin-hero-content"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1>Earn & Redeem <span>E-Coins</span></h1>
                <p>Our unique reward system that lets you earn coins for using QuickNotes AI and redeem them for premium features and templates.</p>
                <motion.button 
                  className="btn-primary-custom"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Earning Now <i className="fas fa-arrow-right"></i>
                </motion.button>
              </motion.div>
            </div>
            <div className="col-lg-6">
              <motion.div 
                className="ecoin-hero-image"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img src="https://placehold.co/600x400/ffd700/ffffff?text=E-Coin" alt="E-Coin" className="img-fluid" />
                <div className="coin-floating coin-1">
                  <i className="fas fa-coins"></i>
                </div>
                <div className="coin-floating coin-2">
                  <i className="fas fa-coins"></i>
                </div>
                <div className="coin-floating coin-3">
                  <i className="fas fa-coins"></i>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Earn Section */}
      <section className="earn-section section-padding">
        <div className="container">
          <div className="section-header text-center" data-aos="fade-up">
            <h2>How to Earn E-Coins</h2>
            <p>Multiple ways to earn coins and boost your rewards</p>
          </div>
          <div className="row">
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="earn-card card-custom">
                <div className="earn-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <h3>Daily Check-ins</h3>
                <p>Earn 5 E-Coins every day just by logging into your account and using the app.</p>
                <div className="coin-value">
                  <i className="fas fa-coins"></i> 5 coins
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="earn-card card-custom">
                <div className="earn-icon">
                  <i className="fas fa-edit"></i>
                </div>
                <h3>Create Notes</h3>
                <p>Earn 2 E-Coins for each note you create, up to 10 notes per day.</p>
                <div className="coin-value">
                  <i className="fas fa-coins"></i> 2 coins per note
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="earn-card card-custom">
                <div className="earn-icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <h3>Invite Friends</h3>
                <p>Earn 50 E-Coins for each friend who signs up using your referral link.</p>
                <div className="coin-value">
                  <i className="fas fa-coins"></i> 50 coins per friend
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="400">
              <div className="earn-card card-custom">
                <div className="earn-icon">
                  <i className="fas fa-tasks"></i>
                </div>
                <h3>Complete Challenges</h3>
                <p>Earn 20-100 E-Coins by completing weekly challenges and tasks.</p>
                <div className="coin-value">
                  <i className="fas fa-coins"></i> 20-100 coins
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="500">
              <div className="earn-card card-custom">
                <div className="earn-icon">
                  <i className="fas fa-star"></i>
                </div>
                <h3>Rate & Review</h3>
                <p>Earn 25 E-Coins by rating our app on the App Store or Google Play.</p>
                <div className="coin-value">
                  <i className="fas fa-coins"></i> 25 coins
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="600">
              <div className="earn-card card-custom">
                <div className="earn-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <h3>Achievement Badges</h3>
                <p>Earn 10-200 E-Coins by unlocking achievement badges in the app.</p>
                <div className="coin-value">
                  <i className="fas fa-coins"></i> 10-200 coins
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Redeem Section */}
      <section className="redeem-section section-padding">
        <div className="container">
          <div className="section-header text-center" data-aos="fade-up">
            <h2>Redeem Your E-Coins</h2>
            <p>Unlock premium features and templates with your earned coins</p>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
              <div className="redeem-card card-custom">
                <div className="redeem-badge">
                  <span>Popular</span>
                </div>
                <img src="https://placehold.co/400x200/4a6bff/ffffff?text=Premium+Template" alt="Premium Template" className="img-fluid" />
                <div className="redeem-content">
                  <h3>Project Management Template</h3>
                  <p>A comprehensive template for managing projects with tasks, timelines, and progress tracking.</p>
                  <div className="redeem-price">
                    <span><i className="fas fa-coins"></i> 100 E-Coins</span>
                    <motion.button 
                      className="btn-primary-custom"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Redeem Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
              <div className="redeem-card card-custom">
                <img src="https://placehold.co/400x200/4a6bff/ffffff?text=Premium+Feature" alt="Premium Feature" className="img-fluid" />
                <div className="redeem-content">
                  <h3>Advanced AI Analysis</h3>
                  <p>Unlock advanced AI capabilities that provide deeper insights and connections between your notes.</p>
                  <div className="redeem-price">
                    <span><i className="fas fa-coins"></i> 200 E-Coins</span>
                    <motion.button 
                      className="btn-primary-custom"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Redeem Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
              <div className="redeem-card card-custom">
                <div className="redeem-badge">
                  <span>New</span>
                </div>
                <img src="https://placehold.co/400x200/4a6bff/ffffff?text=Premium+Theme" alt="Premium Theme" className="img-fluid" />
                <div className="redeem-content">
                  <h3>Dark Mode Pro Theme</h3>
                  <p>A sleek, eye-friendly dark theme with customizable accent colors for your workspace.</p>
                  <div className="redeem-price">
                    <span><i className="fas fa-coins"></i> 50 E-Coins</span>
                    <motion.button 
                      className="btn-primary-custom"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Redeem Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
              <div className="redeem-card card-custom">
                <img src="https://placehold.co/400x200/4a6bff/ffffff?text=Cloud+Storage" alt="Cloud Storage" className="img-fluid" />
                <div className="redeem-content">
                  <h3>Extra Cloud Storage</h3>
                  <p>Increase your cloud storage capacity by 5GB to store more notes, images, and attachments.</p>
                  <div className="redeem-price">
                    <span><i className="fas fa-coins"></i> 150 E-Coins</span>
                    <motion.button 
                      className="btn-primary-custom"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Redeem Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="500">
              <div className="redeem-card card-custom">
                <div className="redeem-badge">
                  <span>Limited</span>
                </div>
                <img src="https://placehold.co/400x200/4a6bff/ffffff?text=Premium+Export" alt="Premium Export" className="img-fluid" />
                <div className="redeem-content">
                  <h3>Advanced Export Options</h3>
                  <p>Export your notes in multiple formats including PDF, DOCX, HTML, and Markdown with custom styling.</p>
                  <div className="redeem-price">
                    <span><i className="fas fa-coins"></i> 75 E-Coins</span>
                    <motion.button 
                      className="btn-primary-custom"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Redeem Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="600">
              <div className="redeem-card card-custom">
                <img src="https://placehold.co/400x200/4a6bff/ffffff?text=Priority+Support" alt="Priority Support" className="img-fluid" />
                <div className="redeem-content">
                  <h3>Priority Support</h3>
                  <p>Get priority customer support with guaranteed response within 2 hours for any issues or questions.</p>
                  <div className="redeem-price">
                    <span><i className="fas fa-coins"></i> 100 E-Coins</span>
                    <motion.button 
                      className="btn-primary-custom"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Redeem Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="leaderboard-section section-padding">
        <div className="container">
          <div className="section-header text-center" data-aos="fade-up">
            <h2>E-Coin Leaderboard</h2>
            <p>See who's earning the most coins this month</p>
          </div>
          <div className="leaderboard-container" data-aos="fade-up">
            <div className="leaderboard-top">
              <div className="leaderboard-user second">
                <div className="leaderboard-rank">2</div>
                <div className="leaderboard-avatar">
                  <img src="harsh.jpg" alt="User" />
                </div>
                <div className="leaderboard-info">
                  <h3>Harsh Shrivastava</h3>
                  <p><i className="fas fa-coins"></i> 2,450 E-Coins</p>
                </div>
              </div>
              <div className="leaderboard-user first">
                <div className="leaderboard-rank">1</div>
                <div className="leaderboard-avatar">
                  <img src="harsh.jpg" alt="User" />
                </div>
                <div className="leaderboard-info">
                  <h3>Harsh Shrivastava</h3>
                  <p><i className="fas fa-coins"></i> 3,120 E-Coins</p>
                </div>
              </div>
              <div className="leaderboard-user third">
                <div className="leaderboard-rank">3</div>
                <div className="leaderboard-avatar">
                  <img src="harsh.jpg" alt="User" />
                </div>
                <div className="leaderboard-info">
                  <h3>Harsh Shrivastava</h3>
                  <p><i className="fas fa-coins"></i> 1,985 E-Coins</p>
                </div>
              </div>
            </div>
            <div className="leaderboard-table">
              <div className="leaderboard-header">
                <div className="leaderboard-col rank">Rank</div>
                <div className="leaderboard-col user">User</div>
                <div className="leaderboard-col coins">E-Coins</div>
                <div className="leaderboard-col level">Level</div>
              </div>
              <div className="leaderboard-row">
                <div className="leaderboard-col rank">4</div>
                <div className="leaderboard-col user">
                  <img src="harsh.jpg" alt="User" />
                  <span>Harsh Shrivastava</span>
                </div>
                <div className="leaderboard-col coins">1,756</div>
                <div className="leaderboard-col level">Gold</div>
              </div>
              <div className="leaderboard-row">
                <div className="leaderboard-col rank">5</div>
                <div className="leaderboard-col user">
                  <img src="harsh.jpg" alt="User" />
                  <span>Harsh Shrivastava</span>
                </div>
                <div className="leaderboard-col coins">1,645</div>
                <div className="leaderboard-col level">Gold</div>
              </div>
              <div className="leaderboard-row">
                <div className="leaderboard-col rank">6</div>
                <div className="leaderboard-col user">
                  <img src="harsh.jpg" alt="User" />
                  <span>Harsh Shrivastava</span>
                </div>
                <div className="leaderboard-col coins">1,532</div>
                <div className="leaderboard-col level">Silver</div>
              </div>
              <div className="leaderboard-row">
                <div className="leaderboard-col rank">7</div>
                <div className="leaderboard-col user">
                  <img src="harsh.jpg" alt="User" />
                  <span>Harsh Shrivastava</span>
                </div>
                <div className="leaderboard-col coins">1,487</div>
                <div className="leaderboard-col level">Silver</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section section-padding">
        <div className="container">
          <div className="section-header text-center" data-aos="fade-up">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about E-Coins</p>
          </div>
          <div className="row">
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
              <div className="faq-item">
                <h3><i className="fas fa-question-circle"></i> What are E-Coins?</h3>
                <p>E-Coins are our virtual currency that you can earn by using QuickNotes AI and completing various activities. They can be redeemed for premium features, templates, and other benefits.</p>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
              <div className="faq-item">
                <h3><i className="fas fa-question-circle"></i> How do I earn E-Coins?</h3>
                <p>You can earn E-Coins through daily check-ins, creating notes, inviting friends, completing challenges, rating our app, and unlocking achievement badges.</p>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="300">
              <div className="faq-item">
                <h3><i className="fas fa-question-circle"></i> Do E-Coins expire?</h3>
                <p>No, E-Coins do not expire. Once earned, they remain in your account until you choose to redeem them.</p>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="400">
              <div className="faq-item">
                <h3><i className="fas fa-question-circle"></i> Can I transfer E-Coins to another user?</h3>
                <p>Currently, E-Coins cannot be transferred between users. They are tied to your individual account.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ECoin