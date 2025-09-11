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
  };

  const closeOffcanvas = () => {
    setIsOffcanvasOpen(false);
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

  return (
    <>
      <header className={`header navbar navbar-expand-lg fixed-top navbar-sticky w-100 ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container px-3">
          <a href="/" className="navbar-brand pe-3" onClick={handleLogoClick}>
            <img 
              src="/logo.png" 
              alt="GoJuris Logo" 
              style={{ height: '64px', width: 'auto' }}
            />
          </a>
          
          <div className={`offcanvas offcanvas-end ${isOffcanvasOpen ? 'show' : ''}`}>
            <div className="offcanvas-header border-bottom">
              <h5 className="offcanvas-title">Menu</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={closeOffcanvas}
                aria-label="Close"
              ></button>
            </div>
            
            <div className="offcanvas-body">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <button 
                    className={`nav-link btn btn-link ${location.pathname === '/' ? 'active' : ''}`}
                    onClick={navigateToHome}
                  >
                    Home
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link btn btn-link ${location.pathname === '/search' ? 'active' : ''}`}
                    onClick={navigateToSearch}
                  >
                    Why Us
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className="nav-link btn btn-link" 
                    onClick={() => scrollToSection('services')}
                  >
                    Latest
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className="nav-link btn btn-link" 
                    onClick={() => scrollToSection('doctors')}
                  >
                    Products
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className="nav-link btn btn-link" 
                    onClick={() => scrollToSection('contact')}
                  >
                    Subscriptions
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="offcanvas-header border-top">
              <a 
                href="#contact" 
                className="btn btn-primary w-100"
                onClick={handleContactClick}
              >
                <i className="bx bx-phone fs-4 lh-1 me-1"></i>
                Call Now
              </a>
            </div>      
          </div>

          <div className="d-flex align-items-center ms-auto">
            <div className="d-flex align-items-center me-3">
              <span className="text-muted me-2 d-none d-sm-inline" style={{ fontSize: '0.875rem' }}>
                Light
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
              <span className="text-muted ms-2 d-none d-sm-inline" style={{ fontSize: '0.875rem' }}>
                Dark
              </span>
            </div>

            <a 
              href="login" 
              className="btn btn-primary btn-sm rounded d-none d-lg-inline-flex me-3"
              onClick={handleContactClick}
              style={{ whiteSpace: 'nowrap' }}
            >
              <i className="bx bx-calendar-plus fs-5 lh-1 me-1"></i>
              Login
            </a>

            <button 
              type="button" 
              className="navbar-toggler" 
              onClick={toggleOffcanvas}
              aria-expanded={isOffcanvasOpen}
              aria-controls="navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </header>

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