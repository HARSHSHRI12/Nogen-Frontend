import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();  // For redirection
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    role: 'student' // default role
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: ''
  });

  // Handle change for input fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validate inputs for name, email, password, and confirm password
  const validate = () => {
    const newErrors = {};

    // Name Validation: Minimum 2 characters, only alphabets and spaces
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters and spaces';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Email Validation: Must follow valid email format and not contain invalid characters
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.length < 5) {
      newErrors.email = 'Email must be at least 5 characters long';
    }

    // Password Validation: Must contain minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least. one special character';
    }

    // Confirm Password Validation: Should match the password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Agree Terms Validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };

  // Handle next step of the form
  const nextStep = (e) => {
    e.preventDefault();
    if (validate()) {
      setStep(2);
    }
  };

  // Handle previous step of the form
  const prevStep = () => {
    setStep(1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // Ensure validation passes before submitting

    try {
      const response = await axiosInstance.post('/auth/signup', formData);

      if (response.status === 200 || response.status === 201) {
        const { user } = response.data;
        login(user);

        alert('Signup successful!');

        // Determine redirect path based on role
        if (user.role === 'teacher') {
          navigate('/teacher-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      } else {
        alert(response.data?.message || 'Signup failed');
      }
    } catch (error) {
      console.error("Error during signup:", error);
      const msg = error.response?.data?.message || "Signup failed, please try again later.";
      alert(msg);
    }
  };

  return (
    <div className="signup-page page-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="signup-container">
              <div className="row g-0">
                <div className="col-md-6 order-md-2">
                  <motion.div
                    className="signup-image"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="overlay"></div>
                    <div className="signup-content">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      >
                        <h2>Join Nogen AI</h2>
                        <p>Create your account and start organizing your ideas with the power of artificial intelligence.</p>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                <div className="col-md-6 order-md-1">
                  <motion.div
                    className="signup-form-container"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="signup-header">
                      <h3>Create Account</h3>
                      <p>Sign up for free and start using Nogen AI</p>
                    </div>

                    <div className="signup-steps">
                      <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-label">Account Info</div>
                      </div>
                      <div className="step-line"></div>
                      <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-label">Preferences</div>
                      </div>
                    </div>

                    {step === 1 ? (
                      <form className="signup-form" onSubmit={nextStep}>
                        <div className="form-group">
                          <label htmlFor="name">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                          />
                          {errors.name && <p className="error-text">{errors.name}</p>}
                        </div>

                        <div className="form-group">
                          <label htmlFor="email">Email Address</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                          />
                          {errors.email && <p className="error-text">{errors.email}</p>}
                        </div>

                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a password"
                          />
                          {errors.password && <p className="error-text">{errors.password}</p>}
                        </div>

                        <div className="form-group">
                          <label htmlFor="confirmPassword">Confirm Password</label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                          />
                          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                        </div>

                        <div className="form-group">
                          <label htmlFor="role">Select Role</label>
                          <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                          >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                          </select>
                        </div>

                        <div className="form-group checkbox-group">
                          <div className="checkbox-group">
                            <label>
                              <input
                                type="checkbox"
                                id="agreeTerms"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                required
                              />
                              <span>
                                I agree to the <a href="#">terms and conditions</a>
                              </span>
                            </label>
                          </div>

                          {errors.agreeTerms && (
                            <p className="error-text">{errors.agreeTerms}</p>
                          )}
                        </div>
                        <div className="form-footer">
                          <p className="already-account">
                            Already have an account? <Link to="/login" className="login-link">Login</Link>
                          </p>

                          <button type="submit" className="btn btn-primary">
                            Next
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label>Welcome, {formData.name}!</label>
                          <p>You’ve selected <strong>{formData.role}</strong> role. You can now complete your signup.</p>
                        </div>

                        <button type="button" className="btn btn-secondary" onClick={prevStep}>Back</button>
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                      </form>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
