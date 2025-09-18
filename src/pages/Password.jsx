// src/pages/Password.jsx - Update existing file
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ApiService from '../services/apiService';

const Password = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const email = location.state?.email || 'xyz@email.com';

  const handleContinue = async (e) => {
    e.preventDefault();
    
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
      if (result.userEmail || email) {
  localStorage.setItem('userEmail', result.userEmail || email);
}

// Store any additional user data from login response
if (result.userData) {
  localStorage.setItem('userData', JSON.stringify(result.userData));
} else if (result.user) {
  localStorage.setItem('userData', JSON.stringify(result.user));
}
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

  const handleGoBack = () => {
    navigate('/login');
  };

  return (
    <>
      <Header/>
      <div className="login-page-wrapper">
        <div className="login-layout">
          <div className="login-container">
            <div className="login-left">
              <div className="login-form-wrapper">
                <div className="login-form">
                  <h1 className="login-title">Enter your password</h1>
                  
                  {/* Error Message */}
                  {error && (
                    <div className="alert alert-danger mb-3" role="alert">
                      <i className="bx bx-error-circle me-2"></i>
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleContinue}>
                    <div className="form-group">
                      <div className="email-display">
                        <span className="email-text">{email}</span>
                        <button 
                          type="button" 
                          onClick={handleGoBack} 
                          className="edit-email"
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                      </div>
                    </div>

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
                    
                    <button 
                      type="submit" 
                      className="btn-continue"
                      disabled={isLoading || !password.trim()}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </span>
                          Signing In...
                        </>
                      ) : (
                        'Continue'
                      )}
                    </button>
                  </form>

                  <div className="login-footer">
                    <button 
                      onClick={handleGoBack} 
                      className="go-back-btn"
                      disabled={isLoading}
                    >
                      Go back
                    </button>
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
                    &nbsp;&nbsp;AI Solutions for Legal Excellence
                    <i className="bx bx-right-arrow-alt"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Password;