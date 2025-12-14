import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import './Login.css'

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    // Enhanced client-side validation
    if (!formData.email.trim()) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }
  
    if (!formData.password.trim()) {
      setError("Please enter your password");
      setLoading(false);
      return;
    }
  
    try {
      // Prepare the request payload
      const payload = {
        email: formData.email.toLowerCase().trim(),
        password: formData.password.trim()
      };
  
      console.log("Sending login request with:", payload);
  
      // Make the API call with proper headers and timeout
      const response = await axios.post(
        'http://localhost:3500/api/auth/login',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );
  
      console.log("Login response:", response.data);
  
      // Validate response structure
      if (!response.data?.token || !response.data?.user) {
        throw new Error("Invalid response structure from server");
      }
  
      const { token, user } = response.data;
  
      // Store authentication data based on rememberMe choice
      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', token);
      storage.setItem('userData', JSON.stringify(user));
  
      // Determine the redirect path based on user role
      let redirectPath = '/profile'; // Default redirect path
      if (user.role === 'teacher') {
        redirectPath = '/teacher-dashboard';
      } else if (user.role === 'student') {
        redirectPath = '/student-dashboard';
      }
      
      // Redirect after setting the role
      navigate(redirectPath, { replace: true });
  
    } catch (err) {
      console.error("Full error object:", err);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response) {
        // Server responded with error status
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        
        if (err.response.data?.errors?.[0]?.msg) {
          errorMessage = err.response.data.errors[0].msg;
        } else if (err.response.status === 400) {
          errorMessage = "Invalid email or password format";
        } else if (err.response.status === 401) {
          errorMessage = "Invalid credentials";
        }
      } else if (err.request) {
        // Request was made but no response received
        console.error("No response received:", err.request);
        errorMessage = "Server is not responding. Please try again later.";
      } else {
        // Something else happened
        console.error("Request setup error:", err.message);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="login-page page-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="login-container">
              <div className="row g-0">
                <div className="col-md-6">
                  <motion.div
                    className="login-image"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="overlay"></div>
                    <div className="login-content">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      >
                        <h2>Welcome Back!</h2>
                        <p>Log in to access your smart notes and continue organizing your ideas with AI assistance.</p>
                      </motion.div>
                      <motion.div
                        className="login-features"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      >
                        <div className="feature-item">
                          <i className="fas fa-check-circle"></i>
                          <span>AI-powered note organization</span>
                        </div>
                        <div className="feature-item">
                          <i className="fas fa-check-circle"></i>
                          <span>Smart connections between ideas</span>
                        </div>
                        <div className="feature-item">
                          <i className="fas fa-check-circle"></i>
                          <span>Earn E-Coins for premium features</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                <div className="col-md-6">
                  <motion.div
                    className="login-form-container"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="login-header">
                      <h3>Sign In</h3>
                      <p>Enter your credentials to access your account</p>
                    </div>

                    {error && (
                      <motion.div 
                        className="alert alert-danger"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {error}
                      </motion.div>
                    )}

                    

                    <form className="login-form" onSubmit={handleSubmit}>
                      <div className="social-login">
                        <motion.button
                          type="button"
                          className="social-btn google"
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <i className="fab fa-google"></i>
                          <span>Sign in with Google</span>
                        </motion.button>
                        <motion.button
                          type="button"
                          className="social-btn facebook"
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <i className="fab fa-facebook-f"></i>
                          <span>Sign in with Facebook</span>
                        </motion.button>
                      </div>

                      <div className="divider">
                        <span>or</span>
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-group">
                          <span className="input-icon">
                            <i className="fas fa-envelope"></i>
                          </span>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-group">
                          <span className="input-icon">
                            <i className="fas fa-lock"></i>
                          </span>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="8"
                            placeholder="Enter your password"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="form-options">
                        <div className="remember-me">
                          <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            disabled={loading}
                          />
                          <label htmlFor="rememberMe">Remember me</label>
                        </div>
                        <div className="forgot-password">
                          <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        className="btn btn-primary login-btn"
                        whileHover={!loading ? { y: -3 } : {}}
                        whileTap={!loading ? { scale: 0.95 } : {}}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Signing In...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </motion.button>

                      <div className="register-link mt-3">
                        <p>Don't have an account? <Link to="/Signup">Signup here</Link></p>
                      </div>
                    </form>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;