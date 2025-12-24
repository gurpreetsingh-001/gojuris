// src/pages/Dashboard.jsx - Fixed version with image icons
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const navigate = useNavigate();
  const stateCodeMap = {
  "Andhra Pradesh": "AP",
  "Assam & North East": "NorthPDF",
  "Bihar": "PAT",
  "Chhattisgarh": "CHHAT",
  "Delhi": "DEL",
  "Goa": "Goa",
  "Gujarat": "Guj",
  "Himachal": "HIM",
  "Jammu and Kashmir": "JK",
  "Jharkhand": "JHAR",
  "Kerala": "KER",
  "Karnataka": "KAR",
  "Madhya Pradesh": "MP",
  "Maharashtra": "MAH",
  "Orissa": "ORI",
  "Punjab & Haryana": "PUN",
  "Rajasthan": "RAJ",
  "Tamil Nadu": "TAM",
  "Uttar Pradesh": "UP",
  "Uttaranchal": "UTT",
  "West Bengal": "WB"
};

  const services = [
    {
      title: 'AI Chat',
      description: 'Instantly search and analyze case law with AI-powered precision. Save hours of manual research.',
      icon: '/Images/i-ai-chat-02.png',
      link: '/ai-chat'
    },
    {
      title: 'AI Search',
      description: 'Instantly finds the exact judgments you need with full context and unmatched accuracy.',
      icon: '/Images/i-ai-search-03.png',
      link: '/ai-search'
    },
    {
      title: 'Keyword Search',
      description: 'gives you instant, precise results using exact phrase, free word, all words, and near-word matching.',
      icon: '/Images/i-case-law-research-04.png',
      link: '/keyword'
    },
    {
      title: 'Citation Search',
      description: 'Quickly find Indian case laws using journal name, year, volume, and page. Supports all courts.',
      icon: '/Images/i-Citation Search-05.png',
      link: '/citation'
    },
    {
      title: 'Advance Search',
      description: 'Find case laws by keywords, party names, judges, or case numbers across all courts.',
      icon: '/Images/i-Advance Case Law Search-06.png',
      link: '/search'
    },
    {
      title: 'Nominal Search',
      description: 'Locate cases by petitioner/respondent names—fast and accurate.',
      icon: '/Images/NominalSearch.png',
      link: '/Nominal'
    },
    {
      title: 'Latest in LAW',
      description: ' Stay updated with the Latest in Law — Fresh judgments, Amendments, Legal Daily News and other legal developments on daily basis.',
      icon: '/Images/i-law.png',
      link: '/Latest-Law'
    },
    {
      title: 'Database',
      description: 'Get instant answers to legal questions, draft documents, and streamline your workflow.',
      icon: '/Images/i-database.png',
      link: '/database'
    },
    {
      title: 'Legal Dictionary',
      description: 'Comprehensive Legal Terminology at your fingertips for precise legal research.',
      icon: '/Images/legaldictionary.png',
      link: '/Dictionary'
    },
    {
      title: 'Reports',
      description: 'Covers Law Commission Reports, Constituent Assembly Debates and other Important Legal Reports.',
      icon: '/Images/reports.png',
      link: '/Reports'
    },
    {
      title: 'Central Laws ',
      description: 'A comprehensive library of all Central Statutes and regulations, providing quick access to authoritative legal texts in one place.',
      icon: '/Images/centrallaws.png',
      link: '/CAActsList'
    },
    {
      title: 'State Laws',
      description: 'A dedicated collection of state-specific statutes and regulations, enabling quick reference to region-wise legal provisions.',
      icon: '/Images/statelaw.png',
      link: 'state-Law'
    },
    {
      title: 'Bookmarks',
      description: 'Save important judgments instantly with the Bookmark feature for quick future access.',
      icon: '/Images/bookmark.png',
      link: '/saveBookmarks'
    },
    {
      title: 'Articles & Blogs',
      description: 'Handpicked, expertly written legal articles and blogs by eminent authors—reliable insights you can cite and trust.',
      icon: '/Images/articles_ic.png',
      link: '/articles'
    },
    {
      title: 'Virtual Legal Assistant',
      description: 'Get instant answers to legal questions, draft documents, and streamline your workflow.',
      icon: '/Images/i-Virtual Legal Assistant-07.png',
      link: '#virtual-legal-assistant'
    }

  ];

  return (
    <div className="dashboard-page-compact">
      <div className="dashboard-container-compact">
        <div className="dashboard-header-compact">
          <div className="dashboard-subtitle-compact">
            {/* <p>Offering a cutting-edge legal research AI tool. Accessible via web and app. Click for <br/> details. Empowering legal professionals with AI-driven insights.</p> */}
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
                    setShowComingSoonModal(true);
                  }}
                >
                  <div>
                    <img
                      src={service.icon}
                      alt={service.title}
                      style={{
                        width: '94px',
                        height: '94px',
                        objectFit: 'contain'
                        // Makes image white to match the design
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
                to={service.link === "state-Law" ? "#" : service.link}
                className="service-card-compact service-card-link"
                onClick={(e) => {
                  if (service.link === "state-Law") {
                    e.preventDefault();       // stop navigation
                   navigate(`/StateLaws`);
                  }
                }}
              >
                <div>
                  <img
                    src={service.icon}
                    alt={service.title}
                    style={{
                      width: '94px',
                      height: '94px',
                      objectFit: 'contain'
                      // Makes image white to match the design
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
          {showComingSoonModal && (
                  <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onClick={() => setShowComingSoonModal(false)}
                  >
                    <div
                      className="modal-dialog modal-dialog-centered"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="modal-content" style={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                      }}>
                        <div className="modal-header border-0">
                          <h5 className="modal-title" style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#1a1a1a'
                          }}>
                            Coming Soon
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowComingSoonModal(false)}
                          ></button>
                        </div>
                        <div className="modal-body text-center py-4">
                          <div style={{
                            fontSize: '48px',
                            color: '#7C3AED',
                            marginBottom: '16px'
                          }}>
                            <i className="bx bx-time-five"></i>
                          </div>
                          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '0' }}>
                            This feature is currently under development and will be available soon!
                          </p>
                        </div>
                        <div className="modal-footer border-0">
                          <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={() => setShowComingSoonModal(false)}
                            style={{
                              borderRadius: '8px',
                              background: '#7C3AED',
                              border: 'none',
                              padding: '10px'
                            }}
                          >
                            Got it!
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
          background: linear-gradient(135deg, #e4e1e9ff 0%, #efdcf2ff 50%, #d3c6eaff 100%) !important;
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
          font-weight: 700;
          color: #8b5cf6;
          margin-bottom: 0.5rem;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: "Roboto Condensed", sans-serif;
        }

        .service-description-compact {
          color: rgba(6, 6, 6, 0.9);
          line-height: 1.4;
          margin: 0;
          font-size: 0.875rem;
          overflow: hidden;
          display: -webkit-box;
          font-family: "Roboto Condensed", sans-serif;
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