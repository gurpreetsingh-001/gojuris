// src/components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { id: 'ai-chat', icon: '/i-ai-chat-02.png', label: 'AI Chat', path: '/ai-chat' },
    { id: 'search', icon: '/i-ai-search-03.png', label: 'AI Search', path: '/ai-search' },
    { id: 'keyword', icon: '/i-ai-search-03.png', label: 'Keyword', path: '/keyword' },
    { id: 'citation', icon: '/i-Citation Search-05.png', label: 'Citation Search', path: '/citation' },
    { id: 'advance', icon: '/i-Advance Case Law Search-06.png', label: 'Advance Search', path: '/search' },
    
    { id: 'database', icon: '/i-case-law-research-04.png', label: 'Database', path: '/database' },
    { id: 'virtual', icon: '/i-Virtual Legal Assistant-07.png', label: 'Virtual Assistance', path: '/virtual' }
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
                   
                    style={{
                      width: '54px', 
                      height: '54px',
                      objectFit: 'contain',
                      filter: 'brightness(0) invert(1)' // Makes image white to match the design
                    }}
              />
            </div>
            <div className="sidebar-text">{item.label}</div>
          </div>
        ))}
      </div>
      
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
  );
};

export default Sidebar;