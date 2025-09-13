// src/components/CallToAction.jsx
import React, { useState } from 'react';

const CallToAction = () => {
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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
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

  const createAccount = async (userData) => {
    // Simulate API call for account creation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful account creation
        console.log('Account created successfully:', userData);
        resolve({
          success: true,
          message: 'Account created successfully',
          user: {
            id: Date.now(),
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName
          }
        });
      }, 2000);
    });
  };

  const performSignup = async (userData) => {
    // This function handles the actual signup process
    try {
      const response = await createAccount({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password
      });

      if (response.success) {
        // Store user data in localStorage (or your preferred storage)
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('isLoggedIn', 'true');
        
        return response;
      } else {
        throw new Error('Account creation failed');
      }
    } catch (error) {
      throw error;
    }
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
      // Create account and automatically signup
      const signupResponse = await performSignup(formData);
      
      if (signupResponse.success) {
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

        // Show success message and redirect after delay
        setTimeout(() => {
          // Redirect to dashboard or desired page
          window.location.href = '/dashboard'; // or use your router
        }, 2000);
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setErrors({
        general: 'Account creation failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="container py-5 mb-md-3 mb-lg-5">
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
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-5 mb-md-3 mb-lg-5">
      
      <div className="row align-items-center">
        <div className="col-lg-6 mb-4 mb-lg-0">
          {/* Illustration */}
          <div 
            className="rounded-3 bg-light d-flex align-items-center justify-content-center position-relative overflow-hidden"
            style={{ height: '400px' }}
          >
            <div className="text-center text-muted">
              <i className="bx bx-laptop display-1 mb-3"></i>
              <div className="position-absolute top-0 start-0 m-4">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '60px', height: '60px' }}>
                  <i className="bx bx-user-voice text-white fs-4"></i>
                </div>
              </div>
              <div className="position-absolute bottom-0 end-0 m-4">
                <div className="bg-success rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '50px', height: '50px' }}>
                  <i className="bx bx-phone text-white fs-5"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6 ps-lg-5">
          <div className="text-center mb-4">
            <h2 className="h1 mb-0 text-dark">Start Your Free Trial</h2>
          </div>
          
          {/* Error message */}
          {errors.general && (
            <div className="alert alert-danger mb-3" role="alert">
              {errors.general}
            </div>
          )}
          
          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
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
                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
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
                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
              </div>
            </div>
            
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
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            
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
                style={{ border: 'none', background: 'none' }}
              >
                <i className={showPassword ? "bx bx-hide" : "bx bx-show"}></i>
              </button>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            
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
                style={{ border: 'none', background: 'none' }}
              >
                <i className={showConfirmPassword ? "bx bx-hide" : "bx bx-show"}></i>
              </button>
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
            
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
                {errors.agreeToTerms && <div className="invalid-feedback d-block">{errors.agreeToTerms}</div>}
              </div>
            </div>
            
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
                'Create Account'
              )}
            </button>
            
            <p className="text-center mt-4 mb-0 text-muted">
              Already have an account? <a href="/login" className="text-primary text-decoration-none fw-semibold">Sign In</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;