// src/pages/Judgement.jsx - Updated with tabbed design
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import RightSidebar from '../components/RightSidebar';
import ApiService from '../services/apiService';

const Judgement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [judgmentData, setJudgmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('issue');

  // Refs for scroll targets
  const issueRef = useRef(null);
  const lawPointsRef = useRef(null);
  const headnotesRef = useRef(null);
  const heldRef = useRef(null);
  const factsRef = useRef(null);
  const contentionsRef = useRef(null);
  const dispositionRef = useRef(null);

  useEffect(() => {
    document.body.style.paddingTop = '0';
    
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  useEffect(() => {
    if (id) {
      fetchJudgmentDetails(id);
    } else {
      setError('No judgment ID provided');
      setIsLoading(false);
    }
  }, [id]);

  const fetchJudgmentDetails = async (keycode) => {
    try {
      setIsLoading(true);
      setError('');

      const searchPayload = {
        keycode: parseInt(keycode),
        query: "",
        pageSize: 1,
        page: 0,
        sortBy: "relevance",
        sortOrder: "desc"
      };

      const response = await ApiService.getJudgementDetails(keycode, searchPayload);

      if (response && response.keycode) {
        setJudgmentData(response);
      } else {
        setError('Judgment not found or invalid response format');
      }

    } catch (error) {
      setError(error.message || 'Failed to load judgment details');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (sectionRef, tabName) => {
    setActiveTab(tabName);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const dateStr = dateString.toString();
      if (dateStr.length === 8) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${day}-${month}-${year}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  const handleBackToResults = () => {
    navigate('/results');
  };

  if (isLoading) {
    return (
      <div className="gojuris-layout">
        <Sidebar />
        <div className="gojuris-main">
          <Navbar />
          <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <div className="text-center">
              <i className="bx bx-loader bx-spin" style={{ fontSize: '2rem', color: 'var(--gj-primary)' }}></i>
              <p className="mt-2">Loading judgment details...</p>
            </div>
          </div>
        </div>
        <RightSidebar />
      </div>
    );
  }

  if (error || !judgmentData) {
    return (
      <div className="gojuris-layout">
        <Sidebar />
        <div className="gojuris-main">
          <Navbar />
          <div className="container mt-5">
            <div className="alert alert-danger">
              <i className="bx bx-error-circle me-2"></i>
              {error || 'Judgment not found'}
            </div>
            <button className="btn btn-primary" onClick={handleBackToResults}>
              Back to Results
            </button>
          </div>
        </div>
        <RightSidebar />
      </div>
    );
  }

  const tabs = [
    { id: 'issue', label: 'ISSUE FOR CONSIDERATION', ref: issueRef },
    { id: 'lawpoints', label: 'LAW POINTS', ref: lawPointsRef },
    { id: 'headnotes', label: 'HEADNOTE S', ref: headnotesRef },
    { id: 'held', label: 'HELD', ref: heldRef },
    { id: 'facts', label: 'FACTS', ref: factsRef },
    { id: 'contentions', label: 'PARTIES CONTENTIONS', ref: contentionsRef },
    { id: 'disposition', label: 'DISPOSITION', ref: dispositionRef }
  ];

  return (
    <div className="gojuris-layout">
      <Sidebar />
      
      <div className="gojuris-main">
        <Navbar />

        {/* Header with Back Button */}
        <div className="judgment-header bg-light border-bottom p-2">
          <button className="btn btn-outline-primary btn-sm" onClick={handleBackToResults}>
            <i className="bx bx-arrow-back me-1"></i>
            Back to Results
          </button>
        </div>

        {/* Citation and Court Info */}
        <div className="judgment-citation text-center p-3 bg-white border-bottom">
          {judgmentData.mainCitation && (
            <div className="citation-text mb-2">
              <strong>{judgmentData.mainCitation}</strong>
            </div>
          )}
          <div className="court-name mb-2">
            <strong>{judgmentData.court}</strong>
          </div>
          {judgmentData.appellant && judgmentData.respondent && (
            <div className="case-parties mb-2">
              <strong>{judgmentData.appellant}</strong>
              <div className="vs-text">Vs</div>
              <strong>{judgmentData.respondent}</strong>
            </div>
          )}
          {judgmentData.caseNo && (
            <div className="case-number mb-1">
              Case No.: {judgmentData.caseNo}
            </div>
          )}
          <div className="judgment-date">
            Date of Decision: {formatDate(judgmentData.date)}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="judgment-tabs sticky-top bg-white border-bottom">
          <div className="d-flex justify-content-center flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`judgment-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => scrollToSection(tab.ref, tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Judgment Content */}
        <div className="judgment-document p-4">
          {/* Issue for Consideration */}
          <div ref={issueRef} className="judgment-section mb-5">
            <h3 className="section-header text-center">ISSUE FOR CONSIDERATION</h3>
            <div className="section-content">
              {judgmentData.issueForConsideration || 'Not available'}
            </div>
          </div>

          {/* Law Points */}
          <div ref={lawPointsRef} className="judgment-section mb-5">
            <h3 className="section-header text-center">LAW POINTS</h3>
            <div className="section-content" style={{ whiteSpace: 'pre-line' }}>
              {judgmentData.lawPoint || 'Not available'}
            </div>
          </div>

          {/* Headnotes - Using newHeadnote from API */}
          <div ref={headnotesRef} className="judgment-section mb-5">
            <h3 className="section-header text-center">HEADNOTE S</h3>
            <div className="section-content">
              {judgmentData.newHeadnote || judgmentData.headnoteAll || 'Not available'}
            </div>
          </div>

          {/* Held */}
          <div ref={heldRef} className="judgment-section mb-5">
            <h3 className="section-header text-center">HELD</h3>
            <div className="section-content">
              {judgmentData.held || 'Not available'}
            </div>
          </div>

          {/* Facts - Using backgroundFacts */}
          <div ref={factsRef} className="judgment-section mb-5">
            <h3 className="section-header text-center">FACTS</h3>
            <div className="section-content">
              {judgmentData.backgroundFacts || 'Not available'}
            </div>
          </div>

          {/* Parties Contentions */}
          <div ref={contentionsRef} className="judgment-section mb-5">
            <h3 className="section-header text-center">PARTIES CONTENTIONS</h3>
            <div className="section-content">
              {judgmentData.partiesContentions || 'Not available'}
            </div>
          </div>

          {/* Disposition */}
          <div ref={dispositionRef} className="judgment-section mb-5">
            <h3 className="section-header text-center">DISPOSITION</h3>
            <div className="section-content">
              {judgmentData.disposition || judgmentData.held || 'Not available'}
            </div>
          </div>

          {/* Full Judgment Text */}
          {judgmentData.judgement && (
            <div className="judgment-section mb-5">
              <h3 className="section-header text-center">JUDGMENT ORDER</h3>
              <div 
                className="section-content judgment-text"
                dangerouslySetInnerHTML={{ __html: judgmentData.judgement }}
              />
            </div>
          )}

          {/* Case Notes - Using headnote from API */}
          {judgmentData.headnote && judgmentData.headnote !== '.' && (
            <div className="judgment-section mb-5">
              <h3 className="section-header text-center">CASE NOTES & SUMMARIES</h3>
              <div className="section-content">
                {judgmentData.headnote}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <RightSidebar />

      <style jsx>{`
      /* Judgment Page Tabbed Design */
.judgment-citation {
  font-family: 'Times New Roman', serif;
  line-height: 1.6;
}

.citation-text {
  font-size: 14px;
  color: var(--gj-dark);
}

.court-name {
  font-size: 16px;
  color: var(--gj-dark);
  text-transform: uppercase;
}

.case-parties {
  font-size: 18px;
  color: var(--gj-dark);
}

.vs-text {
  font-size: 16px;
  margin: 0.5rem 0;
  font-style: italic;
}

.case-number, .judgment-date {
  font-size: 14px;
  color: var(--gj-gray);
}

/* Navigation Tabs */
.judgment-tabs {
  padding: 0.5rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1020;
}

.judgment-tab {
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  font-size: 12px;
  font-weight: 600;
  color: var(--gj-gray);
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

.judgment-tab:hover {
  color: var(--gj-primary);
  background: rgba(var(--gj-primary-rgb), 0.05);
}

.judgment-tab.active {
  color: var(--gj-primary);
  border-bottom-color: var(--gj-primary);
  background: rgba(var(--gj-primary-rgb), 0.1);
}

/* Judgment Document Content */
.judgment-document {
  font-family: 'Times New Roman', serif;
  line-height: 1.8;
  color: #333;
  max-width: none;
}

.judgment-section {
  margin-bottom: 3rem;
}

.section-header {
  font-size: 16px;
  font-weight: bold;
  color: var(--gj-dark);
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--gj-primary);
  letter-spacing: 1px;
}

.section-content {
  font-size: 15px;
  line-height: 1.8;
  text-align: justify;
  color: #333;
  text-indent: 0;
}

/* Judgment HTML Content Styling */
.judgment-text {
  font-size: 15px;
  line-height: 1.8;
}

.judgment-text p {
  margin-bottom: 1rem;
  text-align: justify;
  text-indent: 2rem;
}

.judgment-text strong {
  font-weight: bold;
}

/* Responsive Design */
@media (max-width: 768px) {
  .judgment-tabs .d-flex {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .judgment-tabs .d-flex::-webkit-scrollbar {
    display: none;
  }
  
  .judgment-tab {
    flex-shrink: 0;
    font-size: 11px;
    padding: 0.5rem 0.75rem;
  }
  
  .case-parties {
    font-size: 16px;
  }
  
  .section-content {
    font-size: 14px;
  }
}

/* Print Styles */
@media print {
  .judgment-header,
  .judgment-tabs,
  .gojuris-sidebar,
  .right-sidebar {
    display: none !important;
  }
  
  .judgment-document {
    padding: 0;
    font-size: 12px;
  }
  
  .section-header {
    font-size: 14px;
    page-break-after: avoid;
  }
  
  .judgment-section {
    page-break-inside: avoid;
    margin-bottom: 2rem;
  }
}

/* Sticky Navigation Fix */
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 555;
}
  `}</style>
    </div>
  );
};

export default Judgement;