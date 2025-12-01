// src/pages/Keyword.jsx - Corrected version
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ApiService from '../services/apiService';

const Nominal = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);

  // New state for radio button options
  const [searchIn, setSearchIn] = useState('B'); // head-notes, full-judgement, both

  useEffect(() => {
    document.body.style.paddingTop = '0';
    const storedKeyword = localStorage.getItem('SearchHNominal');
    if (storedKeyword) {
      setSearchQuery(storedKeyword);
    }

    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim() || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      console.log('Starting Search process...');
      console.log('Query:', searchQuery);
      console.log('Search In:', searchIn);

      // Prepare search options with new radio button values
      const searchOptions = {
        pageSize: 25,
        page: 1,
        sortBy: 'rele',
        searchIn: searchIn
      };
      

      const apiResponse = await ApiService.searchNominal({party: searchQuery, searchIn: searchIn}, searchOptions);

      const searchResults = apiResponse.hits || [];
      const totalCount = apiResponse.total || 0;

      console.log(`📊 Processing ${searchResults.length} results from total ${totalCount}`);

      if (searchResults.length === 0) {
        setError('No results found for your search query. Try different keywords.');
        setIsLoading(false);
        return;
      }

      const resultsData = {
        results: apiResponse.hits || [],
        totalCount: apiResponse.total || 0,
        query: '',
        searchType: 'Nominal Search',
        timestamp: new Date().toISOString(),
        courtsList: apiResponse.courtsList || [],
        yearList: apiResponse.yearList || [],
        searchData: {
          query: '',
          searchType: 'Nominal Search',
          sortOrder: 'rele',
          searchIn,
          nearWordsDistance:'5'
        }
      };

      console.log('💾 Storing results with API data:', resultsData);
      localStorage.setItem('searchResults', JSON.stringify(resultsData));
      localStorage.setItem('SearchHNominal', searchQuery);
      console.log('🚀 Navigating to results page...');
      navigate('/results');

    } catch (error) {
      console.error('❌ Keyword Search failed:', error);
      setError(error.message || 'Keyword Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    console.log('Voice search clicked');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setError('');
    localStorage.setItem('SearchHNominal', '');
  };

  return (
    <div className="gojuris-layout">
      <Sidebar />

      <div className="gojuris-main">
        <Navbar />

        <div className="ai-search-page">
          {error && (
            <div className="error-alert">
              <i className="bx bx-error-circle"></i>
              {error}
            </div>
          )}

          <div className="ai-search-container">
            {/* Header Badge */}
            <div className="search-header">
              <div className="search-badge">
                <i className="bx bx-search-alt"></i>
                <span>Nominal Search</span>
              </div>
            </div>

            {/* Main Hero Section */}
            <div className="search-hero">
              <h1 className="hero-title">
                Find exactly what you need- fast and precise with powerful Party search              </h1>

              {/* Search Type Options - Above Search Box */}
              
              {/* Search Box */}
              <div className="search-container">
                <form onSubmit={handleSearch} className="search-form">
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Nominal Search : Type any name in full or partial to find the desired case"
                      disabled={isLoading}
                    />
                    <div className="input-actions">
                      {searchQuery.length > 0 && (
                        <button
                          type="button"
                          className={`voice-btn`}
                          onClick={handleClearSearch}
                          disabled={isLoading}
                        >
                          <i style={{ fontSize: "25px" }} className="bx bx-x"></i>
                        </button>
                      )}
                     
                      <button
                        type="submit"
                        className="search-btn"
                        disabled={isLoading || !searchQuery.trim()}
                        style={{ background: '#ffffff' }}
                      >
                        {isLoading ? (
                          <i className="bx bx-loader bx-spin" style={{ color: '#8b5cf6', fontSize: '24px' }}></i>
                        ) : (
                          <img
                            src="/Images/i-search.png"
                            alt="Search"
                            className="search-icon-img"
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Search Options - Below Search Box */}
              <div className="search-options-below">
                {/* Sort Order Options */}
               
                {/* Search In Options */}
                <div className="radio-group search-in-group">
                  <span className="group-label">Search in:</span>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="searchIn"
                      value="A"
                      checked={searchIn === 'A'}
                      onChange={(e) => setSearchIn(e.target.value)}
                    />
                    <span className="radio-mark"></span>
                    Appellant
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="searchIn"
                      value="R"
                      checked={searchIn === 'R'}
                      onChange={(e) => setSearchIn(e.target.value)}
                    />
                    <span className="radio-mark"></span>
                   Respondent
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="searchIn"
                      value="B"
                      checked={searchIn === 'B'}
                      onChange={(e) => setSearchIn(e.target.value)}
                    />
                    <span className="radio-mark"></span>
                    Both
                  </label>
                </div>
              </div>
            </div>

            {/* Related Queries Section */}
            {/* <div className="related-section">
              <p className="related-title">Related Queries</p>
            </div> */}

            {/* Description Section - Simplified without legal content */}
            {/* <div className="description-section">
              <h2 className="description-title">
                Simplifying search for you
              </h2>
              <p className="description-text">
                Advanced search options to help you find exactly what you're looking for. 
                Use our flexible search types and filtering options to get precise results quickly.
              </p>
            </div> */}
          </div>
        </div>
      </div>

      <style jsx>{`
        .gojuris-layout {
          display: flex;
          min-height: 100vh;
        }

        .gojuris-main {
          flex: 1;
          margin-left: 70px;
          width: calc(100% - 70px);
          background: #f8f9fa;
          min-height: 100vh;
        }

        .ai-search-page {
          min-height: calc(100vh - 80px);
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        .ai-search-container {
          max-width: 1200px;
          width: 100%;
          margin-top:-100px;
          text-align: center;
        }

        .error-alert {
          background: #f8d7da;
          color: #721c24;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
        }

        .search-header {
          margin-bottom: 3rem;
        }

        .search-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 25px;
          color: #007bff;
          font-weight: 500;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .search-badge i {
          font-size: 16px;
        }

        .search-hero {
          margin-bottom: 4rem;
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 2rem);
          font-weight: 300;
          color: #333;
          line-height: 1.2;
          margin-bottom: 1rem;
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
        }

        .search-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .search-form {
          width: 100%;
        }

        .search-input-wrapper {
          position: relative;
          background: white;
          border-radius: 50px;
          border: 2px solid #8b5cf6;
          padding: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 1rem 1.5rem;
          font-size: 18px;
          outline: none;
          color: #333;
        }

        .search-input::placeholder {
          color: #999;
        }

        .input-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .voice-btn {
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6c757d;
          transition: all 0.2s ease;
        }

        .voice-btn:hover:not(:disabled) {
          background: #f8f9fa;
          color: #007bff;
        }

        .voice-btn.listening {
          color: #dc3545;
          animation: pulse 1.5s infinite;
        }

        .search-btn {
          width: 48px;
          height: 48px;
          border: none;
          // background: #007bff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: all 0.2s ease;
        }

        .search-btn:hover:not(:disabled) {
          // background: #0056b3;
          transform: scale(1.05);
        }

        .search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Fixed search icon image styling */
        .search-icon-img {
          width: 50px;
          height: 50px;
          object-fit: contain;
          // filter: brightness(0) invert(1);
        }

        .related-section {
          margin-bottom: 4rem;
        }

        .related-title {
          color: #6c757d;
          font-size: 1rem;
          margin: 0;
        }

        /* Fixed description section styling */
        .description-section {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .description-title {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .description-text {
          font-size: 16px;
          color: #6c757d;
          margin: 0;
          line-height: 1.5;
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

        /* Radio button options styling */
        .search-options-above,
        .search-options-below {
          margin: 1rem 0;
        }

        .radio-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          align-items: center;
          margin: 0.5rem 0;
        }

        .search-in-group {
          border-top: 1px solid #e5e7eb;
          padding-top: 1rem;
          margin-top: 1rem;
        }

        .group-label {
          font-weight: 600;
          color: #374151;
          margin-right: 1rem;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: #374151;
          user-select: none;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s ease;
        }

        .radio-label:hover {
          background-color: #f9fafb;
        }

        .radio-label input[type="radio"] {
          width: 18px;
          height: 18px;
          margin: 0;
          opacity: 0;
          position: absolute;
          z-index: -1;
        }

        .radio-mark {
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          background: white;
          transition: all 0.2s ease;
          position: relative;
          display: inline-block;
          flex-shrink: 0;
        }

        .radio-label:hover .radio-mark {
          border-color: var(--gj-primary);
        }

        .radio-label input[type="radio"]:checked + .radio-mark {
          border-color: var(--gj-primary);
        }

        .radio-label input[type="radio"]:checked + .radio-mark::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: var(--gj-primary);
          border-radius: 50%;
          top: 3px;
          left: 3px;
        }

        .radio-label input[type="radio"]:focus + .radio-mark {
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .near-words-input {
          width: 50px;
          padding: 0.25rem 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          text-align: center;
          margin: 0 0.25rem;
        }

        .near-words-input:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
        }

        .near-words-input:focus {
          outline: none;
          border-color: var(--gj-primary);
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .ai-search-page {
            padding: 1rem 0.5rem;
          }

          .search-header {
            margin-bottom: 2rem;
          }

          .search-hero {
            margin-bottom: 3rem;
          }

          .hero-title {
            margin-bottom: 2rem;
          }

          .search-input-wrapper {
            padding: 6px;
          }

          .search-input {
            padding: 0.75rem 1rem;
            font-size: 14px;
          }

          .search-btn {
            width: 44px;
            height: 44px;
          }

          .voice-btn {
            width: 36px;
            height: 36px;
          }

          .related-section {
            margin-bottom: 3rem;
          }

          .search-icon-img {
            width: 18px;
            height: 18px;
          }

          .radio-group {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .group-label {
            margin-right: 0;
            margin-bottom: 0.5rem;
          }
        }

        @media (max-width: 575.98px) {
          .gojuris-main {
            margin-left: 60px;
            width: calc(100% - 60px);
          }

          .ai-search-page {
            padding: 1rem 0.25rem;
          }

          .search-container {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Nominal;