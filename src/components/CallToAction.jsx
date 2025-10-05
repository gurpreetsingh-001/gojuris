// src/components/CallToAction.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/apiService';

const CallToAction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log('🚀 Home page signup attempt...');

      // Prepare registration data
      const registrationData = {
        username: formData.email, // API expects username, using email
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      };

      // Step 1: Register user
      const registrationResult = await ApiService.registerUser(registrationData);
      console.log('✅ Registration successful:', registrationResult);

      // Step 2: Auto-login after successful registration
      console.log('🔐 Auto-login attempt...');
      const loginResult = await ApiService.loginUser({
        username: formData.email,
        password: formData.password
      });
      console.log('✅ Auto-login successful:', loginResult);

      // Step 3: Show success state
      setIsSuccess(true);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      });

      // Step 4: Redirect to dashboard after delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('❌ Signup/Login failed:', error);
      
      // Handle specific errors
      if (error.message.includes('already exists') || 
          error.message.includes('duplicate') || 
          error.message.includes('already registered')) {
        setErrors({ 
          email: 'An account with this email already exists. Try logging in instead.' 
        });
      } else if (error.message.includes('password')) {
        setErrors({ 
          password: error.message 
        });
      } else if (error.message.includes('email') || error.message.includes('invalid')) {
        setErrors({ 
          email: 'Please enter a valid email address' 
        });
      } else {
        setErrors({
          general: error.message || 'Account creation failed. Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Success state component
  if (isSuccess) {
    return (
      <section className="container  mb-md-3 ">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="text-center">
              <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bx bx-check text-white" style={{ fontSize: '2rem' }}></i>
              </div>
              <h2 className="h1 mb-3 text-success">Account Created Successfully!</h2>
              <p className="fs-lg text-muted mb-4">
                Welcome to GoJuris! Your account has been created and you're now signed in. 
                Redirecting you to dashboard...
              </p>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="mt-3">
                <small className="text-muted">
                  Taking too long? <button 
                    className="btn btn-link p-0" 
                    onClick={() => navigate('/dashboard')}
                  >
                    Click here to continue
                  </button>
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mb-md-3 pt-5">
      <div className="row align-items-center">
        {/* Left Column - Illustration */}
        

{/* Left Column - Image */}
<div className="col-lg-6 mb-4 mb-lg-0">
  <div 
    className="rounded-3 overflow-hidden"
    style={{ height: '100%', minHeight: '400px' }}
  >
    <img
      src="/free-trial.jpg"
      alt="Free Trial"
      className="img-fluid w-100 h-100"
      style={{ 
        objectFit: 'cover',
        borderRadius: '12px'
      }}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.parentElement.innerHTML = `
          <div style="
            background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2rem;
            height: 100%;
            min-height: 400px;
          ">
            <i class="bx bx-image"></i>
          </div>
        `;
      }}
    />
  </div>
</div>
        
        {/* Right Column - Signup Form */}
        <div className="col-lg-6 ps-lg-5">
          <div className="text-center mb-4">
            <h2 className="h1 mb-0 text-dark">Start Your Free Trial</h2>
            <p className="text-muted mt-2">Join thousands of legal professionals using GoJuris AI</p>
          </div>
          
          {/* General Error Message */}
          {errors.general && (
            <div className="alert alert-danger mb-3" role="alert">
              <i className="bx bx-error-circle me-2"></i>
              {errors.general}
            </div>
          )}
          
          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            {/* Name Fields Row */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className={`form-control form-control-lg bg-light border-0 ${errors.firstName ? 'is-invalid' : ''}`}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name*"
                  required
                  disabled={isLoading}
                  style={{ borderRadius: '10px', padding: '15px' }}
                />
                {errors.firstName && (
                  <div className="invalid-feedback">
                    <i className="bx bx-error-circle me-1"></i>
                    {errors.firstName}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className={`form-control form-control-lg bg-light border-0 ${errors.lastName ? 'is-invalid' : ''}`}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name*"
                  required
                  disabled={isLoading}
                  style={{ borderRadius: '10px', padding: '15px' }}
                />
                {errors.lastName && (
                  <div className="invalid-feedback">
                    <i className="bx bx-error-circle me-1"></i>
                    {errors.lastName}
                  </div>
                )}
              </div>
            </div>
            
            {/* Email Field */}
            <div className="mb-3">
              <input
                type="email"
                className={`form-control form-control-lg bg-light border-0 ${errors.email ? 'is-invalid' : ''}`}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address*"
                required
                disabled={isLoading}
                style={{ borderRadius: '10px', padding: '15px' }}
              />
              {errors.email && (
                <div className="invalid-feedback">
                  <i className="bx bx-error-circle me-1"></i>
                  {errors.email}
                </div>
              )}
            </div>
            
            {/* Password Field */}
            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control form-control-lg bg-light border-0 ${errors.password ? 'is-invalid' : ''}`}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password*"
                required
                disabled={isLoading}
                style={{ borderRadius: '10px', padding: '15px', paddingRight: '50px' }}
              />
              <button
                type="button"
                className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{ border: 'none', background: 'none', zIndex: 5 }}
              >
                <i className={showPassword ? "bx bx-hide" : "bx bx-show"}></i>
              </button>
              {errors.password && (
                <div className="invalid-feedback">
                  <i className="bx bx-error-circle me-1"></i>
                  {errors.password}
                </div>
              )}
            </div>
            
            {/* Confirm Password Field */}
            <div className="mb-3 position-relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control form-control-lg bg-light border-0 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password*"
                required
                disabled={isLoading}
                style={{ borderRadius: '10px', padding: '15px', paddingRight: '50px' }}
              />
              <button
                type="button"
                className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3 text-muted"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                style={{ border: 'none', background: 'none', zIndex: 5 }}
              >
                <i className={showConfirmPassword ? "bx bx-hide" : "bx bx-show"}></i>
              </button>
              {errors.confirmPassword && (
                <div className="invalid-feedback">
                  <i className="bx bx-error-circle me-1"></i>
                  {errors.confirmPassword}
                </div>
              )}
            </div>
            
            {/* Terms Checkbox */}
            <div className="mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className={`form-check-input ${errors.agreeToTerms ? 'is-invalid' : ''}`}
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <label className="form-check-label text-muted" htmlFor="agreeToTerms">
                  I agree to the <a href="#" className="text-primary text-decoration-none">Terms of Service</a> and <a href="#" className="text-primary text-decoration-none">Privacy Policy</a>
                </label>
                {errors.agreeToTerms && (
                  <div className="invalid-feedback d-block">
                    <i className="bx bx-error-circle me-1"></i>
                    {errors.agreeToTerms}
                  </div>
                )}
              </div>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-lg w-100 text-white fw-semibold d-flex align-items-center justify-content-center"
              disabled={isLoading}
              style={{ 
                backgroundColor: '#8B5CF6', 
                borderRadius: '10px', 
                padding: '15px',
                border: 'none',
                fontSize: '16px'
              }}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </span>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="bx bx-user-plus me-2"></i>
                  Create Account
                </>
              )}
            </button>
            
            {/* Login Link */}
            <p className="text-center mt-4 mb-0 text-muted">
              Already have an account? 
              <button 
                type="button"
                onClick={() => navigate('/login')} 
                className="btn btn-link p-0 ms-1 text-primary text-decoration-none fw-semibold"
                disabled={isLoading}
              >
                Sign In
              </button>
            </p>
          </form>

          {/* API Status Indicator (for development) */}
          {/* {process.env.NODE_ENV === 'development' && (
            <div className="mt-3">
              <small className="text-muted">
                <i className="bx bx-info-circle me-1"></i>
                API Integration: Registration + Auto-Login + Dashboard Redirect
              </small>
            </div>
          )} */}
        </div>
      </div>

      {/* Component Styles */}
      <style jsx>{`
        .form-control.is-invalid {
          border-color: #dc3545 !important;
          background-color: #fff5f5 !important;
        }

        .invalid-feedback {
          display: block;
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .alert {
          border-radius: 10px;
          border: none;
          font-size: 0.9rem;
        }

        .alert-danger {
          background-color: #fee2e2;
          color: #b91c1c;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-control:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-link:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
          border-width: 0.125rem;
        }

        .form-check-input.is-invalid {
          border-color: #dc3545;
        }

        .form-check-input.is-invalid:checked {
          background-color: #dc3545;
          border-color: #dc3545;
        }

        /* Ensure password toggle button is visible */
        .position-relative .btn-link {
          z-index: 10;
        }

        /* Success state animation */
        .bg-success {
          animation: successPulse 2s infinite;
        }

        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default CallToAction;