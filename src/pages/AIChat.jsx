// src/pages/AIChat.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const AIChat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

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
      setMessage('');
      
      setTimeout(() => {
        setChatHistory(prev => [...prev, { 
          type: 'ai', 
          text: `Thank you for your question: "${message}". I'm processing your legal query and will provide a comprehensive response based on Indian law and relevant case precedents.`
        }]);
      }, 1000);
    }
  };

  const handleQuickQuestion = (question) => {
    setMessage(question);
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
          <button className="login-btn">Login</button>
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
          
          {chatHistory.length === 0 && (
            <div className="quick-questions">
              {quickQuestions.map((question, index) => (
                <button 
                  key={index}
                  className="quick-question-btn"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </button>
              ))}
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
              <button type="submit" className="send-btn">
                <i className="bx bx-send"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChat;