// src/pages/Dashboard.jsx
import React from 'react';

const Dashboard = () => {
  const services = [
    {
      title: 'AI Chat',
      description: 'Instantly search and analyze case law with AI-powered precision. Save hours of manual research.',
      icon: 'bx-chat'
    },
    {
      title: 'AI Search', 
      description: 'Effortlessly find and understand statutes, rules, and legal provisions using intelligent AI search.',
      icon: 'bx-search-alt'
    },
    {
      title: 'Case Law Research',
      description: 'Quickly locate and interpret statutes, rules, and regulations with AI-driven search capabilities.',
      icon: 'bx-search'
    },
    {
      title: 'Citation Search',
      description: 'Quickly find Indian case laws using journal name, year, volume, and page. Supports all courts.',
      icon: 'bx-book'
    },
    {
      title: 'Advance Case Law Search',
      description: 'Find case laws by keywords, party names, judges, or case numbers across all courts.',
      icon: 'bx-search-alt-2'
    },
    {
      title: 'Virtual Legal Assistant',
      description: 'Get instant answers to legal questions, draft documents, and streamline your workflow.',
      icon: 'bx-bot'
    }
  ];

  return (
    <div className="dashboard-page-compact">
      <div className="dashboard-container-compact">
        <div className="dashboard-header-compact">
          <div className="gojuris-logo-compact">
            <img 
              src="/logo.png" 
              alt="GoJuris Logo" 
              style={{ height: '64px', width: 'auto' }}
            />
          </div>
          
          <div className="dashboard-subtitle-compact">
            <p>Offering a cutting-edge legal research AI tool. Accessible via web and app. Click for details. Empowering legal professionals with AI-driven insights.</p>
          </div>
        </div>
        
        <div className="services-grid-compact">
          {services.map((service, index) => (
            <div key={index} className="service-card-compact">
              <div className="service-icon-compact" style={{ borderColor: '#8b5cf6' }}>
                <i className={`bx ${service.icon}`} style={{ color: '#8b5cf6' }}></i>
              </div>
              <div className="service-content-compact">
                <h3 className="service-title-compact">{service.title}</h3>
                <p className="service-description-compact">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="dashboard-footer-compact">
          <p className="footer-text-compact">
            GoJuris specializes in legal research AI tools, ensuring compliance with all legal and ethical standards for AI in the legal industry.
          </p>
          <p className="footer-includes-compact">
            Includes: Case Law Research | Statute Finder | Legal Document Analysis | Virtual Legal Assistant
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;