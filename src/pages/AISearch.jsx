// src/pages/AISearch.jsx  
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AISearch = () => {
  const [searchQuery, setSearchQuery] = useState('Ask AI');
  const [searchesRemaining, setSearchesRemaining] = useState(true);
  const [isListening, setIsListening] = useState(false);

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

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // Add voice search functionality here
    console.log('Voice search clicked');
  };

  return (
    <div className="gojuris-layout">
      <Sidebar />
      
      <div className="gojuris-main">
        {/* Replace the old header with Navbar component */}
        <Navbar />

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
                  <div className="search-buttons">
                    <button 
                      type="button" 
                      className={`voice-search-btn ${isListening ? 'listening' : ''}`}
                      onClick={handleVoiceSearch}
                      title="Voice search"
                    >
                      <i className="bx bx-microphone"></i>
                    </button>
                    <button type="submit" className="search-submit">
                      <i className="bx bx-search"></i>
                    </button>
                  </div>
                </div>
              </form>
              
              {searchesRemaining && (
                <div className="search-info">
                  <p className="searches-text">Replace This text</p>
                  <a href="#" className="upgrade-link">Related Queries</a>
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

      <style jsx>{`
        .search-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .ai-search-input {
          flex: 1;
          padding-right: 100px; /* Make space for both buttons */
        }

        .search-buttons {
          position: absolute;
          right: 8px;
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .voice-search-btn {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          color: #6B7280;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }

        .voice-search-btn:hover {
          background-color: #F3F4F6;
          color: #8B5CF6;
        }

        .voice-search-btn.listening {
          color: #EF4444;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .search-submit {
          background: #8B5CF6;
          border: none;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          color: white;
          transition: background-color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }

        .search-submit:hover {
          background: #7C3AED;
        }
      `}</style>
    </div>
  );
};

export default AISearch;