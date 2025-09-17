// src/pages/AISearch.jsx  
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AISearch = () => {
  const [searchQuery, setSearchQuery] = useState('Ask AI');
  const [searchesRemaining, setSearchesRemaining] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // API Configuration
  const API_BASE_URL = 'http://108.60.219.166:8001'; // Replace with your actual API URL

  // Get token from localStorage
  const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };

  useEffect(() => {
    document.body.style.paddingTop = '0';
    
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  // AI Embedding API Call
  const generateEmbedding = async (userMessage) => {
    const token = getAccessToken();
    if (!token) {
      throw new Error('No access token found. Please login again.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/AI/Embedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      if (response.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return null;
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ AI Search Embedding generated:', data);
      
      // Return the embedding vector
      return data.embedding || data.vector || data.data;
      
    } catch (error) {
      console.error('❌ AI Search Embedding failed:', error);
      throw error;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim() || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      console.log('🔍 AI Search for:', searchQuery);
      
      // Generate embedding for search query
      const embeddingVector = await generateEmbedding(searchQuery);
      
      if (!embeddingVector) {
        throw new Error('Failed to generate embedding for search');
      }

      console.log('✅ Search embedding ready:', embeddingVector.slice(0, 5), '...');
      
      // Here you would call /Judgement/Search with the embedding vector
      // For now, we'll simulate the search result
      setTimeout(() => {
        console.log('🎯 Search completed with AI embedding');
        alert(`AI Search completed!\n\nQuery: "${searchQuery}"\nEmbedding generated: ${embeddingVector.length} dimensions\n\nReady for judgement search integration.`);
        setIsLoading(false);
      }, 2000);

    } catch (error) {
      console.error('❌ AI Search error:', error);
      setError(error.message || 'Search failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    console.log('Voice search clicked');
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
                    disabled={isLoading}
                  />
                  <div className="search-buttons">
                    <button 
                      type="button" 
                      className={`voice-search-btn ${isListening ? 'listening' : ''}`}
                      onClick={handleVoiceSearch}
                      disabled={isLoading}
                      title="Voice search"
                    >
                      <i className="bx bx-microphone"></i>
                    </button>
                    <button 
                      type="submit" 
                      className="search-submit"
                      disabled={isLoading || !searchQuery.trim()}
                    >
                      {isLoading ? (
                        <div className="loading-spinner"></div>
                      ) : (
                        <i className="bx bx-search"></i>
                      )}
                    </button>
                  </div>
                </div>
              </form>
              
              {searchesRemaining && (
                <div className="search-info">
                  <p className="searches-text">AI-powered semantic search ready</p>
                  <a href="#" className="upgrade-link">Related Queries</a>
                </div>
              )}
            </div>
          </div>
          
          <div className="search-description">
            <h2 className="description-title">
              Making legal search easy for you
            </h2>
            <p className="description-text">
              Tailored for legal professionals, our advanced AI search simplifies legal research. 
              Effortlessly access judgments, statutes, and citations using natural language queries.
            </p>
            <p className="includes-text">
              Includes: Case Law Codes | Rules & Constitutions | Practical Guidance | Treatises
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