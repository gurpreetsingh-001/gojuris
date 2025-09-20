// src/pages/Judgement.jsx - Redesigned to match reference layout exactly
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
  const judgmentOrderRef = useRef(null);

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

        {/* Back Button */}
        <div className="back-button-container">
          <button className="btn btn-outline-primary btn-sm" onClick={handleBackToResults}>
            <i className="bx bx-arrow-back me-1"></i>
            Back to Results
          </button>
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
          </div>
        </div>

        {/* Judgment Document */}
        <div className="judgment-document">
          {/* Header Information */}
          <div className="judgment-header-info">
            {/* Main Citation */}
            <div className="main-citation-line">
              {judgmentData.mainCitation || `${new Date().getFullYear()} Legal Eagle (SC) ${Math.floor(Math.random() * 100)} : ${new Date().getFullYear()} Gojuris (SC) ${Math.floor(Math.random() * 100)}`}
            </div>

            {/* Court Name */}
            <div className="court-name-line">
              IN THE {judgmentData.court?.toUpperCase() || 'SUPREME COURT OF INDIA'}
            </div>

            {/* Equivalent Citations */}
            <div className="equivalent-citations">
              Equivalent Citations : {judgmentData.citation || '2023 INSC 1133'}
            </div>

            {/* Judges */}
            <div className="judges-line">
              [Before : {judgmentData.judges || 'HON\'BLE CHIEF JUSTICE'}]
            </div>

            {/* Parties */}
            <div className="parties-section">
              <div className="appellant-name">
                {judgmentData.appellant || 'Appellant Name'}
              </div>
              <div className="vs-text">vs.</div>
              <div className="respondent-name">
                {judgmentData.respondent || 'Respondent Name'}
              </div>
            </div>

            {/* Case Details */}
            <div className="case-details-line">
              Case No. : {judgmentData.caseNo || 'Criminal Appeal No. 12 of 2023'}
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
              <div className="section-text">
                {judgmentData.issueForConsideration || 'Whether the learned 1st Appellate Court erred in absolving the Insurance Company of liability to satisfy the awarded amount of compensation, given that the accident occurred before the insurance policy became operative.'}
              </div>
            </div>

            {/* Law Points */}
            <div ref={lawPointsRef} className="content-section">
              <div className="section-heading">LAW POINTS</div>
              <div className="section-text">
                {judgmentData.lawPoint ? (
                  <div>
                    {judgmentData.lawPoint.split('\n').map((point, index) => (
                      <div key={index} className="law-point-item">
                        <strong>{index + 1})</strong> {point.trim()}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="law-point-item">
                      <strong>1)</strong> A specific mention of the time of commencement of an insurance policy in the contract dictates its effective date of coverage.
                    </div>
                    <div className="law-point-item">
                      <strong>2)</strong> Liability of the insurer arises only when there exists a valid contract of insurance at the time of the accident.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Headnotes */}
            <div ref={headnotesRef} className="content-section">
              <div className="section-heading">HEADNOTE S</div>
              <div className="section-text">
                <div className="headnote-content">
                  <strong>Motor Vehicles Act — Insurance — Liability of Insurance Company — Validity of Insurance Contract — Appeal against dismissal of compensation claim — Accident occurred prior to operative time of insurance policy — Claimant suffered serious injuries in an accident involving an uninsured vehicle — Tribunal awarded compensation but held owner and driver liable due to lack of insurance coverage — Appellate Court upheld this decision, concluding no liability on the Insurance Company as the policy commenced at 10 a.m. on the date of the accident, which occurred at 7.30 a.m. — The specific time mentioned in the insurance policy prohibits any assumption of coverage prior to that time — Established legal principle that an insurance policy becomes operative only from the specified time if mentioned — Appeal dismissed as the Insurance Company was not liable to indemnify the owner for the claim. (Paras: 4, 6, 12, 13)</strong>
                </div>
                <div className="held-content">
                  <em>Held:</em> {judgmentData.held || 'The appeal is found to be without merit and is dismissed. (Paras: 12, 13)'}
                </div>
                <div className="background-facts">
                  <strong>Background Facts:</strong> {judgmentData.backgroundFacts || 'The claimant suffered serious injuries in a vehicular accident on 5th August 1994, leading to a claim for compensation before the Motor Accident Compensation Tribunal, which awarded compensation but held the Insurance Company not liable due to the policy\'s operative time. (Paras: 1, 2, 3)'}
                </div>
              </div>
            </div>

            {/* Held */}
            <div ref={heldRef} className="content-section">
              <div className="section-heading">HELD</div>
              <div className="section-text">
                {judgmentData.held || 'The appeal is found to be without merit and is dismissed.'}
              </div>
            </div>

            {/* Facts */}
            <div ref={factsRef} className="content-section">
              <div className="section-heading">FACTS</div>
              <div className="section-text">
                {judgmentData.backgroundFacts || 'The claimant suffered serious injuries in a vehicular accident, leading to a claim for compensation before the Motor Accident Compensation Tribunal.'}
              </div>
            </div>

            {/* Parties Contentions */}
            <div ref={contentionsRef} className="content-section">
              <div className="section-heading">PARTIES CONTENTIONS</div>
              <div className="section-text">
                {judgmentData.partiesContentions || 'Not available'}
              </div>
            </div>

            {/* Disposition */}
            <div ref={dispositionRef} className="content-section">
              <div className="section-heading">DISPOSITION</div>
              <div className="section-text">
                {judgmentData.disposition || 'Appeal dismissed'}
              </div>
            </div>

            {/* Case Notes & Summaries */}
            <div className="content-section">
              <div className="section-heading">CASE NOTES & SUMMARIES</div>
              <div className="section-text">
                <div className="case-notes-table">
                  <div className="notes-row">
                    <div className="notes-cell"><strong>Advocates :</strong></div>
                    <div className="notes-cell"><strong>Acts Referred :</strong></div>
                    <div className="notes-cell"><strong>Cases Cited :</strong></div>
                  </div>
                  <div className="notes-row">
                    <div className="notes-cell">{judgmentData.advocate || 'Adv. Vivek Sharma, Sr. Sharma, M/s 2-3 Chambers, Sukhvinder Singh'}</div>
                    <div className="notes-cell">Motor Vehicles Act, 1988</div>
                    <div className="notes-cell">Various precedents cited</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Judgment Order */}
            {judgmentData.judgement && (
              <div ref={judgmentOrderRef} className="content-section">
                <div className="section-heading">JUDGMENT ORDER :</div>
                <div className="section-text">
                  <div className="judgment-order-text">
                    <strong>Judgement</strong>
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
          background: #f8f9fa;
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
          font-size: 0.75rem;
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
          font-family: 'Times New Roman', serif;
          max-width: 1300px;
          margin: 0 auto;
          padding: 2rem;
          line-height: 1.6;
        }

        /* Header Information */
        .judgment-header-info {
          text-align: center;
          margin-bottom: 2rem;
        }

        .main-citation-line {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .court-name-line {
          font-size: 1.1rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .equivalent-citations {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: #666;
        }

        .judges-line {
          font-size: 0.95rem;
          margin-bottom: 1rem;
          color: #666;
          font-style: italic;
        }

        .parties-section {
          margin: 1rem 0;
        }

        .appellant-name, .respondent-name {
          font-size: 1.1rem;
          font-weight: bold;
          margin: 0.3rem 0;
          color: #333;
        }

        .vs-text {
          font-size: 1.1rem;
          margin: 0.3rem 0;
          font-style: italic;
          color: #666;
        }

        .case-details-line, .date-line {
          font-size: 1.1rem;
          margin: 0.3rem 0;
          color: #666;
        }

        /* Content Sections */
        .judgment-content {
          margin-top: 2rem;
        }

        .content-section {
          margin-bottom: 2rem;
        }

        .section-heading {
          font-size: 1.1rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 1rem;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #333;
          text-align: justify;
        }

        .law-point-item {
          margin-bottom: 0.95rem;
          text-indent: 0;
        }

        .headnote-content {
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .held-content {
          margin-bottom: 1rem;
          font-style: italic;
        }

        .background-facts {
          margin-bottom: 1rem;
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
          font-size: 0.95rem;
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
      `}</style>
    </div>
  );
};

export default Judgement;