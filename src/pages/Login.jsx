// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleContinue = (e) => {
    e.preventDefault();
    navigate('/password', { state: { email } });
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <>
    <Header/>
    <div className="login-page-wrapper">
      <div className="login-layout">
        <div className="login-container">
          <div className="login-left">
            <div className="login-form-wrapper">
              {/* Logo */}
              

              {/* Form */}
              <div className="login-form">
                <h1 className="login-title">Welcome back</h1>
                
                <form onSubmit={handleContinue}>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Email address*"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <button type="submit" className="btn-continue">
                    Continue
                  </button>
                </form>

                <div className="login-footer">
                  <p className="signup-text">
                    Don't have an account? 
                    <button onClick={handleSignUp} className="signup-link">
                      Sign Up
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
    </div>
    </>
  );
};

export default Login;