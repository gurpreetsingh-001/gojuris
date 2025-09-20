// src/pages/AISearch.jsx - Complete code with correct design and full functionality
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ApiService from '../services/apiService';

const AISearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    document.body.style.paddingTop = '0';
    
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
      console.log('🤖 Starting AI Search process...');
      console.log('Query:', searchQuery);

      // Step 1: Generate embedding
      const embeddingData = await ApiService.generateEmbedding(searchQuery);
      console.log('✅ Embedding generated');
      
      const embeddingVector = embeddingData.embedding || embeddingData.vector || embeddingData.data || embeddingData;
      
      if (!embeddingVector || !Array.isArray(embeddingVector)) {
        throw new Error('Invalid embedding response from API');
      }

      console.log(`✅ Embedding vector length: ${embeddingVector.length}`);

      // Step 2: AI Search
      const apiResponse = await ApiService.searchJudgementsWithAI_ForSearch(searchQuery, embeddingVector, {
        pageSize: 25,
        page: 1,
        sortBy: "relevance",
        sortOrder: "desc"
      });

      console.log('✅ AI Search API Response:', apiResponse);

      // Handle the exact API structure: { total: number, hits: array }
      const searchResults = apiResponse.hits || [];
      const totalCount = apiResponse.total || 0;

      console.log(`📊 Processing ${searchResults.length} results from total ${totalCount}`);

      if (searchResults.length === 0) {
        setError('No results found for your search query. Try different keywords.');
        setIsLoading(false);
        return;
      }

      // Store results in sessionStorage with embedding vector for pagination
      const resultsData = {
        query: searchQuery,
        results: searchResults,
        totalCount: totalCount,
        searchType: 'AI Search',
        embeddingVector: embeddingVector, // Store embedding for pagination API calls
        timestamp: new Date().toISOString(),
        originalApiResponse: {
          total: apiResponse.total,
          hits: apiResponse.hits
        }
      };

      console.log('💾 Storing results in sessionStorage');
      sessionStorage.setItem('searchResults', JSON.stringify(resultsData));

      // Navigate to Results page
      console.log('🚀 Navigating to results page...');
      navigate('/results');

    } catch (error) {
      console.error('❌ AI Search failed:', error);
      setError(error.message || 'AI Search failed. Please try again.');
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
  };

  const handleExampleSearch = (exampleQuery) => {
    setSearchQuery(exampleQuery);
    setError('');
  };

  return (
    <div className="gojuris-layout">
      <Sidebar />
      
      <div className="gojuris-main">
        <Navbar />

        <div className="ai-search-content-with-sidebar">
          {error && (
            <div className="alert alert-danger mx-3" role="alert">
              <i className="bx bx-error-circle me-2"></i>
              {error}
            </div>
          )}
          
          <div className="search-header">
            <div className="search-badge">
              <i className="bx bx-search-alt"></i>
              <span>AI Searches</span>
            </div>
          </div>
          
          <div className="search-hero">
            <h1 className="search-main-title">
              Decode patterns, context, and legal logic—instantly.
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
                    disabled={isLoading}
                  />
                  <div className="search-buttons">
                    <button 
                      type="button" 
                      className={`voice-search-btn ${isListening ? 'active' : ''}`}
                      onClick={handleVoiceSearch}
                      disabled={isLoading}
                      title="Voice search"
                    >
                      <i className="bx bx-microphone"></i>
                    </button>
                    
                    {searchQuery && !isLoading && (
                      <button 
                        type="button" 
                        className="clear-search-btn"
                        onClick={handleClearSearch}
                        title="Clear search"
                      >
                        <i className="bx bx-x"></i>
                      </button>
                    )}
                    
                    <button 
                      type="submit" 
                      className="search-submit"
                      disabled={isLoading || !searchQuery.trim()}
                    >
                      {isLoading ? (
                        <i className="bx bx-loader bx-spin"></i>
                      ) : (
                          <img 
                    src='/i-ai-search-03.png' 
                   
                    style={{
                      width: '54px', 
                      height: '54px',
                      objectFit: 'contain',
                      filter: 'brightness(0) invert(1)' // Makes image white to match the design
                    }}
              />
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="search-info">
              <p className="searches-text">
                {isLoading ? 'Searching legal database...' : ''}
              </p>
              {!isLoading && (
                <p className="searches-text" style={{ color: 'var(--gj-primary)', marginTop: '0.5rem' }}>
                  Related Queries
                </p>
              )}
            </div>
          </div>
          
          <div className="dashboard-footer">
            <p className="footer-text">Making legal search easy for you or Simplyfying legal search for you</p>
            <p className="footer-includes">
              Tailored for legal professionals, our advanced search options simplifies legal research. 
              Effortlessly access judgments, statutes, and citations saving time and enhancing your workflow efficiency.
            </p>
            <p className="footer-includes">
              <strong>Includes:</strong> Case Law | Codes, Rules & Constitutions | Practical Guidance | Treatises
            </p>
          </div>
        </div>
      </div>
  
      <style jsx>{`
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff40;
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .search-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .ai-search-input {
          flex: 1;
          padding-right: 100px;
        }

        .ai-search-input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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

        .voice-search-btn:hover:not(:disabled) {
          background-color: #F3F4F6;
          color: #8B5CF6;
        }

        .voice-search-btn.listening {
          color: #EF4444;
          animation: pulse 1.5s infinite;
        }

        .voice-search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .clear-search-btn {
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

        .clear-search-btn:hover:not(:disabled) {
          background-color: #F3F4F6;
          color: #EF4444;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
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

        .search-submit:hover:not(:disabled) {
          background: #7C3AED;
        }

        .search-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default AISearch;