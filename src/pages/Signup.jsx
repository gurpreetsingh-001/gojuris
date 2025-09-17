// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ApiService from '../services/apiService';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    return newErrors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Prepare registration data
      const registrationData = {
        username: formData.email, // API expects username, using email
        password: formData.password,
        // Add additional fields if your API supports them
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      };

      console.log('🚀 Attempting user registration...');
      
      // Call registration API
      const result = await ApiService.registerUser(registrationData);
      
      console.log('✅ Registration successful:', result);
      
      // Show success message
      alert('Registration successful! Please login with your credentials.');
      
      // Redirect to login page
      navigate('/login');

    } catch (error) {
      console.error('❌ Registration error:', error);
      
      // Handle specific API errors
      if (error.message.includes('already exists') || error.message.includes('duplicate')) {
        setErrors({ email: 'An account with this email already exists' });
      } else if (error.message.includes('password')) {
        setErrors({ password: error.message });
      } else {
        setErrors({ general: error.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <>
      <Header />
      <div className="login-page-wrapper">
        <div className="login-layout">
          <div className="login-container">
            <div className="login-left">
              <div className="login-form-wrapper">
                <div className="login-form">
                  <h1 className="login-title">Create your account</h1>
                  
                  {/* General Error Message */}
                  {errors.general && (
                    <div className="alert alert-danger mb-3" role="alert">
                      <i className="bx bx-error-circle me-2"></i>
                      {errors.general}
                    </div>
                  )}
                  
                  <form onSubmit={handleSignup}>
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className={`form-input ${errors.firstName ? 'is-invalid' : ''}`}
                            placeholder="First Name*"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            required
                          />
                          {errors.firstName && (
                            <div className="invalid-feedback d-block">
                              <i className="bx bx-error-circle me-1"></i>
                              {errors.firstName}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className={`form-input ${errors.lastName ? 'is-invalid' : ''}`}
                            placeholder="Last Name*"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            required
                          />
                          {errors.lastName && (
                            <div className="invalid-feedback d-block">
                              <i className="bx bx-error-circle me-1"></i>
                              {errors.lastName}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <input
                        type="email"
                        className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Email address*"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                      />
                      {errors.email && (
                        <div className="invalid-feedback d-block">
                          <i className="bx bx-error-circle me-1"></i>
                          {errors.email}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <div className="password-input-wrapper">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className={`form-input ${errors.password ? 'is-invalid' : ''}`}
                          placeholder="Password*"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          <i className={`bx ${showPassword ? 'bx-hide' : 'bx-show'}`}></i>
                        </button>
                      </div>
                      {errors.password && (
                        <div className="invalid-feedback d-block">
                          <i className="bx bx-error-circle me-1"></i>
                          {errors.password}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <div className="password-input-wrapper">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className={`form-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          placeholder="Confirm Password*"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          <i className={`bx ${showConfirmPassword ? 'bx-hide' : 'bx-show'}`}></i>
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <div className="invalid-feedback d-block">
                          <i className="bx bx-error-circle me-1"></i>
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <div className="form-check d-flex align-items-start">
                        <input
                          type="checkbox"
                          className="form-check-input me-2 mt-1"
                          id="agreeToTerms"
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          disabled={isLoading}
                          required
                        />
                        <label className="form-check-label text-sm" htmlFor="agreeToTerms">
                          I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>
                        </label>
                      </div>
                      {errors.agreeToTerms && (
                        <div className="invalid-feedback d-block">
                          <i className="bx bx-error-circle me-1"></i>
                          {errors.agreeToTerms}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn-continue"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </span>
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </form>

                  <div className="login-footer">
                    <p className="signup-text">
                      Already have an account? 
                      <button 
                        onClick={handleLoginRedirect} 
                        className="signup-link"
                        disabled={isLoading}
                      >
                        Sign In
                      </button>
                    </p>
                    
                    <div className="divider">
                      <span>OR</span>
                    </div>
                    
                    <div className="social-login">
                      <button className="social-btn" disabled={isLoading}>
                        <i className="bx bx-phone"></i>
                        Continue with phone
                      </button>
                      <button className="social-btn" disabled={isLoading}>
                        <i className="bx bxl-apple"></i>
                        Continue with Apple
                      </button>
                      <button className="social-btn" disabled={isLoading}>
                        <i className="bx bxl-google"></i>
                        Continue with Google
                      </button>
                    </div>
                    
                    <div className="terms">
                      <a href="#" className="terms-link">Terms of Use</a> | 
                      <a href="#" className="terms-link">Privacy Policy</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="login-right">
              <div className="brand-section">
                <div className="brand-logo">
                  <h1 className="brand-title">Legal Eagle</h1>
                  <h2 className="brand-subtitle">is Now</h2>
                  <div className="ai-powered">
                    <span className="ai-text">AI-Powered.</span>
                    <div className="orbit-animation"></div>
                  </div>
                </div>
                
                <div className="brand-footer">
                  <div className="gojuris-logo">
                    <img 
                      src="/logo.png" 
                      alt="GoJuris Logo" 
                      style={{ height: '24px', width: 'auto' }}
                    />
                  </div>
                  <div className="tagline">
                    &nbsp;&nbsp; AI Solutions for Legal Excellence
                    <i className="bx bx-right-arrow-alt"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Styles for Error Handling */}
        <style jsx>{`
          .form-input.is-invalid {
            border-color: #dc3545;
            background-color: #fff5f5;
          }

          .invalid-feedback {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
          }

          .alert {
            padding: 12px 16px;
            border-radius: 6px;
            border: 1px solid transparent;
          }

          .alert-danger {
            color: #842029;
            background-color: #f8d7da;
            border-color: #f5c2c7;
          }

          .spinner-border-sm {
            width: 1rem;
            height: 1rem;
          }

          .btn-continue:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .form-input:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .password-toggle:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </>
  );
};

export default Signup;