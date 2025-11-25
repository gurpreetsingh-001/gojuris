// src/pages/Judgement.jsx - Redesigned to match reference layout exactly
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import RightSidebar from '../components/RightSidebar';
import ApiService from '../services/apiService';
import GoogleTranslate from "../components/GoogleTranslate";


const Judgement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [judgmentData, setJudgmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('issue');
  const [activeNotesTab, setActiveNotesTab] = useState('advocates');
  // Refs for scroll targets
  const issueRef = useRef(null);
  const lawPointsRef = useRef(null);
  const headnotesRef = useRef(null);
  const heldRef = useRef(null);
  const factsRef = useRef(null);
  const contentionsRef = useRef(null);
  const dispositionRef = useRef(null);
  const judgmentOrderRef = useRef(null);
  const [marks, setMarks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

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

  useEffect(() => {
    if (judgmentData) {
      scrollToSection(issueRef, 'issue');
      const allRefs = [issueRef, lawPointsRef, factsRef, contentionsRef, headnotesRef, judgmentOrderRef]; // add all your refs here
      const allMarks = allRefs.reduce((acc, ref) => {
        if (ref.current) {
          const marks = ref.current.querySelectorAll("mark");
          acc.push(...marks);
        }
        return acc;
      }, []);

      setMarks(allMarks);
      setCurrentIndex(-1);
    }

  }, [judgmentData]);

  const scrollToNextMark = () => {
    if (marks.length === 0) return;

    const nextIndex = (currentIndex + 1) % marks.length;
    marks[nextIndex].scrollIntoView({ behavior: "smooth", block: "center" });
    setCurrentIndex(nextIndex);
  };
  // Add this useEffect in your Judgement component

  // In Judgement.jsx - Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            // Trigger previous judgement
            const prevBtn = document.querySelector('[data-action="previous"]');
            if (prevBtn && !prevBtn.disabled) {
              prevBtn.click();
            }
            break;
          case 'ArrowRight':
            event.preventDefault();
            // Trigger next judgement
            const nextBtn = document.querySelector('[data-action="next"]');
            if (nextBtn && !nextBtn.disabled) {
              nextBtn.click();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const fetchJudgmentDetails = async (keycode) => {
    try {
      setIsLoading(true);
      setError('');
      const savedResults = localStorage.getItem('searchResults');

      const resultsData = JSON.parse(savedResults);
      const searchPayload = {
        keycode: keycode,
        query: resultsData?.query || '',
        pageSize: 1,
        page: 0,
        sortBy: "relevance",
        sortOrder: "desc"
      };

      const response = await ApiService.getJudgementDetails(keycode, searchPayload);

      if (response && response.id) {
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

  // Add this useEffect after your existing useEffects

  const scrollToSection = (sectionRef, tabName) => {
    setActiveTab(tabName);
    if (sectionRef.current) {
      const offset = 80;
      const elementPosition = sectionRef.current.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
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
              <i className="bx bx-arrow-back me-1"></i>
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
    { id: 'headnotes', label: 'HEADNOTES', ref: headnotesRef },
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
       
        {/* Back Button */}
        <div className="back-button-container">
          <button className="btn btn-outline-primary btn-sm" onClick={handleBackToResults}>
            <i className="bx bx-arrow-back me-1"></i>
            Back to Results
          </button>

          <div className='gtranslate'>
             <GoogleTranslate />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="judgment-navigation">
          <div className="nav-tabs-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => scrollToSection(tab.ref, tab.id)}
              >

                {tab.label}
              </button>
            ))}
            <button
            className='nav-tab active'
              onClick={() => scrollToNextMark()}>
              Show Hits
            </button>
          </div>
        </div>
        
        {/* Judgment Document */}
        <div className="judgment-document">
          {/* Header Information */}
          <div className="judgment-header-info">
            {/* Main Citation */}
            <div className="main-citation-line">
              {judgmentData.mainCitation}
            </div>

            {/* Court Name */}
            <div className="court-name-line">
              IN THE {judgmentData.court?.toUpperCase()}
            </div>

            {/* Equivalent Citations */}
            <div className="equivalent-citations">
              Equivalent Citations : {judgmentData.fullequivicit}
            </div>

            {/* Judges */}
            <div className="judges-line">
              [Before : {judgmentData.judges || ''}]
            </div>

            {/* Parties */}
            <div className="parties-section">
              <div className="appellant-name">
                {judgmentData.appellant || ''}
              </div>
              <div className="vs-text">vs.</div>
              <div className="respondent-name">
                {judgmentData.respondent || ''}
              </div>
            </div>

            {/* Case Details */}
            <div className="case-details-line">
              Case No. : {judgmentData.caseNo || '.'}
            </div>
            <div className="date-line">
              Date of Decision : {formatDate(judgmentData.date)}
            </div>
          </div>

          {/* Content Sections */}
          <div className="judgment-content">
            {/* Issue for Consideration */}
            <div ref={issueRef} className="content-section">
              <div className="section-heading">ISSUE FOR CONSIDERATION</div>
              <div className="section-text" dangerouslySetInnerHTML={{ __html: judgmentData.issueForConsideration }}>
              </div>
            </div>

            {/* Law Points */}
            <div ref={lawPointsRef} className="content-section">
              <div className="section-heading">LAW POINTS</div>
              <div className="section-text-lawpoint" dangerouslySetInnerHTML={{ __html: judgmentData.lawPoint }}>

              </div>
            </div>

            {/* Headnotes */}
            <div ref={headnotesRef} className="content-section">
              <div className="section-heading">HEADNOTE/S</div>
              <div className="section-text">
                <div className="headnote-content">
                  <strong dangerouslySetInnerHTML={{ __html: judgmentData.newHeadnote }}></strong>
                </div>
                <div ref={heldRef} className="held-content">
                  <em><strong>Held:</strong></em> <spam dangerouslySetInnerHTML={{ __html: judgmentData.held }}></spam>
                </div>
                <div ref={factsRef} className="background-facts">
                  <em><strong>Background Facts:</strong></em><spam dangerouslySetInnerHTML={{ __html: judgmentData.backgroundFacts }}></spam>
                </div>
              </div>
            </div>

            {/* Held */}
            {/* <div ref={heldRef} className="content-section">
              <div className="section-heading">HELD</div>
              <div className="section-text">
                {judgmentData.held || 'The appeal is found to be without merit and is dismissed.'}
              </div>
            </div> */}

            {/* Facts */}
            {/* <div ref={factsRef} className="content-section">
              <div className="section-heading">FACTS</div>
              <div className="section-text">
                {judgmentData.backgroundFacts || 'The claimant suffered serious injuries in a vehicular accident, leading to a claim for compensation before the Motor Accident Compensation Tribunal.'}
              </div>
            </div> */}

            {/* Parties Contentions */}
            <div ref={contentionsRef} className="content-section">
              {/* <div className="section-heading">PARTIES CONTENTIONS</div> */}
              <div className="section-text-parties">
                <em><strong>Parties Contentions:</strong></em><spam dangerouslySetInnerHTML={{ __html: judgmentData.partiesContentions }}></spam>
              </div>
            </div>

            {/* Disposition */}
            <div ref={dispositionRef} className="content-section">
              {/* <div className="section-heading">DISPOSITION</div> */}
              <div className="section-text">
                <em><strong>Disposition: </strong></em><spam dangerouslySetInnerHTML={{ __html: judgmentData.disposition }}></spam>
              </div>
            </div>

            {/* Case Notes & Summaries */}
            <div className="content-section">
              <div className="section-heading">{judgmentData.headnote.length > 5 ? 'Case Notes & Summaries' : ''}</div>
              <div className="section-text">
                <div className="headnote-content">
                  <strong dangerouslySetInnerHTML={{ __html: judgmentData.headnote }}></strong>
                </div>
              </div>
            </div>

            {/* Case Notes Tabs */}
            <div className="case-notes-tabs-container">
              <div className="case-notes-tabs">
                <button
                  className={`case-notes-tab ${activeNotesTab === 'advocates' ? 'active' : ''}`}
                  onClick={() => setActiveNotesTab('advocates')}
                >
                  Advocates
                </button>
                <button
                  className={`case-notes-tab ${activeNotesTab === 'acts' ? 'active' : ''}`}
                  onClick={() => setActiveNotesTab('acts')}
                >
                  Acts Referred
                </button>
                <button
                  className={`case-notes-tab ${activeNotesTab === 'cases' ? 'active' : ''}`}
                  onClick={() => setActiveNotesTab('cases')}
                >
                  Cases Cited
                </button>
              </div>

              {/* Tab Content */}
              <div className="case-notes-content">
                {activeNotesTab === 'advocates' && (
                  <div className="tab-content-adv">
                    {judgmentData.advocates || ''}
                  </div>
                )}
                {activeNotesTab === 'acts' && (
                  <div className="tab-content" dangerouslySetInnerHTML={{ __html: judgmentData.actReferred || '' }}>
                  </div>
                )}
                {activeNotesTab === 'cases' && (
                  <div className="tab-content" dangerouslySetInnerHTML={{ __html: judgmentData.casesReferred || '' }}>
                  </div>
                )}
              </div>
            </div>

            {/* Judgment Order */}
            {judgmentData.judgement && (
              <div ref={judgmentOrderRef} className="content-section">
                <div className="section-heading">JUDGMENT ORDER :</div>
                <div className="section-text-judgement">
                  <div className="judgment-order-text">
                    <div className="judgment-content-text">
                      <div dangerouslySetInnerHTML={{ __html: judgmentData.judgement }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <RightSidebar />

      <style jsx>{`
        /* Clean Document Layout - No Lines */
        .back-button-container {
          padding: 1rem;
          display:flex;
          background: #f8f9fa;
          justify-content: space-between; /* left & right alignment */
  align-items: center;  
        }
        mark {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(217, 70, 239, 0.2));
          color: var(--gj-primary);
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          font-weight: 600;
        }
        .judgment-navigation {
          background: white;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e0e0e0;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nav-tabs-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .nav-tab {
          background: none;
          border: none;
          padding: 0.5rem 1rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: underline;
          white-space: nowrap;
        }

        .nav-tab:hover {
          color: #007bff;
          background: rgba(0, 123, 255, 0.05);
        }

        .nav-tab.active {
          color: #007bff;
          font-weight: 600;
          background: rgba(0, 123, 255, 0.1);
        }

        /* Document Styling */
        .judgment-document {
          background: white;
          // font-family: 'Times New Roman', serif;
          max-width: 1300px;
          margin: 0 auto;
          padding: 2rem 6rem 2rem 2rem;
          line-height: 1.6;
        }

        /* Header Information */
        .judgment-header-info {
          text-align: center;
          margin-bottom: 1rem;
        }

        .main-citation-line {
          font-size: 1.17rem;
          margin-bottom: 0rem;
          color: #000;
        }

        .court-name-line {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 0rem;
          color: #000;
        }

        .equivalent-citations {
          font-size: 1.1rem;
          margin-bottom: 0rem;
          color: #000;
        }

        .judges-line {
         font-size: 1.1rem;
    margin-bottom: 0rem;
    color: #000;
    font-weight: 700;
        }

        .parties-section {
          margin: 0.25rem 0;
        }

        .appellant-name, .respondent-name {
          font-size: 1.65rem;
          font-weight: bold;
          margin: 0.3rem 0;
          color: #000;
        }

        .vs-text {
          font-size: 1.2rem;
    font-weight: 500;
    margin: 0.1rem 0;
    color: #000;
        }

        .case-details-line {
          font-size: 1rem;
          margin: 0rem 0;
          color: #000;
        }
 .date-line {
          font-size: 1.25rem;
          margin: 0rem 0;
          font-weight:400;
          color: #000;
        }
        /* Content Sections */
        .judgment-content {
          margin-top: 1rem;
        }

        .content-section {
          margin-bottom: 1rem;
        }

        .section-heading {
              font-size: 1.25rem;
    font-weight: 500;
    text-align: center;
    margin-bottom: 1rem;
    color: #000;
    text-decoration: underline;
    text-transform: uppercase;
    letter-spacing: 0px;
        }

        .section-text {
          font-size: 1.25rem;
          line-height: 1.7;
          font-weight:400;
          color: #000;
          font-style:italic;
          text-align: justify;
        }

        .section-text-parties {
          font-size: 1.25rem;
          line-height: 1.7;
          font-weight:400;
          color: #000;
          font-style:italic;
          text-align: justify;
        }
          .section-text-lawpoint {
          font-size: 1.25rem;
          line-height: 1.7;
          font-weight:400;
        
    margin-left: 75px;
    margin-right: 75px;
    color: green;
            text-align: justify;
        }
        .section-text-judgement {
          line-height: 1.7;
          text-align: justify;
          font-size: 15pt;
          font-family: Calibri;
        }
        .law-point-item {
          margin-bottom: 0.95rem;
          text-indent: 0;
        }

        .headnote-content {
          margin-bottom: 1rem;
          font-size: 1.25rem;
          font-weight:400 !important;
          font-style:normal;
        }

        .held-content {
          margin-bottom: 1rem;
          font-style: italic;
        }

        .background-facts {
          margin-bottom: 1rem;
          font-style:normal !important;
        }

        /* Case Notes Table */
        .case-notes-table {
          display: table;
          width: 100%;
          margin-top: 1rem;
        }

        .notes-row {
          display: table-row;
        }

        .notes-cell {
          display: table-cell;
          padding: 0.5rem;
          border: 1px solid #ddd;
          font-size: 0.95rem;
          vertical-align: top;
        }

        /* Judgment Order */
        .judgment-order-text {
          
        }

        .judgment-content-text {
          margin-top: 1rem;
          text-indent: 0;
        }

        .judgment-content-text p {
          margin-bottom: 1rem;
          text-align: justify;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .judgment-document {
            padding: 1rem;
          }
             .back-button-container {
    flex-direction: column;
    gap: 10px; /* spacing between button & translate */
  }
      .gtranslate {
    margin-left: 0 !important;
  }

          .nav-tabs-container {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
            justify-content: flex-start;
          }
          
          .nav-tabs-container::-webkit-scrollbar {
            display: none;
          }
          
          .nav-tab {
            flex-shrink: 0;
            font-size: 0.7rem;
            padding: 0.4rem 0.8rem;
            display:none !important;
          }

          .section-text {
            font-size: 1.0rem;
          }

          .case-notes-table {
            font-size: 0.95rem;
          }

          .notes-cell {
            padding: 0.3rem;
          }
        }

        /* Print Styles */
        @media print {
          .back-button-container,
          .judgment-navigation,
          .gojuris-sidebar,
          .right-sidebar {
            display: none !important;
          }
          
          .judgment-document {
            padding: 0;
            font-size: 11px;
            max-width: none;
            margin: 0;
          }
          
          .section-heading {
            font-size: 12px;
            page-break-after: avoid;
          }
          
          .content-section {
            page-break-inside: avoid;
            margin-bottom: 1.5rem;
          }
        }


        .disposition-line {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  line-height: 1.7;
  font-weight: 400;
  color: #000;
  font-style: italic;
  text-align: justify;
}

.case-notes-tabs-container {
  margin-top: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.case-notes-tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  background-color: #f8f9fa;
}

.case-notes-tab {
  flex: 1;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-right: 1px solid #ddd;
  font-size: 0.95rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.case-notes-tab:last-child {
  border-right: none;
}

.case-notes-tab:hover {
  background-color: #e9ecef;
  color: #495057;
}

.case-notes-tab.active {
  background-color: #7e54e0;
  color: white;
  font-weight: 600;
}

.case-notes-content {
  padding: 1rem;
  background-color: white;
  min-height: 80px;
}

.tab-content {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #000;
}
  .tab-content-adv {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #000;
   font-style:italic;
}
  

.tab-content div {
  margin-bottom: 0.5rem;
}

.tab-content div:last-child {
  margin-bottom: 0;
}

/* Responsive design for tabs */
@media (max-width: 768px) {
  .case-notes-tab {
    font-size: 0.85rem;
    padding: 0.5rem 0.75rem;
  }
  
  .case-notes-content {
    padding: 0.75rem;
  }
  
  .tab-content {
    font-size: 0.9rem;
  }
}
      `}</style>
    </div>
  );
};

export default Judgement;