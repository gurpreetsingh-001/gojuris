// src/components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { id: 'ai-chat', icon: '/Images/i-ai-chat-02.png', label: 'AI Chat', path: '/ai-chat' },
    { id: 'search', icon: '/Images/i-ai-search-03.png', label: 'AI Search', path: '/ai-search' },
    { id: 'keyword', icon: '/Images/i-case-law-research-04.png', label: 'Keyword Search', path: '/keyword' },
    { id: 'citation', icon: '/Images/i-Citation Search-05.png', label: 'Citation Search', path: '/citation' },
    { id: 'advance', icon: '/Images/i-Advance Case Law Search-06.png', label: 'Advance Search', path: '/search' },
    { id: 'nominal', icon: '/Images/NominalSearch.png', label: 'Nominal Search', path: '/nominal' },
    { id: 'database', icon: '/Images/i-case-law-research-04.png', label: 'Database', path: '/database' },
    { id: 'virtual', icon: '/Images/i-Virtual Legal Assistant-07.png', label: 'Virtual Assistance', path: '/virtual' }
  ];

  return (
    <div className="gojuris-sidebar">
      <div className="sidebar-items">
        {sidebarItems.map((item) => (
          <div 
            key={item.id}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
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
    </div>
  );
};

export default Sidebar;