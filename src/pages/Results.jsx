// src/pages/Results.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

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
      excerpt: "Code of Criminal Procedure -- S.439 -- Indian Penal Code -- S.302 -- Indian Penal Code -- S.201ORDER P.N.S. Chouhan, J.- Arguments heard. 2. The applicant is facing charge of murdering his own wife and concealing her dead body. The evidence was read over which shows that on the pertinent night the applicant had come to the house of his in laws where his wife was residing and had a talk",
      highlightTerms: ["murdering", "wife"]
    },
    {
      id: 2,
      title: "Sawanlal Vs. State of Madhya Pradesh",
      date: "16-07-1992",
      court: "M.P.HIGH COURT",
      excerpt: "Code of Criminal Procedure -- S.439 -- Indian Penal Code -- S.302 -- Indian Penal Code -- S.201ORDER P.N.S. Chouhan, J.- Arguments heard. 2. The applicant is facing charge of murdering his own wife and concealing her dead body. The evidence was read over which shows that on the pertinent night the applicant had come to the house of his in laws where his wife was residing and had a talk",
      highlightTerms: ["murdering", "wife"]
    },
    {
      id: 3,
      title: "Sawanlal Vs. State of Madhya Pradesh",
      date: "16-07-1992",
      court: "M.P.HIGH COURT",
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
        <div className="gojuris-header">
          <div className="header-content">
            <img 
              src="/logo.png" 
              alt="GoJuris Logo" 
              style={{ height: '64px', width: 'auto' }}
            />
            <button className="login-btn">Login</button>
          </div>
        </div>

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
              <h3 className="result-title">
                {index + 1}. {result.title}
              </h3>
              
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
    </div>
  );
};

export default Results;