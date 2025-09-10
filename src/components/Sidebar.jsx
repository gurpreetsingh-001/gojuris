// src/components/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { id: 'ai-chat', icon: 'bx-chat', label: 'AI Chat', path: '/ai-chat' },
    { id: 'search', icon: 'bx-search', label: 'AI Search', path: '/ai-search' },
    { id: 'citation', icon: 'bx-book', label: 'Citation Search', path: '/citation' },
    { id: 'advance', icon: 'bx-search-alt', label: 'Advance Search', path: '/search' },
    { id: 'chat', icon: 'bx-chat', label: 'Chat', path: '/chat' },
    { id: 'database', icon: 'bx-data', label: 'Database', path: '/database' },
    { id: 'virtual', icon: 'bx-bot', label: 'Virtual Assistance', path: '/virtual' }
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
              <i className={`bx ${item.icon}`}></i>
            </div>
            <div className="sidebar-text">{item.label}</div>
          </div>
        ))}
      </div>
      
      <div className="sidebar-bottom">
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
      </div>
    </div>
  );
};

export default Sidebar;