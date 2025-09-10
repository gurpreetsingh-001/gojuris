// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    // Navigate to dashboard after successful signup
    console.log('Signup data:', formData);
    navigate('/dashboard');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-layout">
        <div className="login-container">
          <div className="login-left">
            <div className="login-form-wrapper">
              {/* Logo */}
              <div className="login-logo">
                <div className="logo-icon-gj">
                  <i className="bx bx-certification"></i>
                </div>
                <div className="logo-text">
                  <span className="legal-text">Legal AI</span>
                </div>
              </div>

              {/* Form */}
              <div className="login-form">
                <h1 className="login-title">Create your account</h1>
                
                <form onSubmit={handleSignup}>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="First Name*"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Last Name*"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Email address*"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Password*"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bx ${showPassword ? 'bx-hide' : 'bx-show'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="password-input-wrapper">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Confirm Password*"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`bx ${showConfirmPassword ? 'bx-hide' : 'bx-show'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="form-group">
                    <div className="form-check d-flex align-items-start">
                      <input
                        type="checkbox"
                        className="form-check-input me-2 mt-1"
                        id="agreeToTerms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        required
                      />
                      <label className="form-check-label text-sm" htmlFor="agreeToTerms">
                        I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>
                      </label>
                    </div>
                  </div>
                  
                  <button type="submit" className="btn-continue">
                    Create Account
                  </button>
                </form>

                <div className="login-footer">
                  <p className="signup-text">
                    Already have an account? 
                    <button onClick={handleLoginRedirect} className="signup-link">
                      Sign In
                    </button>
                  </p>
                  
                  <div className="divider">
                    <span>OR</span>
                  </div>
                  
                  <div className="social-login">
                    <button className="social-btn">
                      <i className="bx bx-phone"></i>
                      Continue with phone
                    </button>
                    <button className="social-btn">
                      <i className="bx bxl-apple"></i>
                      Continue with Apple
                    </button>
                    <button className="social-btn">
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
                  <i className="bx bx-certification"></i>
                  <span>GOJURIS</span>
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
    </div>
  );
};

export default Signup;