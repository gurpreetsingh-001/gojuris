// src/pages/Password.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';

const Password = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const email = location.state?.email || 'xyz@email.com';

  // API Base URL
  const API_BASE_URL = 'http://108.60.219.166:8001';

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('expiresAt', data.expiresAt);
        localStorage.setItem('userEmail', username);
        
        return { success: true, data };
      } else {
        return { 
          success: false, 
          error: data.message || 'Invalid username or password' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await handleLogin(email, password);
      
      if (result.success) {
        // Login successful - redirect to dashboard
        navigate('/dashboard');
      } else {
        // Login failed - show error
        setError(result.error);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('An unexpected error occurred. Please try again.');
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
                {/* Form */}
                <div className="login-form">
                  <h1 className="login-title">Enter your password</h1>
                  
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
                        <button type="button" onClick={handleGoBack} className="edit-email">
                          Edit
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="password-input-wrapper">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-input"
                          placeholder="Password*"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError(''); // Clear error when user types
                          }}
                          required
                          disabled={isLoading}
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
                          Signing in...
                        </>
                      ) : (
                        'Continue'
                      )}
                    </button>
                  </form>

                  <div className="login-footer">
                    <button onClick={handleGoBack} className="go-back-btn" disabled={isLoading}>
                      Go back
                    </button>
                    
                    <div className="mt-3 text-center">
                      <a href="#" className="text-primary text-decoration-none">
                        Forgot your password?
                      </a>
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