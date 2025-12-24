// src/pages/Dashboard.jsx - Fixed version with image icons
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/apiService';
const LatestLaw = () => {
  const navigate = useNavigate();
  const latestLaw = [
    {
      title: 'Latest Case-Law',
      description: 'Daily Supreme Court & High Court Rulings with Quick Summaries.',
      icon: '/Images/LatestJudgments.png',
      link: 'Case-Law'
    },
    {
      title: 'Latest Law Points',
      description: 'Fresh, concise legal principles extracted from New Judgments',
      icon: '/Images/Latestlawpoints.png',
      link: 'Latest-LawPoints',
      isLink: true
    },
    {
      title: 'Latest News',
      description: 'Important legal and policy updates from trusted national sources',
      icon: '/Images/LatestNews.png',
      link: 'News'
    },
    {
      title: 'Latest Notifications/Circulars',
      description: ' Latest government notifications and circulars in one place, updated daily',
      icon: '/Images/LatestNotifications.png',
      link: 'Notification'
    }
  ]
  
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // mm
    const day = String(date.getDate()).padStart(2, "0"); // dd

    // yyyy + dd + mm
    return `${year}${day}${month}`;
  }
  const handleLatestLawEvent = async (event) => {
    if (event === 'News') {
      navigate('/News');
    }
    else if (event === 'Latest-LawPoints') {
      navigate('/Latest-LawPoints');
    }
    else if (event === 'Case-Law') {
      const endDate = new Date(); // today

      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1); // last 1 month
      const payload = {
        requests: [{
          yearFrom: 2025,
          yearTo: 2025,
          mainkeys: ['ALL']
        }],
        sortBy: "year",
        sortOrder: "desc",
        page: 1,
        pageSize: 25,
        inst: '',
        prompt: "Database",
      };
      // const mockData = generateMockJudgements(courtKey, page, year);
      const apiResponse = await ApiService.executeAllSearch(
        payload
      );


      const resultsData = {

        results: apiResponse.hits || [],
        totalCount: apiResponse.total || 0,
        query: '',
        searchType: 'Latest Search',
        timestamp: new Date().toISOString(),
        courtsList: apiResponse.courtsList || [],
        yearList: apiResponse.yearList || [],
        searchData: {
          query: '',
          searchType: 'Latest Search',
          sortOrder: 'year',
          searchIn: 'B',
          nearWordsDistance: '5'
        }
      };
      localStorage.setItem('searchResults', JSON.stringify(resultsData));
      console.log('🚀 Navigating to results page...');
      navigate('/results');

    }
    setShowLawModel(false);
  };
  return (
    <div className="dashboard-page-compact">
      <div className="dashboard-container-compact">
        <div className="dashboard-header-compact">
          <div className="dashboard-subtitle-compact">
            {/* <p>Offering a cutting-edge legal research AI tool. Accessible via web and app. Click for <br/> details. Empowering legal professionals with AI-driven insights.</p> */}
          </div>
        </div>

        <div className="services-grid-compact robotofont">
           {latestLaw.map((service, index) => {
                    return (
                      <Link
                        key={index}
                        className="service-card-compact service-card-link"
                        style={{ marginBottom: '10px' }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLatestLawEvent(service.link);
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

export default LatestLaw;