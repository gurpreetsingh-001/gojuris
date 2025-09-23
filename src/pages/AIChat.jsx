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

  // Create placeholder for AI response
  const aiMessageIndex = Date.now();
  setChatHistory(prev => [...prev, { 
    type: 'ai', 
    text: '',
    isStreaming: true,
    id: aiMessageIndex,
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

    let streamedText = '';
    let hasError = false;

    // Step 2: Start AI Chat Stream
    await ApiService.streamAIChat(
      userMessage, 
      embeddingVector,
      {
        searchType: 'chat',
        pageSize: 10,
        page: 0,
        sortBy: "relevance",
        sortOrder: "desc",
        prompt: "Find relevant legal cases"
      },
      // ✅ FIXED onMessage callback with proper spacing
      (chunkText) => {
        console.log('📥 Stream chunk received:', chunkText);
        
        if (chunkText) {
          // ✅ CRITICAL FIX: Handle spacing between chunks properly
          if (streamedText.length > 0) {
            // Add space if the previous text doesn't end with whitespace 
            // and the new chunk doesn't start with whitespace or punctuation
            const lastChar = streamedText.slice(-1);
            const firstChar = chunkText.charAt(0);
            
            if (!lastChar.match(/\s/) && !firstChar.match(/[\s\.,;:!?\n\r]/)) {
              streamedText += ' ';
            }
          }
          
          streamedText += chunkText;

          // Update the AI message in real-time with formatted text
          setChatHistory(prev => prev.map(msg => 
            msg.id === aiMessageIndex 
              ? { 
                  ...msg, 
                  text: formatStreamedText(streamedText), 
                  isStreaming: true 
                }
              : msg
          ));
        }
      },
      // onError callback
      (error) => {
        console.error('❌ Stream error:', error);
        hasError = true;
        setChatHistory(prev => prev.map(msg => 
          msg.id === aiMessageIndex 
            ? { 
                ...msg, 
                text: streamedText || 'Sorry, I encountered an error while processing your request.',
                isStreaming: false,
                isError: true
              }
            : msg
        ));
      },
      // onComplete callback
      () => {
        console.log('✅ Stream completed');
        console.log('📝 Final text:', streamedText);
        if (!hasError) {
          setChatHistory(prev => prev.map(msg => 
            msg.id === aiMessageIndex 
              ? { 
                  ...msg, 
                  text: formatStreamedText(streamedText) || 'No response received.',
                  isStreaming: false,
                  metadata: {
                    embeddingGenerated: true,
                    vectorLength: embeddingVector.length,
                    isApiResponse: true,
                    searchType: 'AI Chat (Streaming)',
                    searchQuery: userMessage
                  }
                }
              : msg
          ));
        }
      }
    );

  } catch (generalError) {
    console.error('❌ General Error:', generalError);
    
    setChatHistory(prev => prev.map(msg => 
      msg.id === aiMessageIndex 
        ? { 
            ...msg, 
            text: `I encountered an error: ${generalError.message}. Please try again.`,
            isStreaming: false,
            isError: true
          }
        : msg
    ));
  } finally {
    setIsLoading(false);
  }
};

// ✅ IMPROVED: Better text formatting function
const formatStreamedText = (text) => {
  if (!text) return '';
  
  return text
    // Convert markdown to HTML
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Bold text
    .replace(/\*([^*]+)\*/g, '<em>$1</em>') // Italic text
    
    // Handle sections and headers
    .replace(/^(.*?:)\s*$/gm, '<h4 style="margin: 1em 0 0.5em 0; color: #333; font-weight: 600;">$1</h4>') // Headers ending with colon
    
    // Handle line breaks and paragraphs
    .replace(/\n\s*\n/g, '</p><p style="margin: 0.8em 0;">') // Double line breaks = paragraphs
    .replace(/\n/g, '<br>') // Single line breaks
    
    // Handle lists
    .replace(/^\s*[-*+]\s+(.+)$/gm, '<li style="margin: 0.3em 0;">$1</li>') // Bullet points
    .replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li style="margin: 0.3em 0;">$1. $2</li>') // Numbered lists
    
    // Handle citations and links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #3498db; text-decoration: none;">$1</a>') // Markdown links
    
    // Wrap in paragraph if not already wrapped
    .replace(/^(?!<[h4|p|li])(.)/s, '<p style="margin: 0.8em 0;">$1')
    .replace(/(.)(?![h4|p|li]>)$/s, '$1</p>')
    
    // Clean up
    .replace(/<\/p><p[^>]*><br>/g, '</p><p style="margin: 0.8em 0;">')
    .replace(/<br><\/p>/g, '</p>');
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
                  Ask a question to find cases
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
                  Generate a Draft
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
                  Summarize a Case
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
                  Upload to summarize
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
  {msg.type === 'ai' && (msg.metadata?.isApiResponse || msg.isStreaming) ? (
    <div 
      className="api-response-content"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#333'
      }}
      dangerouslySetInnerHTML={{ __html: msg.text }} 
    />
  ) : (
    <pre style={{ 
      whiteSpace: 'pre-wrap', 
      wordWrap: 'break-word',
      fontFamily: 'inherit',
      margin: 0,
      lineHeight: '1.6'
    }}>
      {msg.text}
    </pre>
  )}
  
  {/* Show typing indicator for streaming messages */}
  {msg.isStreaming && (
    <div className="typing-indicator" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      marginTop: '8px',
      color: '#8B5CF6'
    }}>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
    </div>
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
  .typing-indicator {
    display: inline-flex;
    align-items: center;
  }
  
  .typing-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #8B5CF6;
    animation: typing 1.4s infinite ease-in-out;
    animation-fill-mode: both;
  }
  
  .typing-dot:nth-child(1) { animation-delay: -0.32s; }
  .typing-dot:nth-child(2) { animation-delay: -0.16s; }
  .typing-dot:nth-child(3) { animation-delay: 0s; }
  
  @keyframes typing {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.6;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
      `}</style>
    </div>
  );
};

export default AIChat;