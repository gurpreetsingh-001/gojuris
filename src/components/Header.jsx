// src/components/Header.jsx - Add announcement banner only
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../services/apiService';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Authentication and user profile states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication on component mount and route changes
  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  const checkAuthStatus = () => {
    console.log('🔍 Checking authentication status...');
    const authenticated = ApiService.isAuthenticated();
    console.log('Auth status:', authenticated);
    
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      loadUserProfile();
    } else {
      setUserProfile(null);
      setShowAccountDropdown(false);
    }
  };

  const loadUserProfile = async () => {
    setIsLoadingProfile(true);
    try {
      // Try to get from localStorage first
      let profileData = {
        email: localStorage.getItem('userEmail') || 'user@gojuris.com',
        displayName: 'Legal User',
        username: 'user'
      };

      // Try to get from stored userData
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          profileData = {
            ...profileData,
            ...userData,
            displayName: userData.displayName || 
                        userData.name || 
                        `${userData.firstName || ''} ${userData.lastName || ''}`.trim() ||
                        userData.username ||
                        profileData.displayName
          };
        } catch (e) {
          console.warn('Failed to parse stored user data:', e);
        }
      }

      // Try to fetch fresh profile from API
      try {
        const apiProfile = await ApiService.getUserProfile();
        if (apiProfile) {
          profileData = {
            ...profileData,
            ...apiProfile,
            displayName: apiProfile.displayName || 
                        apiProfile.name || 
                        `${apiProfile.firstName || ''} ${apiProfile.lastName || ''}`.trim() ||
                        apiProfile.username ||
                        profileData.displayName
          };
          
          // Store updated profile data
          localStorage.setItem('userData', JSON.stringify(profileData));
        }
      } catch (apiError) {
        console.warn('Failed to fetch user profile from API:', apiError.message);
        // Continue with localStorage data
      }

      setUserProfile(profileData);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // Set default fallback
      setUserProfile({
        email: 'user@gojuris.com',
        displayName: 'Legal User',
        username: 'user'
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSignOut = async () => {
    console.log('🚪 Sign out button clicked');
    
    try {
      // Close dropdown immediately
      setShowAccountDropdown(false);
      
      console.log('🔄 Calling ApiService.logout()...');
      
      // Call logout API
      await ApiService.logout();
      
      console.log('✅ ApiService.logout() completed');
      
      // Force clear all local state immediately
      setIsAuthenticated(false);
      setUserProfile(null);
      setIsLoadingProfile(false);
      
      console.log('🔄 State cleared, navigating to login...');
      
      // Navigate to login
      navigate('/login');
      
      console.log('✅ Navigation completed');
      
    } catch (error) {
      console.error('❌ Sign out error:', error);
      
      // Force logout even if API call fails
      try {
        // Clear storage manually
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiresAt');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userData');
        
        setIsAuthenticated(false);
        setUserProfile(null);
        setIsLoadingProfile(false);
        
        navigate('/login');
        console.log('✅ Forced logout completed');
      } catch (clearError) {
        console.error('❌ Failed to clear storage:', clearError);
        // As last resort, reload the page
        window.location.href = '/login';
      }
    }
  };

  // Handle dropdown item clicks
  const handleDropdownItemClick = (action) => {
    setShowAccountDropdown(false);
    
    switch (action) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'profile':
        // TODO: Navigate to profile page when implemented
        console.log('View Profile clicked');
        break;
      case 'billing':
        // TODO: Navigate to billing page when implemented
        console.log('Billing & Plans clicked');
        break;
      case 'history':
        // TODO: Navigate to search history page when implemented
        console.log('Search History clicked');
        break;
      case 'signout':
        handleSignOut();
        break;
      default:
        break;
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userProfile) return 'U';
    
    const displayName = userProfile.displayName || userProfile.name || userProfile.username;
    if (displayName && displayName.length > 0) {
      const names = displayName.trim().split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    
    return userProfile.email ? userProfile.email[0].toUpperCase() : 'U';
  };

  // Format display name
  const getDisplayName = () => {
    if (!userProfile) return 'Loading...';
    
    return userProfile.displayName || 
           userProfile.name || 
           userProfile.username || 
           (userProfile.email ? userProfile.email.split('@')[0] : 'Legal User');
  };

  // Get email
  const getEmail = () => {
    return userProfile?.email || 'user@gojuris.com';
  };

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
    document.body.style.overflow = isOffcanvasOpen ? 'unset' : 'hidden';
  };

  const closeOffcanvas = () => {
    setIsOffcanvasOpen(false);
    document.body.style.overflow = 'unset';
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.setAttribute('data-bs-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      setIsDarkMode(isDark);
      document.documentElement.setAttribute('data-bs-theme', savedTheme);
    }
  }, []);

  const scrollToSection = (sectionId) => {
    if (location.pathname === '/search') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    closeOffcanvas();
  };

 const navigateToHome = () => {
  // If already on home page, scroll to hero section
  if (location.pathname === '/') {
    const heroElement = document.getElementById('hero');
    if (heroElement) {
      const headerOffset = 120; // Account for fixed header + announcement banner
      const elementPosition = heroElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback: scroll to top if hero section not found
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  } else {
    // If on other pages, navigate to home page
    navigate('/');
  }
  closeOffcanvas();
};

  const navigateToSearch = () => {
    navigate('/search');
    closeOffcanvas();
  };

  const navigateToLogin = () => {
    navigate('/login');
    closeOffcanvas();
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
    closeOffcanvas();
    setShowAccountDropdown(false);
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    navigate('/pricing');
    closeOffcanvas();
  };
  
  const navigateToSubscriptions = () => {
    navigate('/pricing');
    closeOffcanvas();
  };
  
  const handleLogoClick = (e) => {
    e.preventDefault();
    navigateToHome();
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOffcanvasOpen) {
        closeOffcanvas();
      }
      if (e.key === 'Escape' && showAccountDropdown) {
        setShowAccountDropdown(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOffcanvasOpen, showAccountDropdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showAccountDropdown && !e.target.closest('.account-dropdown')) {
        setShowAccountDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showAccountDropdown]);

  return (
    <>
      {/* Announcement Banner - ONLY NEW ADDITION */}
      <div className="announcement-banner">
        <span className="blink-text">Legal Eagle is now AI Powered</span>
      </div>

      <header className={`header navbar navbar-expand-lg fixed-top navbar-sticky w-100 ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container px-3">
          <a href="/" className="navbar-brand pe-3" onClick={handleLogoClick}>
            <img 
              src="/logo.png" 
              alt="GoJuris Logo" 
              className="d-inline-block align-text-top"
              style={{ height: '60px', width: 'auto', maxWidth: '250px' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <span style="color: var(--gj-primary); font-size: 1.5rem; font-weight: 700;">
                    GoJuris
                  </span>
                `;
              }}
            />
          </a>
          
          <div className="d-flex align-items-center ms-auto order-lg-3">
            {/* Login/My Account Button */}
            {isAuthenticated ? (
              <div className="position-relative account-dropdown">
                <button
                  className="btn btn-primary d-flex align-items-center gap-2 px-3 d-none d-md-inline-flex me-3"
                  type="button"
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  disabled={isLoadingProfile}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {isLoadingProfile ? (
                    <>
                      <div className="spinner-border spinner-border-sm text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <div 
                        className="d-flex align-items-center justify-content-center bg-light text-primary rounded-circle"
                        style={{ width: '24px', height: '24px', fontSize: '12px', fontWeight: '600' }}
                      >
                        {getUserInitials()}
                      </div>
                      <span>My Account</span>
                      <i className="bx bx-chevron-down"></i>
                    </>
                  )}
                </button>
                
                {showAccountDropdown && (
                  <div 
                    className="dropdown-menu dropdown-menu-end show position-absolute bg-white border shadow"
                    style={{ 
                      minWidth: '220px', 
                      top: '100%', 
                      right: '0', 
                      zIndex: 9999,
                      pointerEvents: 'auto'
                    }}
                  >
                    <div className="dropdown-header px-3 py-2 border-bottom">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                             style={{ width: '32px', height: '32px' }}>
                          <span className="text-white fw-semibold" style={{ fontSize: '14px' }}>
                            {getUserInitials()}
                          </span>
                        </div>
                        <div>
                          <div className="fw-semibold text-dark">
                            {getDisplayName()}
                          </div>
                          <small className="text-muted">
                            {getEmail()}
                          </small>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className="dropdown-item d-flex align-items-center px-3 py-2 border-0 bg-transparent w-100"
                      onClick={() => handleDropdownItemClick('dashboard')}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="bx bx-grid-alt me-2 text-primary"></i>
                      <span>Dashboard</span>
                    </button>
                    
                    <button 
                      className="dropdown-item d-flex align-items-center px-3 py-2 border-0 bg-transparent w-100"
                      onClick={() => handleDropdownItemClick('profile')}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="bx bx-user-circle me-2 text-primary"></i>
                      <span>View Profile</span>
                    </button>
                    
                    <button 
                      className="dropdown-item d-flex align-items-center px-3 py-2 border-0 bg-transparent w-100"
                      onClick={() => handleDropdownItemClick('billing')}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="bx bx-credit-card me-2 text-primary"></i>
                      <span>Billing & Plans</span>
                    </button>
                    
                    <button 
                      className="dropdown-item d-flex align-items-center px-3 py-2 border-0 bg-transparent w-100"
                      onClick={() => handleDropdownItemClick('history')}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="bx bx-history me-2 text-primary"></i>
                      <span>Search History</span>
                    </button>
                    
                    <div className="border-top my-1"></div>
                    
                    <button 
                      className="dropdown-item d-flex align-items-center px-3 py-2 border-0 bg-transparent w-100 text-danger"
                      onClick={() => handleDropdownItemClick('signout')}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="bx bx-log-out me-2"></i>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={navigateToLogin}
                className="btn btn-primary btn-sm rounded d-none d-md-inline-flex me-3"
                style={{ whiteSpace: 'nowrap' }}
              >
                <i className="bx bx-user fs-5 lh-1 me-1"></i>
                LOGIN
              </button>
            )}

            <button 
              type="button" 
              className="navbar-toggler d-lg-none" 
              onClick={toggleOffcanvas}
              aria-expanded={isOffcanvasOpen}
              aria-controls="navbarNav"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="collapse navbar-collapse order-lg-2" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link ${location.pathname === '/' ? 'active' : ''}`}
                  onClick={navigateToHome}
                >
                  HOME
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link btn btn-link ${location.pathname === '/search' ? 'active' : ''}`}
                  onClick={() => scrollToSection('services')}
                >
                  WHY US
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => scrollToSection('services')}
                >
                  COVERAGE
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => scrollToSection('llp')}
                >
                  LATEST
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => scrollToSection('cta')}
                >
                  PRODUCTS
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={navigateToSubscriptions}
                >
                  SUBSCRIPTIONS
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Mobile Offcanvas */}
      <div className={`offcanvas offcanvas-end ${isOffcanvasOpen ? 'show' : ''}`} 
           tabIndex="-1" 
           id="navbarNav" 
           style={{ visibility: isOffcanvasOpen ? 'visible' : 'hidden' }}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menu</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={closeOffcanvas}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav">
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link w-100 text-start ${location.pathname === '/' ? 'active' : ''}`}
                onClick={navigateToHome}
              >
                <i className="bx bx-home me-2"></i>
                Home
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link w-100 text-start ${location.pathname === '/search' ? 'active' : ''}`}
                onClick={() => scrollToSection('about')}
              >
                <i className="bx bx-star me-2"></i>
                Why Us
              </button>
            </li>
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link w-100 text-start" 
                onClick={() => scrollToSection('video-section')}
              >
                <i className="bx bx-shield me-2"></i>
                Coverage
              </button>
            </li>
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link w-100 text-start" 
                onClick={() => scrollToSection('services')}
              >
                <i className="bx bx-news me-2"></i>
                Latest
              </button>
            </li>
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link w-100 text-start" 
                onClick={() => scrollToSection('doctors')}
              >
                <i className="bx bx-package me-2"></i>
                Products
              </button>
            </li>
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link w-100 text-start" 
                onClick={navigateToSubscriptions}
              >
                <i className="bx bx-credit-card me-2"></i>
                Subscriptions
              </button>
            </li>
            
            {/* Mobile Authentication Section */}
            <li className="nav-item mt-3">
              {isAuthenticated ? (
                <div>
                  <div className="px-3 py-2 mb-2 bg-light rounded">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                           style={{ width: '28px', height: '28px' }}>
                        <span className="text-white fw-semibold" style={{ fontSize: '12px' }}>
                          {getUserInitials()}
                        </span>
                      </div>
                      <div>
                        <div className="fw-semibold small">{getDisplayName()}</div>
                        <small className="text-muted">{getEmail()}</small>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="nav-link btn btn-link w-100 text-start"
                    onClick={navigateToDashboard}
                  >
                    <i className="bx bx-grid-alt me-2"></i>
                    Dashboard
                  </button>
                  
                  <button 
                    className="nav-link btn btn-link w-100 text-start text-danger"
                    onClick={() => handleDropdownItemClick('signout')}
                  >
                    <i className="bx bx-log-out me-2"></i>
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={navigateToLogin}
                  className="nav-link btn btn-link w-100 text-start"
                >
                  <i className="bx bx-user me-2"></i>
                  Login
                </button>
              )}
            </li>
          </ul>

          <div className="mt-4">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted" style={{ fontSize: '0.875rem' }}>Theme</span>
              <div className="form-check form-switch mode-switch">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="theme-mode-mobile"
                  checked={isDarkMode}
                  onChange={toggleTheme}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOffcanvasOpen && (
        <div 
          className="offcanvas-backdrop fade show" 
          onClick={closeOffcanvas}
        ></div>
      )}

      {/* Account dropdown backdrop for mobile */}
      {showAccountDropdown && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ 
            zIndex: 9998,
            pointerEvents: 'none'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAccountDropdown(false);
            }
          }}
        ></div>
      )}

      {/* CSS for Announcement Banner - ONLY NEW STYLES */}
      <style jsx>{`
        .announcement-banner {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 10px 0;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1051;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .blink-text {
          animation: blink 1.5s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0.4;
          }
        }

        /* Adjust header position */
        .header {
          top: 34px !important;
        }

        @media (max-width: 768px) {
          .announcement-banner {
            font-size: 12px;
            padding: 8px 0;
          }
          
          .header {
            top: 30px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Header;