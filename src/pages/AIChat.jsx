// src/pages/AIChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ApiService from '../services/apiService';

const AIChat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    document.body.style.paddingTop = '0';
    loadUserProfile();
    
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const loadUserProfile = async () => {
    try {
      const profile = await ApiService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('❌ Failed to load user profile:', error);
    }
  };

  const quickQuestions = [
    "Whether the parliament has the right to change fundamental rights?",
    "Maneka Gandhi Case", 
    "Give me a sample Lease Agreement in Hindi",
    "I want details on section 156(3) CPC"
  ];

  // Handle message sending - ONLY API responses
  // src/pages/AIChat.jsx - Updated handleSendMessage function
// src/pages/AIChat.jsx - DEBUGGING VERSION
// src/pages/AIChat.jsx - USING SIMPLIFIED AI CHAT SEARCH
const handleSendMessage = async (e) => {
  e.preventDefault();
  
  if (!message.trim() || isLoading) return;

  const userMessage = message;
  setMessage('');
  setIsLoading(true);
  setError('');

  // Add user message to chat
  setChatHistory(prev => [...prev, { 
    type: 'user', 
    text: userMessage,
    timestamp: new Date().toLocaleTimeString()
  }]);

  try {
    // Step 1: Generate AI Embedding
    console.log('🧠 Generating AI embedding for:', userMessage);
    const embeddingData = await ApiService.generateEmbedding(userMessage);
    
    if (!embeddingData) {
      throw new Error('Failed to generate embedding');
    }

    const embeddingVector = embeddingData.embedding || embeddingData.vector || embeddingData.data;
    
    if (!Array.isArray(embeddingVector)) {
      throw new Error('Invalid embedding format received');
    }

    console.log(`✅ Embedding generated: ${embeddingVector.length} dimensions`);

    // Step 2: AI Chat Search with SIMPLIFIED payload
    try {
      console.log('💬 Starting AI Chat Search...');
      
      const searchResults = await ApiService.searchJudgementsWithAI(userMessage, embeddingVector, {
        searchType: 'chat',  // ✅ This triggers simplified payload
        pageSize: 5,
        page: 0,
        sortBy: "relevance",
        sortOrder: "desc",
        prompt: "Find relevant legal cases"
      });

      console.log('📋 AI Chat Search Results:', searchResults);
      
      // Process results
      let aiResponse = processSearchResults(searchResults, userMessage);
      
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        text: aiResponse,
        metadata: {
          embeddingGenerated: true,
          vectorLength: embeddingVector.length,
          resultsFound: searchResults?.results?.length || 0,
          isApiResponse: true,
          searchType: 'AI Chat (Simplified)',
          searchQuery: userMessage
        },
        timestamp: new Date().toLocaleTimeString()
      }]);

    } catch (aiSearchError) {
      console.warn('⚠️ AI Chat Search failed, trying regular search:', aiSearchError);
      
      // Fallback to regular search (also simplified)
      try {
        console.log('🔄 Falling back to regular search...');
        
        const regularSearchResults = await ApiService.searchJudgements_Chat(userMessage, {
          pageSize: 5,
          page: 1,
          sortBy: "relevance"
        });

        let fallbackResponse = processSearchResults(regularSearchResults, userMessage);
        fallbackResponse = `Based on keyword search:\n\n${fallbackResponse}`;
        
        setChatHistory(prev => [...prev, { 
          type: 'ai', 
          text: fallbackResponse,
          metadata: {
            resultsFound: regularSearchResults?.results?.length || 0,
            isApiResponse: true,
            searchType: 'Regular Search (Fallback)',
            searchQuery: userMessage
          },
          timestamp: new Date().toLocaleTimeString()
        }]);

      } catch (regularSearchError) {
        console.error('❌ Both searches failed:', regularSearchError);
        
        setChatHistory(prev => [...prev, { 
          type: 'ai', 
          text: `I'm experiencing technical difficulties right now. Please try with a simpler question or try again in a few minutes.`,
          isError: true,
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    }

  } catch (generalError) {
    console.error('❌ General Error:', generalError);
    
    setChatHistory(prev => [...prev, { 
      type: 'ai', 
      text: `I encountered an error: ${generalError.message}. Please try again.`,
      isError: true,
      timestamp: new Date().toLocaleTimeString()
    }]);
  } finally {
    setIsLoading(false);
  }
};

// Helper function to process search results
const processSearchResults = (searchResults, userMessage) => {
  if (!searchResults) {
    return 'No response received from the legal database.';
  }

  // Check for direct response
  if (searchResults.response && typeof searchResults.response === 'string') {
    return searchResults.response;
  }
  
  if (searchResults.message && typeof searchResults.message === 'string') {
    return searchResults.message;
  }

  if (searchResults.summary && typeof searchResults.summary === 'string') {
    return searchResults.summary;
  }

  // Check for results array
  if (searchResults.results && Array.isArray(searchResults.results)) {
    const results = searchResults.results;
    if (results.length > 0) {
      return formatSearchResults(results, userMessage);
    } else {
      return `I searched for "${userMessage}" but couldn't find specific matching legal cases. Could you try with more specific legal terms or case names?`;
    }
  }

  // Fallback - show raw response for debugging
  return `I received a response but couldn't parse it properly. Please try rephrasing your question.\n\nDebug info: ${JSON.stringify(searchResults, null, 2).substring(0, 500)}...`;
};

  // Format search results if API returns raw data
  const formatSearchResults = (results, query) => {
    if (!Array.isArray(results) || results.length === 0) {
      return 'No legal cases found for your query.';
    }

    let formatted = `Found ${results.length} legal cases for "${query}":\n\n`;
    
    results.slice(0, 5).forEach((result, index) => {
      formatted += `${index + 1}. `;
      
      if (result.title || result.caseName || result.judgementTitle) {
        formatted += `${result.title || result.caseName || result.judgementTitle}\n`;
      }
      
      if (result.court) {
        formatted += `   Court: ${result.court}\n`;
      }
      
      if (result.date || result.year) {
        formatted += `   Date: ${result.date || result.year}\n`;
      }
      
      if (result.summary || result.content || result.headnote) {
        const summary = result.summary || result.content || result.headnote;
        formatted += `   Summary: ${summary.substring(0, 200)}...\n`;
      }
      
      formatted += '\n';
    });

    if (results.length > 5) {
      formatted += `... and ${results.length - 5} more cases found.\n`;
    }

    return formatted;
  };

  const handleQuickQuestion = (question) => {
    setMessage(question);
  };

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    console.log('Voice search clicked');
  };

  const handleSignOut = () => {
    ApiService.clearTokensAndRedirect();
  };

  return (
    <div className="ai-chat-layout-with-nav">
      <Sidebar />
      
      {/* Chat Sidebar */}
      <div className="ai-chat-sidebar">
        <div className="sidebar-header">
          <div className="gojuris-logo">
            <img 
              src="/logo.png" 
              alt="GoJuris Logo" 
              style={{ height: '64px', width: 'auto' }}
            />
          </div>
        </div>
        
        <div className="sidebar-content">
          <div className="sidebar-section">
            
            <button className="new-chat-btn" onClick={() => setChatHistory([])}>
              <i className="bx bx-plus"></i>
              New Chat
            </button>
          </div>
          
          <div className="sidebar-section">
            <div className="section-title">History</div>
            <div className="history-placeholder">
              <i className="bx bx-history"></i>
              <span>No previous chats</span>
            </div>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div className="sidebar-item">
            <i className="bx bx-cog"></i>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="ai-chat-main">
        <div className="chat-header">
          <div className="chat-title">
            <span>Welcome, </span>
            <span className="username">
              {userProfile?.username || userProfile?.name || userProfile?.email || 'Legal Expert'}
            </span>
            <span> — Your AI Assistant For Legal Research.</span>
          </div>

          {/* Account Dropdown */}
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary btn-sm rounded-circle p-2"
              type="button"
              onClick={() => setShowSettingsModal(true)}
              style={{ width: '40px', height: '40px' }}
            >
              <i className="bx bx-cog"></i>
            </button>

            <div className="dropdown">
              <button
                className="btn btn-primary d-flex align-items-center gap-2 px-3"
                type="button"
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              >
                <i className="bx bx-user"></i>
                <span>My Account</span>
                <i className="bx bx-chevron-down"></i>
              </button>
              
              {showAccountDropdown && (
                <div className="dropdown-menu dropdown-menu-end show" style={{ minWidth: '220px' }}>
                  <div className="dropdown-header">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                           style={{ width: '32px', height: '32px' }}>
                        <i className="bx bx-user text-white"></i>
                      </div>
                      <div>
                        <div className="fw-semibold">
                          {userProfile?.username || userProfile?.name || 'Legal User'}
                        </div>
                        <small className="text-muted">
                          {userProfile?.email || 'user@gojuris.com'}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  <a className="dropdown-item" href="#">
                    <i className="bx bx-user-circle me-2"></i>View Profile
                  </a>
                  <a className="dropdown-item" href="#">
                    <i className="bx bx-credit-card me-2"></i>Billing & Plans
                  </a>
                  <a className="dropdown-item" href="#">
                    <i className="bx bx-history me-2"></i>Search History
                  </a>
                  <div className="dropdown-divider"></div>
                  
                  <button className="dropdown-item text-danger" onClick={handleSignOut}>
                    <i className="bx bx-log-out me-2"></i>Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="chat-content">
  <div className="chat-messages">
    {chatHistory.length === 0 ? (
     <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    padding: "16px",
  }}
>
  <button 
    style={{ 
      flex: "1 1 auto", 
      minWidth: "150px", 
      padding: "10px 15px",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      justifyContent: "center",
      background: "linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)",
      color: "white",
      border: "none",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease"
    }}
    onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
    onMouseLeave={(e) => e.target.style.transform = "translateY(0px)"}
  >
    <i className="bx bx-chat" style={{ fontSize: "18px" }}></i>
    Ask a question
  </button>
  
  <button 
    style={{ 
      flex: "1 1 auto", 
      minWidth: "150px", 
      padding: "10px 15px",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      justifyContent: "center",
      background: "linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)",
      color: "white",
      border: "none",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease"
    }}
    onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
    onMouseLeave={(e) => e.target.style.transform = "translateY(0px)"}
  >
    <i className="bx bx-envelope" style={{ fontSize: "18px" }}></i>
    Generate a draft
  </button>
  
  <button 
    style={{ 
      flex: "1 1 auto", 
      minWidth: "150px", 
      padding: "10px 15px",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      justifyContent: "center",
      background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
      color: "white",
      border: "none",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease"
    }}
    onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
    onMouseLeave={(e) => e.target.style.transform = "translateY(0px)"}
  >
    <i className="bx bx-receipt" style={{ fontSize: "18px" }}></i>
    Summarize a case
  </button>
  
  <button 
    style={{ 
      flex: "1 1 auto", 
      minWidth: "150px", 
      padding: "10px 15px",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      justifyContent: "center",
      background: "linear-gradient(135deg, #EC4899 0%, #F97316 100%)",
      color: "white",
      border: "none",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease"
    }}
    onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
    onMouseLeave={(e) => e.target.style.transform = "translateY(0px)"}
  >
    <i className="bx bx-upload" style={{ fontSize: "18px" }}></i>
    Upload to summarize or ask questions
  </button>
</div>
   


            ) : (
              <div className="message-list">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`message ${msg.type} ${msg.isError ? 'error' : ''}`}>
                    <div className="message-avatar">
                      <i className={`bx ${msg.type === 'user' ? 'bx-user' : 'bx-bot'}`}></i>
                    </div>
                    <div className="message-content">
                     {msg.type === 'ai' && msg.metadata?.isApiResponse ? (
  <div 
    className="api-response-content"
    dangerouslySetInnerHTML={{ 
      __html: msg.text
        .replace(/<p>/g, '<p style="margin: 0.8em 0; line-height: 1.6;">')
        .replace(/<strong>/g, '<strong style="color: #2c3e50; font-weight: 600;">')
        .replace(/<ul>/g, '<ul style="margin: 0.5em 0; padding-left: 1.5em;">')
        .replace(/<li>/g, '<li style="margin: 0.4em 0; line-height: 1.5;">')
        .replace(/<a/g, '<a style="color: #3498db; text-decoration: none; font-weight: 500;"')
        .replace(/<\/a>/g, '</a>')
        .replace(/<em>/g, '<em style="font-style: italic; color: #666;">')
        .replace(/<\/ul><p>/g, '</ul><p style="margin-top: 1.2em;">')
    }} 
  />
) : (
  <pre style={{ 
    whiteSpace: 'pre-wrap', 
    wordWrap: 'break-word',
    fontFamily: 'inherit',
    margin: 0
  }}>
    {msg.text}
  </pre>
)}
                      {msg.metadata && msg.metadata.isApiResponse && (
                        <small className="text-muted d-block mt-2">
                          ✅ API Response 
                          {msg.metadata.embeddingGenerated && ` • Embedding: ${msg.metadata.vectorLength} dimensions`}
                          {msg.metadata.resultsFound > 0 && ` • Results: ${msg.metadata.resultsFound}`}
                        </small>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* API Loading Indicator */}
                {isLoading && (
                  <div className="message ai">
                    <div className="message-avatar">
                      <i className="bx bx-bot"></i>
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <small className="text-muted">Processing with AI APIs...</small>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Quick Questions */}
          {chatHistory.length === 0 && (
            <div className="quick-questions-single-line">
              <div className="quick-questions-scroll">
                {quickQuestions.map((question, index) => (
                  <button 
                    key={index}
                    className="quick-question-btn-inline"
                    onClick={() => handleQuickQuestion(question)}
                    disabled={isLoading}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* API Error Display */}
          {error && (
            <div className="alert alert-danger mx-3" role="alert">
              <i className="bx bx-error-circle me-2"></i>
              <strong>API Error:</strong> {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError('')}
              ></button>
            </div>
          )}
        </div>
        
        <div className="chat-input-section">
          <form onSubmit={handleSendMessage} className="chat-form">
            <div className="chat-input-wrapper">
              <input
                type="text"
                className="chat-input"
                width={"100vw"}
                placeholder="Ask your legal question here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
              />
              <div className="input-buttons">
                <button 
                  type="button" 
                  className={`voice-btn ${isListening ? 'listening' : ''}`}
                  onClick={handleVoiceSearch}
                  disabled={isLoading}
                  title="Voice input"
                >
                  <i className="bx bx-microphone"></i>
                </button>
                <button 
                  type="submit" 
                  className="send-btn"
                  disabled={isLoading || !message.trim()}
                >
                  <i className="bx bx-send"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h4 className="modal-title mb-0">Settings</h4>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowSettingsModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center py-5">
                <i className="bx bx-time-five text-muted" style={{ fontSize: '4rem' }}></i>
                <h3 className="text-muted mb-3">Coming Soon</h3>
                <p className="text-muted">Advanced settings will be available soon.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside handlers */}
      {showAccountDropdown && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 1 }}
          onClick={() => setShowAccountDropdown(false)}
        ></div>
      )}

      {/* Component Styles */}
      <style jsx>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-indicator span {
          height: 8px;
          width: 8px;
          background-color: #8B5CF6;
          border-radius: 50%;
          display: inline-block;
          animation: typing 1.4s ease-in-out infinite;
        }

        .typing-indicator span:nth-child(1) { animation-delay: 0s; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .message.error .message-content {
          background-color: #fee2e2;
          border-left: 3px solid #ef4444;
          color: #b91c1c;
        }

        .quick-questions-single-line {
          margin-bottom: 2rem;
          padding: 0 1rem;
        }

        .quick-questions-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 8px 0;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .quick-questions-scroll::-webkit-scrollbar {
          display: none;
        }

        .quick-question-btn-inline {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          padding: 8px 16px;
          white-space: nowrap;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .quick-question-btn-inline:hover:not(:disabled) {
          border-color: #8B5CF6;
          color: #8B5CF6;
          background: #F8FAFC;
        }

        .quick-question-btn-inline:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .chat-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .chat-input {
          flex: 1;
          padding-right: 80px;
          border: 1px solid #8b5cf6;
          border-radius: 25px;
          padding: 12px 20px;
          font-size: 14px;
          outline: none;
        }

        .chat-input:focus {
          border-color: #8B5CF6;
        }

        .input-buttons {
          position: absolute;
          right: 8px;
          bottom:4px;
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .voice-btn, .send-btn {
          background: none;
          border: none;
          padding: 6px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
        }

        .voice-btn {
          color: #6B7280;
        }

        .voice-btn:hover:not(:disabled) {
          background-color: #F3F4F6;
          color: #8B5CF6;
        }

        .voice-btn.listening {
          color: #EF4444;
          animation: pulse 1.5s infinite;
        }

        .send-btn {
          background: #8B5CF6;
          color: white;
        }

        .send-btn:hover:not(:disabled) {
          background: #7C3AED;
        }

        .send-btn:disabled, .voice-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .alert .btn-close {
          padding: 0.25rem;
          font-size: 0.875rem;
        }

        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: inherit;
          margin: 0;
        }
          .api-response-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.api-response-content p:first-child {
  margin-top: 0;
}

.api-response-content p:last-child {
  margin-bottom: 0;
}

.api-response-content a:hover {
  border-bottom: 1px solid #3498db;
}

.api-response-content ul ul {
  margin: 0.3em 0;
  padding-left: 1.2em;
}
      `}</style>
    </div>
  );
};

export default AIChat;