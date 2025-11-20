// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // NEW: Add state for mobile menu
  const [isOpen, setIsOpen] = useState(false);

  const sidebarItems = [
    { id: 'ai-chat', icon: '/i-ai-chat-02.png', label: 'AI Chat', path: '/ai-chat' },
    { id: 'search', icon: '/i-ai-search-03.png', label: 'AI Search', path: '/ai-search' },
    { id: 'keyword', icon: '/i-case-law-research-04.png', label: 'Keyword Search', path: '/keyword' },
    { id: 'citation', icon: '/i-Citation Search-05.png', label: 'Citation Search', path: '/citation' },
    { id: 'advance', icon: '/i-Advance Case Law Search-06.png', label: 'Advance Search', path: '/search' },
    { id: 'nominal', icon: '/i-NominalSearch-06.png', label: 'Nominal Search', path: '/nominal' },
    { id: 'database', icon: '/i-case-law-research-04.png', label: 'Database', path: '/database' },
    { id: 'virtual', icon: '/i-Virtual Legal Assistant-07.png', label: 'Virtual Assistance', path: '/virtual' }
  ];

  // NEW: Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // NEW: Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && window.innerWidth <= 768) {
        const sidebar = document.querySelector('.gojuris-sidebar');
        const hamburger = document.querySelector('.nav-hamburger-btn');
        
        if (sidebar && !sidebar.contains(event.target) && 
            hamburger && !hamburger.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // NEW: Toggle function
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // NEW: Handle navigation - close sidebar on mobile after navigation
  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* NEW: Hamburger Button - Only visible on mobile */}
      <button 
        className="nav-hamburger-btn"
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        <i className={`bx ${isOpen ? 'bx-x' : 'bx-menu'}`}></i>
      </button>

      {/* NEW: Overlay - Only visible on mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="nav-sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Your existing sidebar - Just added dynamic className */}
      <div className={`gojuris-sidebar ${isOpen ? 'sidebar-nav-open' : ''}`}>
        <div className="sidebar-items">
          {sidebarItems.map((item) => (
            <div 
              key={item.id}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <div className="sidebar-icon">
                <img 
                  src={item.icon} 
                  alt={item.label}
                  style={{
                    width: '54px', 
                    height: '54px',
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)'
                  }}
                />
              </div>
              <div className="sidebar-text">{item.label}</div>
            </div>
          ))}
        </div>
        
        {/* Your commented bottom section stays as is */}
        {/* <div className="sidebar-bottom">
          <div className="sidebar-item">
            <div className="sidebar-icon">
              <i className="bx bx-info-circle"></i>
            </div>
          </div>
          <div className="sidebar-item">
            <div className="sidebar-icon">
              <i className="bx bx-bell"></i>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Sidebar;