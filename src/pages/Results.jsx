// src/pages/Results.jsx - Fixed clickable judgement links
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Results = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all-courts');
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [searchType, setSearchType] = useState('Search');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.paddingTop = '0';
    
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);
    
  useEffect(() => {
    // Load search results from sessionStorage
    const savedResults = sessionStorage.getItem('searchResults');
    console.log('📋 Raw sessionStorage data:', savedResults);
    
    if (savedResults) {
      try {
        const resultsData = JSON.parse(savedResults);
        console.log('✅ Parsed results data:', resultsData);
        
        const results = resultsData.results || [];
        const total = resultsData.totalCount || 0;
        
        console.log(`📊 Loading ${results.length} results from total ${total}`);
        console.log('🔍 First result sample:', results[0]);
        
        setSearchResults(results);
        setSearchQuery(resultsData.query || '');
        setTotalResults(total);
        setSearchType(resultsData.searchType || 'Search');
        
      } catch (error) {
        console.error('❌ Failed to parse search results:', error);
        setSearchResults([]);
        setTotalResults(0);
      }
    } else {
      console.warn('⚠️ No search results found, redirecting to search');
      navigate('/ai-search');
    }
    
    setIsLoading(false);
  }, [navigate]);

  // Format content based on the exact API structure
  const formatResultContent = (result) => {
    let content = '';
    
    if (result.headnoteAll) {
      content = result.headnoteAll;
    } else if (result.newHeadnote) {
      content = result.newHeadnote;
    } else if (result.issueForConsideration) {
      content = result.issueForConsideration;
    } else if (result.lawPoint) {
      content = result.lawPoint;
    } else if (result.held) {
      content = result.held;
    } else {
      content = 'Content not available';
    }
    
    // Truncate long content
    return content.length > 400 ? content.substring(0, 400) + '...' : content;
  };

  // Format title based on API structure
  const formatResultTitle = (result) => {
    if (result.appellant && result.respondent) {
      return `${result.appellant} vs ${result.respondent}`;
    }
    
    if (result.keycode) {
      return `Case ${result.keycode}`;
    }
    
    return 'Legal Case';
  };

  // Format court name
  const formatCourt = (result) => {
    return result.court || 'Court not specified';
  };

  // Format date from YYYYMMDD format
  const formatDate = (result) => {
    if (result.date) {
      try {
        const dateStr = result.date.toString();
        if (dateStr.length === 8) {
          const year = dateStr.substring(0, 4);
          const month = dateStr.substring(4, 6);
          const day = dateStr.substring(6, 8);
          return `${day}/${month}/${year}`;
        }
        return result.date;
      } catch {
        return result.date;
      }
    }
    return 'Date not available';
  };

  // FIXED: Proper judgment navigation handler
  const handleJudgementClick = (keycode, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (keycode) {
      console.log('🔍 Opening judgement:', keycode);
      navigate(`/judgement/${keycode}`);
    } else {
      console.warn('⚠️ No keycode provided for judgment');
    }
  };

  const highlightText = (text, query) => {
    if (!text || !query) return text;
    
    const words = query.toLowerCase().split(' ').filter(word => word.length > 2);
    let highlightedText = text;
    
    words.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });
    
    return { __html: highlightedText };
  };

  if (isLoading) {
    return (
      <div className="gojuris-layout">
        <Sidebar />
        <div className="gojuris-main">
          <Navbar />
          <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <div className="text-center">
              <i className="bx bx-loader bx-spin" style={{ fontSize: '2rem', color: 'var(--gj-primary)' }}></i>
              <p className="mt-2">Loading search results...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gojuris-layout">
      <Sidebar />
      
      <div className="gojuris-main">
        <Navbar />

        <div className="search-title-section">
          <h2 className="search-title">{searchQuery || 'Search Results'}</h2>
          <small className="text-muted">Results from {searchType}</small>
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
              <option>2023</option>
            </select>
            
            <select className="filter-dropdown">
              <option>All COURTS</option>
              <option>Supreme Court</option>
              <option>High Court</option>
              <option>District Court</option>
            </select>
            
            <button className="sort-button">Sort by Date</button>
          </div>
          
          <div className="results-count">
            Showing 1 - {Math.min(25, searchResults.length)} of {totalResults.toLocaleString()} Results Found
          </div>
        </div>

        <div className="search-results">
          {searchResults.length === 0 ? (
            <div className="no-results">
              <div className="text-center py-5">
                <i className="bx bx-search-alt" style={{ fontSize: '3rem', color: 'var(--gj-gray)' }}></i>
                <h4 className="mt-3">No Results Found</h4>
                <p className="text-muted">Try adjusting your search terms</p>
                <button 
                  className="btn btn-primary mt-3"
                  onClick={() => navigate('/ai-search')}
                >
                  New Search
                </button>
              </div>
            </div>
          ) : (
            searchResults.map((result, index) => (
              <div key={result.keycode || index} className="result-item">
                <div className="result-header">
                  {/* FIXED: Clickable heading */}
                  <h3 
                    className="result-title"
                    onClick={(e) => handleJudgementClick(result.keycode, e)}
                    style={{ 
                      cursor: result.keycode ? 'pointer' : 'default',
                      color: result.keycode ? 'var(--gj-primary)' : 'inherit'
                    }}
                    title={result.keycode ? 'Click to view full judgement' : ''}
                  >
                    {index + 1}. {formatResultTitle(result)}
                  </h3>
                </div>
                
                <div className="result-meta">
                  <span>
                    <i className="bx bx-calendar"></i>
                    {formatDate(result)}
                  </span>
                  <span>
                    <i className="bx bx-building"></i>
                    {formatCourt(result)}
                  </span>
                  <span>
                    <i className="bx bx-hash"></i>
                    Keycode: {result.keycode}
                  </span>
                </div>
                
                <div 
                  className="result-content"
                  dangerouslySetInnerHTML={highlightText(formatResultContent(result), searchQuery)}
                />
                
                {/* FIXED: Clickable "Read Full Judgement" link */}
                {result.keycode && (
                  <button 
                    className="read-judgement"
                    onClick={(e) => handleJudgementClick(result.keycode, e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--gj-primary)',
                      textDecoration: 'none',
                      fontWeight: '500',
                      cursor: 'pointer',
                      padding: '0',
                      fontSize: 'inherit'
                    }}
                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                  >
                    Read Full Judgement →
                  </button>
                )}
              </div>
            ))
          )}
          
          {/* Pagination */}
          {searchResults.length > 0 && (
            <div className="pagination-section mt-4 d-flex justify-content-between align-items-center">
              <div className="pagination-info">
                <span>Page 1 of {Math.ceil(totalResults / 25)}</span>
              </div>
              <div className="pagination-controls d-flex gap-2">
                <button className="btn btn-outline-primary" disabled>
                  <i className="bx bx-chevron-left me-1"></i>
                  Previous
                </button>
                <button className="btn btn-outline-primary">
                  Next
                  <i className="bx bx-chevron-right ms-1"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;