// src/pages/Virtual.jsx
import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Virtual = () => {
  useEffect(() => {
    document.body.style.paddingTop = '0';
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  return (
    <div className="gojuris-layout">
      <Sidebar />
      
      <div className="gojuris-main">
        <Navbar />
        
        <div className="virtual-page">
          <div className="coming-soon-container">
            <div className="coming-soon-content">
              {/* Icon */}
              <div className="coming-soon-icon">
                <img 
                  src="/i-Virtual Legal Assistant-07.png" 
                  alt="Virtual Assistant"
                  className="assistant-icon"
                />
              </div>

              {/* Title */}
              <h1 className="coming-soon-title">Virtual Legal Assistant</h1>

              {/* Subtitle */}
              <p className="coming-soon-subtitle">
                Your AI-powered legal companion is under development
              </p>

              {/* Coming Soon Badge */}
              <div className="coming-soon-badge">
                <i className="bx bx-time-five"></i>
                <span>Coming Soon</span>
              </div>

              {/* Description */}
              <p className="coming-soon-description">
                We're building an intelligent virtual assistant that will help you with 
                legal research, document drafting, case analysis, and much more. 
                Stay tuned for an enhanced legal workflow experience!
              </p>

              {/* Features Preview */}
              <div className="features-preview">
                <div className="feature-item">
                  <i className="bx bx-check-circle"></i>
                  <span>24/7 Legal Support</span>
                </div>
                <div className="feature-item">
                  <i className="bx bx-check-circle"></i>
                  <span>Document Automation</span>
                </div>
                {/* <div className="feature-item">
                  <i className="bx bx-check-circle"></i>
                  <span>Case Analysis</span>
                </div>
                <div className="feature-item">
                  <i className="bx bx-check-circle"></i>
                  <span>Smart Recommendations</span>
                </div> */}
              </div>

              {/* Notify Button */}
              <button className="notify-btn">
                <i className="bx bx-bell"></i>
                Notify Me When Available
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .virtual-page {
          min-height: calc(100vh - 80px);
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .coming-soon-container {
          max-width: 700px;
          width: 100%;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          padding: 3rem;
          text-align: center;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .coming-soon-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .coming-soon-icon {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 15px 40px rgba(139, 92, 246, 0.4);
          }
        }

        .assistant-icon {
          width: 70px;
          height: 70px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .coming-soon-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .coming-soon-subtitle {
          font-size: 1.125rem;
          color: #6b7280;
          margin: 0;
          font-weight: 500;
        }

        .coming-soon-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
        }

        .coming-soon-badge i {
          font-size: 1.25rem;
          animation: swing 1.5s ease-in-out infinite;
        }

        @keyframes swing {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(15deg);
          }
          75% {
            transform: rotate(-15deg);
          }
        }

        .coming-soon-description {
          font-size: 1rem;
          color: #4b5563;
          line-height: 1.6;
          max-width: 500px;
          margin: 0;
        }

        .features-preview {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          width: 100%;
          margin-top: 1rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: #f3f4f6;
          border-radius: 10px;
          font-size: 0.95rem;
          color: #374151;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          background: #e5e7eb;
          transform: translateX(5px);
        }

        .feature-item i {
          font-size: 1.25rem;
          color: #10b981;
        }

        .notify-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
          margin-top: 1rem;
        }

        .notify-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
          background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%);
        }

        .notify-btn i {
          font-size: 1.25rem;
          animation: ring 2s ease-in-out infinite;
        }

        @keyframes ring {
          0%, 100% {
            transform: rotate(0deg);
          }
          10%, 30% {
            transform: rotate(-15deg);
          }
          20%, 40% {
            transform: rotate(15deg);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .virtual-page {
            padding: 1rem;
          }

          .coming-soon-container {
            padding: 2rem 1.5rem;
          }

          .coming-soon-title {
            font-size: 2rem;
          }

          .coming-soon-subtitle {
            font-size: 1rem;
          }

          .coming-soon-icon {
            width: 100px;
            height: 100px;
          }

          .assistant-icon {
            width: 60px;
            height: 60px;
          }

          .features-preview {
            grid-template-columns: 1fr;
          }

          .notify-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 575.98px) {
          .gojuris-main {
            margin-left: 60px;
            width: calc(100% - 60px);
          }

          .coming-soon-title {
            font-size: 1.75rem;
          }

          .coming-soon-description {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Virtual;