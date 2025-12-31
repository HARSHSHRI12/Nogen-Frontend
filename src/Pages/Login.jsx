import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axiosInstance from '../api/axios'
import './Login.css'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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

      // Make the API call with proper headers and timeout
      const response = await axiosInstance.post(
        '/auth/login',
        payload,
        {
          timeout: 10000 // 10 second timeout
        }
      );

      // Validate response structure (token is sent via HTTP-only cookie, so not in body)
      if (!response.data?.user) {
        throw new Error("Invalid response structure from server: Missing user data");
      }

      const { user } = response.data;

      // Since tokens are HTTP-only cookies, we don't store them in localStorage/sessionStorage
      // and thus no need to validate token format on the frontend from response body.
      // The presence of 'user' in the response is sufficient for successful login.

      // Now update auth context with user
      login(user);

      // Determine the redirect path based on user role
      let redirectPath = '/profile'; // Default redirect path
      const role = user.role?.toLowerCase();

      if (role === 'teacher') {
        redirectPath = '/teacher-dashboard';
      } else if (role === 'student') {
        redirectPath = '/student-dashboard';
      }

      // Redirect after setting the role
      navigate(redirectPath, { replace: true });

    } catch (err) {

      let errorMessage = "Login failed. Please try again.";

      if (err.response) {
        // Server responded with error status

        if (err.response.data?.errors?.[0]?.msg) {
          errorMessage = err.response.data.errors[0].msg;
        } else if (err.response.status === 400) {
          errorMessage = "Invalid email or password format";
        } else if (err.response.status === 401) {
          errorMessage = "Invalid credentials";
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Server is not responding. Please try again later.";
      } else {
        // Something else happened
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
                        <p className="already-account">
                          Don't have an account? <Link to="/Signup" className="login-link">Signup here</Link>
                        </p>
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