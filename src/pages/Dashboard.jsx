// src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const services = [
    {
      title: 'AI Chat',
      description: 'Instantly search and analyze case law with AI-powered precision. Save hours of manual research.',
      icon: 'bx-chat',
      link: '/ai-chat'
    },
    {
      title: 'AI Search', 
      description: 'Effortlessly find and understand statutes, rules, and legal provisions using intelligent AI search.',
      icon: 'bx-search-alt',
      link: '/ai-search'
    },
    {
      title: 'Case Law Research',
      description: 'Quickly locate and interpret statutes, rules, and regulations with AI-driven search capabilities.',
      icon: 'bx-search',
      link: '#case-law-research'
    },
    {
      title: 'Citation Search',
      description: 'Quickly find Indian case laws using journal name, year, volume, and page. Supports all courts.',
      icon: 'bx-book',
      link: '/citation'
    },
    {
      title: 'Advance Case Law Search',
      description: 'Find case laws by keywords, party names, judges, or case numbers across all courts.',
      icon: 'bx-search-alt-2',
      link: '/search'
    },
    {
      title: 'Virtual Legal Assistant',
      description: 'Get instant answers to legal questions, draft documents, and streamline your workflow.',
      icon: 'bx-bot',
      link: '#virtual-legal-assistant'
    }
  ];

  return (
    <div className="dashboard-page-compact">
      <div className="dashboard-container-compact">
        <div className="dashboard-header-compact">
          <div className="dashboard-subtitle-compact">
            <p>Offering a cutting-edge legal research AI tool. Accessible via web and app. Click for details. Empowering legal professionals with AI-driven insights.</p>
          </div>
        </div>
        
        <div className="services-grid-compact">
          {services.map((service, index) => {
            const isExternalLink = service.link.startsWith('#');
            
            if (isExternalLink) {
              return (
                <a 
                  key={index} 
                  href={service.link}
                  className="service-card-compact service-card-link"
                  onClick={(e) => {
                    e.preventDefault();
                    // You can add a toast notification here for coming soon features
                    console.log(`${service.title} - Coming Soon`);
                  }}
                >
                  <div className="service-icon-compact" style={{ borderColor: '#8b5cf6' }}>
                    <i className={`bx ${service.icon}`} style={{ color: '#8b5cf6' }}></i>
                  </div>
                  <div className="service-content-compact">
                    <h3 className="service-title-compact">{service.title}</h3>
                    <p className="service-description-compact">{service.description}</p>
                  </div>
                </a>
              );
            }
            
            return (
              <Link 
                key={index} 
                to={service.link}
                className="service-card-compact service-card-link"
              >
                <div className="service-icon-compact" style={{ borderColor: '#8b5cf6' }}>
                  <i className={`bx ${service.icon}`} style={{ color: '#8b5cf6' }}></i>
                </div>
                <div className="service-content-compact">
                  <h3 className="service-title-compact">{service.title}</h3>
                  <p className="service-description-compact">{service.description}</p>
                </div>
              </Link>
            );
          })}
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


<style jsx>{`
        /* Dashboard Service Card Links */
.service-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: all 0.3s ease;
}

.service-card-link:hover {
  text-decoration: none;
  color: inherit;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
}

.service-card-link:focus {
  outline: 2px solid var(--gj-primary);
  outline-offset: 2px;
}

/* Active state for service cards */
.service-card-link:active {
  transform: translateY(0);
}

/* Ensure service cards maintain their existing styles when wrapped in links */
.service-card-link .service-card-compact {
  border: none;
  background: inherit;
  padding: 0;
  margin: 0;
}

/* Add a subtle indication for clickable cards */
.service-card-compact:hover .service-icon-compact {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* Add cursor pointer for better UX */
.service-card-link {
  cursor: pointer;
}
    `}  </style>
    </div>
  );
};

export default Dashboard;