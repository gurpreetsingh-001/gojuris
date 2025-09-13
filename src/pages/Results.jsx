// src/pages/Results.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Results = () => {
  const [activeTab, setActiveTab] = useState('all-courts');

  useEffect(() => {
    document.body.style.paddingTop = '0';
    
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  const searchResults = [
    {
      id: 1,
      title: "Sawanlal Vs. State of Madhya Pradesh",
      date: "16-07-1992",
      court: "M.P.HIGH COURT",
      accuracy: 95,
      excerpt: "Code of Criminal Procedure -- S.439 -- Indian Penal Code -- S.302 -- Indian Penal Code -- S.201ORDER P.N.S. Chouhan, J.- Arguments heard. 2. The applicant is facing charge of murdering his own wife and concealing her dead body. The evidence was read over which shows that on the pertinent night the applicant had come to the house of his in laws where his wife was residing and had a talk",
      highlightTerms: ["murdering", "wife"]
    },
    {
      id: 2,
      title: "Sawanlal Vs. State of Madhya Pradesh",
      date: "16-07-1992",
      court: "M.P.HIGH COURT",
      accuracy: 95,
      excerpt: "Code of Criminal Procedure -- S.439 -- Indian Penal Code -- S.302 -- Indian Penal Code -- S.201ORDER P.N.S. Chouhan, J.- Arguments heard. 2. The applicant is facing charge of murdering his own wife and concealing her dead body. The evidence was read over which shows that on the pertinent night the applicant had come to the house of his in laws where his wife was residing and had a talk",
      highlightTerms: ["murdering", "wife"]
    },
    {
      id: 3,
      title: "Sawanlal Vs. State of Madhya Pradesh",
      date: "16-07-1992",
      court: "M.P.HIGH COURT",
      accuracy: 95,
      excerpt: "Code of Criminal Procedure -- S.439 -- Indian Penal Code -- S.302 -- Indian Penal Code -- S.201ORDER P.N.S. Chouhan, J.- Arguments heard. 2. The applicant is facing charge of murdering his own wife and concealing her dead body. The evidence was read over which shows that on the pertinent night the applicant had come to the house of his in laws where his wife was residing and had a talk",
      highlightTerms: ["murdering", "wife"]
    }
  ];

  const highlightText = (text, terms) => {
    let highlightedText = text;
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });
    return { __html: highlightedText };
  };

  return (
    <div className="gojuris-layout">
      <Sidebar />
      
      <div className="gojuris-main">
        {/* Replace the old header with Navbar component */}
        <Navbar />

        <div className="search-title-section">
          <h2 className="search-title">Murder By Wife</h2>
        </div>

        <div className="search-tabs-section">
          <button 
            className={`tab-button ${activeTab === 'all-courts' ? 'active' : ''}`}
            onClick={() => setActiveTab('all-courts')}
          >
            All Courts
          </button>
          <button 
            className={`tab-button ${activeTab === 'supreme-only' ? 'active' : ''}`}
            onClick={() => setActiveTab('supreme-only')}
          >
            Supreme Court Only
          </button>
        </div>

        <div className="filters-section">
          <div className="filter-controls">
            <select className="filter-dropdown">
              <option>All Years</option>
              <option>2025</option>
              <option>2024</option>
            </select>
            
            <select className="filter-dropdown">
              <option>All COURTS</option>
              <option>Supreme Court</option>
              <option>High Court</option>
              <option>District Court</option>
              <option>Family Court</option>
              <option>Consumer Court</option>
            </select>
            
            <button className="sort-button">Sort by Date</button>
          </div>
          
          <div className="results-count">
            Showing 1 - 25 of 41,158 Results Found
          </div>
        </div>

        <div className="search-results">
          {searchResults.map((result, index) => (
            <div key={result.id} className="result-item">
              <div className="result-header">
                <h3 className="result-title">
                  {index + 1}. {result.title}
                </h3>
                <div className="accuracy-badge">
                  <i className="bx bx-target-lock text-success me-1"></i>
                  <span className="accuracy-text">Accuracy: {result.accuracy}%</span>
                </div>
              </div>
              
              <div className="result-meta">
                <span className="result-date">
                  <i className="bx bx-calendar"></i>
                  Date of Decision {result.date}
                </span>
                <span className="result-court">
                  <i className="bx bx-building"></i>
                  {result.court}
                </span>
              </div>
              
              <div 
                className="result-content"
                dangerouslySetInnerHTML={highlightText(result.excerpt, result.highlightTerms)}
              ></div>
              
              <a href={`/judgement/${result.id}`} className="read-judgement">Read Judgement.</a>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 15px;
        }

        .result-title {
          flex: 1;
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1F2937;
          line-height: 1.4;
        }

        .accuracy-badge {
          display: flex;
          align-items: center;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: 20px;
          padding: 4px 12px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .accuracy-text {
          font-size: 13px;
          font-weight: 600;
          color: #15803D;
        }

        .result-item {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;
          transition: box-shadow 0.2s ease;
        }

        .result-item:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .result-meta {
          display: flex;
          gap: 24px;
          margin-bottom: 12px;
          font-size: 14px;
          color: #6B7280;
        }

        .result-meta span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .result-content {
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
          margin-bottom: 12px;
        }

        .result-content mark {
          background: #FEF3C7;
          color: #92400E;
          padding: 2px 4px;
          border-radius: 3px;
        }

        .read-judgement {
          color: #8B5CF6;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
        }

        .read-judgement:hover {
          color: #7C3AED;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .result-header {
            flex-direction: column;
            gap: 8px;
          }

          .accuracy-badge {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default Results;