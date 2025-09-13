// src/pages/Password.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/header';

const Password = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const email = location.state?.email || 'xyz@email.com';

  const handleContinue = (e) => {
    e.preventDefault();
    // navigate('/dashboard');
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
                        onChange={(e) => setPassword(e.target.value)}
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
                  
                  <button type="submit" className="btn-continue">
                    Continue
                  </button>
                </form>

                <div className="login-footer">
                  <button onClick={handleGoBack} className="go-back-btn">
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