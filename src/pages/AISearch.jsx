// src/pages/AISearch.jsx  
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const AISearch = () => {
  const [searchQuery, setSearchQuery] = useState('Ask AI');
  const [searchesRemaining, setSearchesRemaining] = useState(true);

  useEffect(() => {
    document.body.style.paddingTop = '0';
    
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('AI Search:', searchQuery);
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

        <div className="ai-search-content-with-sidebar">
          <div className="search-header">
            <div className="search-badge">
              <i className="bx bx-search-alt"></i>
              <span>AI Searches</span>
            </div>
          </div>
          
          <div className="search-hero">
            <h1 className="search-main-title">
              Discover patterns, context, and legal logic—faster than ever.
            </h1>
            
            <div className="search-box">
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-container">
                  <input
                    type="text"
                    className="ai-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask AI"
                  />
                  <button type="submit" className="search-submit">
                    <i className="bx bx-search"></i>
                  </button>
                </div>
              </form>
              
              {searchesRemaining && (
                <div className="search-info">
                  <p className="searches-text">You have searches remaining.</p>
                  <a href="#" className="upgrade-link">Upgrade Plan</a>
                </div>
              )}
            </div>
          </div>
          
          <div className="search-description">
            <h2 className="description-title">
              Making legal search easy for you or Simplifying legal search for you
            </h2>
            <p className="description-text">
              Tailored for legal professionals, our advanced search options simplify legal research. 
              Effortlessly access judgments, statutes, and citations, saving time and enhancing your workflow efficiency.
            </p>
            <p className="includes-text">
              Includes: Case Law Codes | Rules & Constitutions | Practical Guidance | Treatises
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISearch;