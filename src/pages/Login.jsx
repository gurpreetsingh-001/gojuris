// src/pages/Login.jsx - Updated single page login form
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ApiService from '../services/apiService';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  var isGJ= false;

  const domain = window.location.hostname;
  if (domain.includes("gojuris.ai")) {
    isGJ= true;
  }
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      setError('Email address or Mobile No is required');
      return;
    }



    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting login...');

      // Call login API
      const loginData = {
        username: email, // API expects username, using email
        password: password
      };

      const result = await ApiService.loginUser(loginData);

      console.log('✅ Login successful:', result);

      // Store user data
      if (result.userEmail || email) {
        localStorage.setItem('userEmail', result.userEmail || email);
      }

      // Store any additional user data from login response
      if (result.userData) {
        localStorage.setItem('userData', JSON.stringify(result.userData));
      } else if (result.user) {
        localStorage.setItem('userData', JSON.stringify(result.user));
      }
      const permissionsData = await ApiService.getUserPermissions();
      localStorage.setItem('userp', JSON.stringify(permissionsData));
      // Navigate to dashboard on successful login
      navigate('/dashboard');

    } catch (error) {
      console.error('❌ Login error:', error);

      // Handle specific login errors
      if (error.message.includes('Invalid') || error.message.includes('incorrect')) {
        setError('Invalid email or password. Please try again.');
      } else if (error.message.includes('not found')) {
        setError('Account not found. Please check your email or sign up.');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
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
                  <h1 className="login-title">Welcome back</h1>

                  {/* Error Message */}
                  {error && (
                    <div className="alert alert-danger mb-3" role="alert">
                      <i className="bx bx-error-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLogin}>
                    {/* Email Field */}
                    <div className="form-group">
                      <input
                        type="text"
                        className={`form-input ${error ? 'is-invalid' : ''}`}
                        placeholder="Email address or Mobile*"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError(''); // Clear error when user types
                        }}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                      <div className="password-input-wrapper">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className={`form-input ${error ? 'is-invalid' : ''}`}
                          placeholder="Password*"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError(''); // Clear error when user types
                          }}
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
                    </div>

                    {/* Login Button */}
                    <button
                      type="submit"
                      className="btn-continue"
                      disabled={isLoading || !email.trim() || !password.trim()}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </span>
                          Signing In...
                        </>
                      ) : (
                        'Login'
                      )}
                    </button>
                  </form>

                  <div className="login-footer">
                    <p className="signup-text">
                      Don't have an account?
                      <button
                        onClick={handleSignUp}
                        className="signup-link"
                        disabled={isLoading}
                      >
                        Sign Up
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

            <div className={isGJ? "login-right" : "login-rightLe"}>
              <div className="brand-section">
                {/* <div className="brand-logo">
                  <h1 className="brand-title">Legal Eagle</h1>
                  <h2 className="brand-subtitle">is Now</h2>
                  <div className="ai-powered">
                    <span className="ai-text">AI-Powered.</span>
                    <div className="orbit-animation"></div>
                  </div>
                </div> */}

                {/* <div className="brand-footer">
                  <div className="gojuris-logo">
                    <img 
                      src="/logo.png" 
                      alt="GoJuris Logo" 
                      style={{ height: '24px', width: 'auto' }}
                    />
                  </div>
                  <div className="tagline">
                    &nbsp;&nbsp;AI Solutions for Legal Excellence
                    <i className="bx bx-right-arrow-alt"></i>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;