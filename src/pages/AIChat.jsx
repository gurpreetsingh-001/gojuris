// src/pages/AIChat.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const AIChat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    document.body.style.paddingTop = '0';
    
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  const quickQuestions = [
    "Whether the parliament has the right to change fundamental rights?",
    "Maneka Gandhi Case", 
    "Give me a sample Lease Agreement in Hindi",
    "I want details on section 156(3) CPC"
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setChatHistory([...chatHistory, { type: 'user', text: message }]);
      const currentMessage = message;
      setMessage('');
      
      setTimeout(() => {
        setChatHistory(prev => [...prev, { 
          type: 'ai', 
          text: `Thank you for your question: "${currentMessage}". I'm processing your legal query and will provide a comprehensive response based on Indian law and relevant case precedents.`
        }]);
      }, 1000);
    }
  };

  const handleQuickQuestion = (question) => {
    setMessage(question);
  };

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    console.log('Voice search clicked');
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
            <button className="new-chat-btn">
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
            <span className="username">Ten X</span>
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
                        <div className="fw-semibold">John Doe</div>
                        <small className="text-muted">john@example.com</small>
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
                  
                  <a className="dropdown-item text-danger" href="#">
                    <i className="bx bx-log-out me-2"></i>Sign Out
                  </a>
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
                    <div className="message-content">
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Updated quick questions in single line */}
          {chatHistory.length === 0 && (
            <div className="quick-questions-single-line">
              <div className="quick-questions-scroll">
                {quickQuestions.map((question, index) => (
                  <button 
                    key={index}
                    className="quick-question-btn-inline"
                    onClick={() => handleQuickQuestion(question)}
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
              />
              <div className="input-buttons">
                <button 
                  type="button" 
                  className={`voice-btn ${isListening ? 'listening' : ''}`}
                  onClick={handleVoiceSearch}
                  title="Voice input"
                >
                  <i className="bx bx-microphone"></i>
                </button>
                <button type="submit" className="send-btn">
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

      {showSettingsModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 9998 }}
          onClick={() => setShowSettingsModal(false)}
        ></div>
      )}

      <style jsx>{`
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

        .quick-question-btn-inline:hover {
          border-color: #8B5CF6;
          color: #8B5CF6;
          background: #F8FAFC;
        }

        .chat-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .chat-input {
          flex: 1;
          padding-right: 80px;
          border: 1px solid #E5E7EB;
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
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .voice-btn {
          background: none;
          border: none;
          padding: 6px;
          border-radius: 50%;
          cursor: pointer;
          color: #6B7280;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
        }

        .voice-btn:hover {
          background-color: #F3F4F6;
          color: #8B5CF6;
        }

        .voice-btn.listening {
          color: #EF4444;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .send-btn {
          background: #8B5CF6;
          border: none;
          padding: 6px;
          border-radius: 50%;
          cursor: pointer;
          color: white;
          transition: background-color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
        }

        .send-btn:hover {
          background: #7C3AED;
        }
      `}</style>
    </div>
  );
};

export default AIChat;