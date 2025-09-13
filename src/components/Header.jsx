// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isOffcanvasOpen ? 'hidden' : 'unset';
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
    navigate('/');
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

  const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/search') {
      navigate('/');
      setTimeout(() => {
        scrollToSection('contact');
      }, 100);
    } else {
      scrollToSection('contact');
    }
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
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOffcanvasOpen]);

  return (
    <>
      <header className={`header navbar navbar-expand-lg fixed-top navbar-sticky w-100 ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container px-3">
          

<a href="/" className="navbar-brand pe-3" onClick={handleLogoClick}>
  <img 
    src="/logo.png" 
    alt="GoJuris Logo" 
    className="d-inline-block align-text-top"
    style={{ height: '48px', width: 'auto', maxWidth: '200px' }}
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
            <div className="d-none d-sm-flex align-items-center me-3">
              <span className="text-muted me-2 d-none d-md-inline" style={{ fontSize: '0.875rem' }}>
                LIGHT
              </span>
              <div className="form-check form-switch mode-switch mb-0">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="theme-mode"
                  checked={isDarkMode}
                  onChange={toggleTheme}
                />
              </div>
              <span className="text-muted ms-2 d-none d-md-inline" style={{ fontSize: '0.875rem' }}>
                DARK
              </span>
            </div>

            <button 
              onClick={navigateToLogin}
              className="btn btn-primary btn-sm rounded d-none d-md-inline-flex me-3"
              style={{ whiteSpace: 'nowrap' }}
            >
              <i className="bx bx-user fs-5 lh-1 me-1"></i>
              LOGIN
            </button>

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
                  onClick={navigateToSearch}
                >
                  WHY US
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => scrollToSection('video-section')}
                >
                  COVERAGE
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => scrollToSection('services')}
                >
                  LATEST
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => scrollToSection('doctors')}
                >
                  PRODUCTS
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => scrollToSection('contact')}
                >
                   SUBSCRIPTIONS
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Mobile Offcanvas Menu */}
      <div className={`offcanvas offcanvas-end ${isOffcanvasOpen ? 'show' : ''}`} 
           tabIndex="-1" 
           id="offcanvasNavbar" 
           aria-labelledby="offcanvasNavbarLabel"
           style={{ visibility: isOffcanvasOpen ? 'visible' : 'hidden' }}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={closeOffcanvas}
            aria-label="Close"
          ></button>
        </div>
        
        <div className="offcanvas-body">
          <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
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
                onClick={navigateToSearch}
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
                onClick={() => scrollToSection('contact')}
              >
                <i className="bx bx-credit-card me-2"></i>
                Subscriptions
              </button>
            </li>
            <li className="nav-item mt-3">
              <button 
                onClick={navigateToLogin}
                className="nav-link btn btn-link w-100 text-start"
              >
                <i className="bx bx-user me-2"></i>
                Login
              </button>
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
    </>
  );
};


export default Header;