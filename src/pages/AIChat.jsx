// src/pages/AIChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';

const AIChat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // API Base URL
  const API_BASE_URL = 'http://108.60.219.166:8001';

  useEffect(() => {
    document.body.style.paddingTop = '0';
    
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const quickQuestions = [
    "Whether the parliament has the right to change fundamental rights?",
    "Maneka Gandhi Case", 
    "Give me a sample Lease Agreement in Hindi",
    "I want details on section 156(3) CPC"
  ];

  // Function to get access token
  const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };

  // Function to refresh token if needed
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('expiresAt', data.expiresAt);
        return data.accessToken;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      // Redirect to login if refresh fails
      localStorage.clear();
      window.location.href = '/login';
      throw error;
    }
  };

  // Function to call AI Embedding API
  const generateEmbedding = async (messageText, retryCount = 0) => {
    let accessToken = getAccessToken();
    
    if (!accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/AI/Embedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ message: messageText })
      });

      if (response.status === 401 && retryCount === 0) {
        // Token expired, try to refresh
        accessToken = await refreshAccessToken();
        return generateEmbedding(messageText, 1); // Retry once
      }

      if (response.ok) {
        const data = await response.json();
        console.log('Embedding response:', data); // For debugging
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.message || 'Failed to generate embedding' 
        };
      }
    } catch (error) {
      console.error('Embedding API error:', error);
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    }
  };

  // Function to simulate AI response (you can replace this with actual judgement search)
  const generateAIResponse = async (embeddingData, userMessage) => {
    // This is a placeholder - you would call /Judgement/SearchWithAI here
    // For now, we'll simulate a response
    return new Promise((resolve) => {
      setTimeout(() => {
        const embeddingInfo = embeddingData ? 
          `[Embedding generated successfully - Vector length: ${Array.isArray(embeddingData) ? embeddingData.length : 'Unknown'}]` :
          '[Embedding processing completed]';

        resolve(`Based on your query "${userMessage}", I've analyzed the legal database using AI embeddings. Here's what I found:

This appears to be a legal query related to Indian law. I've processed your request through our AI system and generated relevant insights based on case law and statutes.

${embeddingInfo}

**Key Legal Points:**
- Constitutional law and fundamental rights
- Parliamentary powers and limitations  
- Judicial precedents and interpretations
- Relevant case law and statutory provisions

**Next Steps:**
You can ask follow-up questions for more specific information about:
- Specific case citations
- Statutory references
- Legal procedures
- Document drafting assistance

Would you like me to search for more specific information or help you with a related legal question?`);
      }, 2000);
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const currentMessage = message.trim();
    setMessage('');
    setError('');
    setIsLoading(true);

    // Add user message to chat
    setChatHistory(prev => [...prev, { 
      type: 'user', 
      text: currentMessage,
      timestamp: new Date().toISOString()
    }]);

    try {
      // Step 1: Generate embedding
      console.log('Generating embedding for:', currentMessage);
      const embeddingResult = await generateEmbedding(currentMessage);
      
      if (!embeddingResult.success) {
        throw new Error(embeddingResult.error);
      }

      console.log('Embedding generated successfully');

      // Step 2: Generate AI response (this would use the embedding for search)
      const aiResponse = await generateAIResponse(embeddingResult.data, currentMessage);

      // Add AI response to chat
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        text: aiResponse,
        timestamp: new Date().toISOString()
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      setError(error.message);
      
      // Add error message to chat
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        text: `Sorry, I encountered an error while processing your request: ${error.message}. Please try again.`,
        isError: true,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    if (!isLoading) {
      setMessage(question);
    }
  };

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // Add voice search functionality here if needed
    console.log('Voice search clicked');
  };

  const handleNewChat = () => {
    setChatHistory([]);
    setMessage('');
    setError('');
  };

  return (
    <div className="ai-chat-layout-with-nav">
      <Sidebar />
      
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
            <div className="sidebar-item active">
              <i className="bx bx-chat"></i>
              <span>AI Chat</span>
            </div>
            <button className="new-chat-btn" onClick={handleNewChat}>
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

      <div className="ai-chat-main">
        <div className="chat-header">
          <div className="chat-title">
            <span>Welcome, </span>
            <span className="username">Legal Professional</span>
            <span> — Your AI Assistant For Legal Research.</span>
          </div>

          {/* Right side buttons */}
          <div className="d-flex align-items-center gap-2">
            {/* Settings Button */}
            <button
              className="btn btn-outline-secondary btn-sm rounded-circle p-2"
              type="button"
              onClick={() => setShowSettingsModal(true)}
              style={{ width: '40px', height: '40px' }}
            >
              <i className="bx bx-cog"></i>
            </button>

            {/* My Account Dropdown */}
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
                        <div className="fw-semibold">Legal User</div>
                        <small className="text-muted">{localStorage.getItem('userEmail') || 'user@example.com'}</small>
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
                  <a className="dropdown-item" href="#">
                    <i className="bx bx-bookmark me-2"></i>Saved Searches
                  </a>
                  <a className="dropdown-item" href="#">
                    <i className="bx bx-download me-2"></i>Downloads
                  </a>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-item text-danger" 
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = '/login';
                    }}
                  >
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
              <div className="welcome-message">
                <div className="ai-avatar">
                  <i className="bx bx-bot"></i>
                </div>
                <div className="welcome-text">
                  <h3>Hello! I'm your AI Legal Assistant</h3>
                  <p>I'm here to help you with legal research, case analysis, and document drafting. Ask me anything about Indian law!</p>
                </div>
              </div>
            ) : (
              <div className="message-list">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`message ${msg.type}`}>
                    <div className="message-avatar">
                      <i className={`bx ${msg.type === 'user' ? 'bx-user' : 'bx-bot'}`}></i>
                    </div>
                    <div className={`message-content ${msg.isError ? 'error-message' : ''}`}>
                      <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message ai">
                    <div className="message-avatar">
                      <i className="bx bx-bot"></i>
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                      <div>Analyzing your query and searching legal database...</div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Quick questions */}
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
        </div>
        
        <div className="chat-input-section">
          <form onSubmit={handleSendMessage} className="chat-form">
            <div className="chat-input-wrapper">
              <input
                type="text"
                className="chat-input"
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
                  title="Voice input"
                  disabled={isLoading}
                >
                  <i className="bx bx-microphone"></i>
                </button>
                <button 
                  type="submit" 
                  className="send-btn"
                  disabled={isLoading || !message.trim()}
                >
                  {isLoading ? (
                    <i className="bx bx-loader-alt bx-spin"></i>
                  ) : (
                    <i className="bx bx-send"></i>
                  )}
                </button>
              </div>
            </div>
          </form>
          
          {error && (
            <div className="alert alert-danger mt-2 mb-0" role="alert">
              <small><i className="bx bx-error-circle me-1"></i>{error}</small>
            </div>
          )}
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
                <p className="text-muted">Settings will be available soon.</p>
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

      <style jsx>{`
        /* AI Chat Specific Styles */
.error-message {
  background-color: #fee !important;
  border-left: 3px solid #dc3545 !important;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #8B5CF6;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) { 
  animation-delay: -0.32s; 
}

.typing-dot:nth-child(2) { 
  animation-delay: -0.16s; 
}

@keyframes typing {
  0%, 80%, 100% { 
    transform: scale(0); 
    opacity: 0.5; 
  }
  40% { 
    transform: scale(1); 
    opacity: 1; 
  }
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

.ai-chat-layout-with-nav .chat-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.ai-chat-layout-with-nav .chat-input {
  flex: 1;
  padding-right: 80px;
  border: 1px solid #E5E7EB;
  border-radius: 25px;
  padding: 12px 20px;
  font-size: 14px;
  outline: none;
}

.ai-chat-layout-with-nav .chat-input:focus {
  border-color: #8B5CF6;
}

.ai-chat-layout-with-nav .input-buttons {
  position: absolute;
  right: 8px;
  display: flex;
  gap: 4px;
  align-items: center;
}

.ai-chat-layout-with-nav .voice-btn, 
.ai-chat-layout-with-nav .send-btn {
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

.ai-chat-layout-with-nav .voice-btn {
  color: #6B7280;
}

.ai-chat-layout-with-nav .voice-btn:hover:not(:disabled) {
  background-color: #F3F4F6;
  color: #8B5CF6;
}

.ai-chat-layout-with-nav .voice-btn.listening {
  color: #EF4444;
  animation: pulse 1.5s infinite;
}

.ai-chat-layout-with-nav .send-btn {
  background: #8B5CF6;
  color: white;
}

.ai-chat-layout-with-nav .send-btn:hover:not(:disabled) {
  background: #7C3AED;
}

.ai-chat-layout-with-nav .send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-chat-layout-with-nav .message-list {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  padding-bottom: 1rem;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
      `}</style>
    </div>
  );
};

export default AIChat;