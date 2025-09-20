// src/pages/Dashboard.jsx - Fixed version with image icons
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const services = [
    {
      title: 'AI Chat',
      description: 'Instantly search and analyze case law with AI-powered precision. Save hours of manual research.',
      icon: '/i-ai-chat-02.png', // Make sure this file exists in public folder
      link: '/ai-chat'
    },
    {
      title: 'AI Search', 
      description: 'Effortlessly find and understand statutes, rules, and legal provisions using intelligent AI search.',
      icon: '/i-ai-search-03.png', // Make sure this file exists in public folder
      link: '/ai-search'
    },
    {
      title: 'Case Law Research',
      description: 'Quickly locate and interpret statutes, rules, and regulations with AI-driven search capabilities.',
      icon: '/i-case-law-research-04.png', // Make sure this file exists in public folder
      link: '#case-law-research'
    },
    {
      title: 'Citation Search',
      description: 'Quickly find Indian case laws using journal name, year, volume, and page. Supports all courts.',
      icon: '/i-Citation Search-05.png', // Make sure this file exists in public folder
      link: '/citation'
    },
    {
      title: 'Advance Case Law Search',
      description: 'Find case laws by keywords, party names, judges, or case numbers across all courts.',
      icon: '/i-Advance Case Law Search-06.png', // Make sure this file exists in public folder
      link: '/search'
    },
    {
      title: 'Virtual Legal Assistant',
      description: 'Get instant answers to legal questions, draft documents, and streamline your workflow.',
      icon: '/i-Virtual Legal Assistant-07.png', // Make sure this file exists in public folder
      link: '#virtual-legal-assistant'
    }
  ];

  return (
    <div className="dashboard-page-compact">
      <div className="dashboard-container-compact">
        <div className="dashboard-header-compact">
          <div className="dashboard-subtitle-compact">
            <p>Offering a cutting-edge legal research AI tool. Accessible via web and app. Click for <br/> details. Empowering legal professionals with AI-driven insights.</p>
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
                    console.log(`${service.title} - Coming Soon`);
                  }}
                >
                  <div>
                    <img 
                      src={service.icon} 
                      alt={service.title}
                      style={{
                        width: '54px', 
                        height: '54px',
                        objectFit: 'contain',
                        filter: 'brightness(0) invert(1)' // Makes image white to match the design
                      }}
                      onError={(e) => {
                        console.error(`Failed to load icon: ${service.icon}`);
                        // Show a fallback icon or text instead of hiding
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span style="color: white; font-size: 24px;">📄</span>';
                      }}
                    />
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
                <div>
                  <img 
                    src={service.icon} 
                    alt={service.title}
                    style={{
                      width: '54px', 
                      height: '54px',
                      objectFit: 'contain',
                      filter: 'brightness(0) invert(1)' // Makes image white to match the design
                    }}
                    onError={(e) => {
                      console.error(`Failed to load icon: ${service.icon}`);
                      // Show a fallback icon or text instead of hiding
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<span style="color: white; font-size: 24px;">📄</span>';
                    }}
                  />
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
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.25);
        }

        .service-card-link:focus {
          outline: 2px solid var(--gj-primary);
          outline-offset: 2px;
        }

        /* Active state for service cards */
        .service-card-link:active {
          transform: translateY(0);
        }

        /* Updated Service Cards with Same Height */
        .service-card-compact {
          background: var(--gj-gradient-bhh) !important;
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          transition: all 0.3s ease;
          cursor: pointer;
          min-height: 140px; /* Same height for all boxes */
          height: 140px; /* Fixed height */
          color: white;
        }

        .service-card-compact:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.35);
          background: linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #5b21b6 100%) !important;
        }

        /* Service Icon with White Glassmorphism */
        .service-icon-compact {
          width: 50px;
          height: 50px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: white;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .service-card-compact:hover .service-icon-compact {
          transform: scale(1.1);
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }

        /* Service Content - Controlled spacing */
        .service-content-compact {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          overflow: hidden;
        }

        .service-title-compact {
          font-size: 1.3rem;
          font-weight: 600;
          color: black;
          margin-bottom: 0.5rem;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .service-description-compact {
          color: rgba(6, 6, 6, 0.9);
          line-height: 1.4;
          margin: 0;
          font-size: 0.875rem;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3; /* Maximum 3 lines */
          -webkit-box-orient: vertical;
        }

        /* Add cursor pointer for better UX */
        .service-card-link {
          cursor: pointer;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .service-card-compact {
            padding: 1.25rem;
            gap: 1rem;
            min-height: 120px; /* Smaller height on mobile */
            height: 120px;
          }
          
          .service-icon-compact {
            width: 45px;
            height: 45px;
            font-size: 1.1rem;
          }
          
          .service-title-compact {
            font-size: 1rem;
          }
          
          .service-description-compact {
            font-size: 0.8rem;
            -webkit-line-clamp: 2; /* Only 2 lines on mobile */
          }
        }

        @media (max-width: 480px) {
          .service-card-compact {
            min-height: 110px;
            height: 110px;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;