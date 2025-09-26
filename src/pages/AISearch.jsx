// src/pages/AISearch.jsx - With image instead of search icon
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
      const apiResponse = await ApiService.searchWithAI(searchQuery, embeddingVector, {
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
        embeddingVector: embeddingVector,
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
                <span>AI Searches</span>
              </div>
            </div>

            {/* Main Hero Section */}
            <div className="search-hero">
              <h1 className="hero-title">
                Discover patterns, context, and legal logic—faster than ever.
              </h1>

              {/* Search Box */}
              <div className="search-container">
                <form onSubmit={handleSearch} className="search-form">
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ask AI"
                      disabled={isLoading}
                    />
                    <div className="input-actions">
                      <button
                        type="button"
                        className={`voice-btn ${isListening ? 'listening' : ''}`}
                        onClick={handleVoiceSearch}
                        disabled={isLoading}
                      >
                        <i className="bx bx-microphone"></i>
                      </button>
                      <button
                        type="submit"
                        className="search-btn"
                        disabled={isLoading || !searchQuery.trim()}
                      >
                        {isLoading ? (
                          <i className="bx bx-loader bx-spin"></i>
                        ) : (
                          <img
                            src="/i-ai-search-03.png"
                            alt="Search"
                            className="search-icon-img"
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Related Queries Section */}
            <div className="related-section">
              <p className="related-title">Related Queries</p>
            </div>

            {/* Description Section */}
            <div className="description-section">
              <h2 className="description-title">
                Making legal search easy for you or Simplifying legal search for you
              </h2>
              <p className="description-text">
                Tailored for legal professionals, our advanced search options simplify legal research. Effortlessly access    <br />
                judgments, statutes, and citations, saving time and enhancing your workflow efficiency.
              </p>
              <p className="includes-text">
                <strong>Includes:</strong> Case Law | Codes, Rules & Constitutions | Practical Guidance | Treatises
              </p>
            </div>
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
          margin-bottom: 3rem;
          max-width: 800px;
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
          padding: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          border: 2px solid #8b5cf6;
          align-items: center;
          gap: 8px;
        }

        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 1rem 1.5rem;
          font-size: 16px;
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
         
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: all 0.2s ease;
        }

        .search-btn:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Image styling for search button */
        .search-icon-img {
          width: 20px;
          height: 20px;
          object-fit: contain;
         
        }

        .related-section {
          margin-bottom: 4rem;
        }

        .related-title {
          color: #6c757d;
          font-size: 1rem;
          margin: 0;
        }

        .description-section {
          max-width: 1000px;
          margin: 0 auto;
          font:14px;
          margin-top:140px;
        }

        .description-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
         
          line-height: 1.3;
        }

        .description-text {
          font-size: 10px;
          color: #6c757d;
         margin:0
        }

        .includes-text {
          color: #6c757d;
          font-size: 12px;
          margin: 0;
        }

        .includes-text strong {
          color: #333;
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

        /* Responsive Design */
        @media (max-width: 768px) {
          .ai-search-page {
            padding: 1rem 0.5rem;
          }

          .search-header {
            margin-bottom: 2rem;
            margin-top:180px;
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
          .search-icon-img {
     width: 40px;
     height: 40px;
     object-fit: contain;
     
   }
      `}</style>
    </div>
  );
};

export default AISearch;