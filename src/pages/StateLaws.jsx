// src/pages/Database.jsx - New Design Based on Reference
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import LeApiService from '../services/leapiService';

const StateLaws = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isLoadingCourts, setIsLoadingCourts] = useState(true);
  const [courtsError, setCourtsError] = useState('');
  const [isLoadingJudgements, setIsLoadingJudgements] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(null);
  const [searchText, setSearchText] = useState("");
  const stateCodeMap = [
    { key: "Andhra Pradesh", value: "AP" },
    { key: "Assam & North East", value: "NorthPDF" },
    { key: "Bihar", value: "PAT" },
    { key: "Chhattisgarh", value: "CHHAT" },
    { key: "Delhi", value: "DEL" },
    { key: "Goa", value: "Goa" },
    { key: "Gujarat", value: "Guj" },
    { key: "Himachal", value: "HIM" },
    { key: "Jammu and Kashmir", value: "JK" },
    { key: "Jharkhand", value: "JHAR" },
    { key: "Kerala", value: "KER" },
    { key: "Karnataka", value: "KAR" },
    { key: "Madhya Pradesh", value: "MP" },
    { key: "Maharashtra", value: "MAH" },
    { key: "Orissa", value: "ORI" },
    { key: "Punjab & Haryana", value: "PUN" },
    { key: "Rajasthan", value: "RAJ" },
    { key: "Tamil Nadu", value: "TAM" },
    { key: "Uttar Pradesh", value: "UP" },
    { key: "Uttaranchal", value: "UTT" },
    { key: "West Bengal", value: "WB" }
  ];

  useEffect(() => {
    document.body.style.paddingTop = '0';
    loadCourts();

    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  // Load courts from getUserPermissions API
  const loadCourts = async () => {
    try {
      setSelectedCourt('AP');
      loadJudgements('AP');


    } catch (error) {
      console.error('❌ Error loading courts:', error);
      setCourtsError(error.message || 'Failed to load courts');
    } finally {
      setIsLoadingCourts(false);
    }
  };

  // Load judgements for selected court
  const loadJudgements = async (courtKey) => {
    setIsLoadingJudgements(true);
    const apiResponse = await LeApiService.getStateActList(courtKey);
    setBlogPosts(apiResponse || []);

    setIsLoadingJudgements(false);
  };

  const handleCourtSelect = (courtKey) => {
    setSelectedCourt(courtKey);
    loadJudgements(courtKey);
  };
  const handleOpenLaw = (post) => {
    const url = `https://legaleagleweb.com/${selectedCourt}/${post}`;   // your final URL
    setTitle(post);
    setPdfUrl(url);
    setShowModal(true);
  };

  const filteredItems = blogPosts.filter(item =>
    item.actname.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="gojuris-layout">
      <Sidebar />

      <div className="gojuris-main">
        <Navbar />

        <div className="database-container">
          {/* Tabs */}


          <div className="content-wrapper robotofont">
            {/* Left Sidebar - Courts List */}
            <div className="courts-sidebar">
              <div className="courts-header">Select State</div>

              {isLoadingCourts ? (
                <div className="loading-state">Loading State Laws...</div>
              ) : courtsError ? (
                <div className="error-state">{courtsError}</div>
              ) : (
                <div className="courts-list">
                  {stateCodeMap.map((state, idx) => (
                    <div
                      key={idx}
                      className={`court-item ${selectedCourt === state.value ? 'active' : ''}`}
                      onClick={() => handleCourtSelect(state.value)}
                    >
                      {state.key}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Content - Judgements Table */}
            <div className="judgements-content robotofont">
              {/* Top Controls */}


              {/* Judgements Table */}
              {isLoadingJudgements ? (
                <div className="loading-table">
                  <i className="bx bx-loader-alt bx-spin"></i>
                  <p>Loading State Laws...</p>
                </div>
              ) : (
                <>
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        fontSize: "14px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        outline: "none",
                      }}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                     placeholder = "Type Here to Search"
                    />
                  </div>
                  {filteredItems.map((post, index) => (
                    <div key={index} className="">
                      <article className="card card-hover border-0 shadow-lg h-100 m-2">

                        <div className="card-body p-3">
                          <h4 className="h5 mb-2" onClick={(e) => {
                            e.preventDefault();
                            handleOpenLaw(post.actlink);
                          }}>
                            <a href="#" className="text-decoration-none stretched-link" style={{ color: "#337ab7" }}
                            >
                              {post.actname}
                            </a>
                          </h4>

                        </div>
                      </article>
                    </div>
                  ))}
                </>
              )}

            </div>
          </div>
        </div>
        {showModal && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-xl" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title"></h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body" style={{ height: "80vh" }}>
                  <iframe
                    src={pdfUrl}
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .database-container {
          padding: 0;
          background: #f5f5f5;
          min-height: calc(100vh - 80px);
        }

        .tabs-section {
          background: white;
          border-bottom: 1px solid #e0e0e0;
          padding: 0 20px;
          display: flex;
          gap: 10px;
        }

        .tab-btn {
          padding: 12px 24px;
          border: none;
          background: transparent;
          color: #666;
          font-size: 14px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .tab-btn.active {
          color: #333;
          border-bottom-color: #7C3AED;
          font-weight: 600;
        }

        .content-wrapper {
          display: flex;
          gap: 0;
          height: calc(100vh - 140px);
        }

        /* Left Sidebar Styles */
        .courts-sidebar {
          width: 320px;
          background: white;
          border-right: 1px solid #e0e0e0;
          overflow-y: auto;
          flex-shrink: 0;
        }

        .courts-header {
          padding: 15px 20px;
          background: #f8f9fa;
          border-bottom: 2px solid #e0e0e0;
         
          font-size: 16px;
          color: #333;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .courts-list {
          padding: 10px 0;
        }

        .court-item {
          padding: 12px 20px;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 3px solid transparent;
          font-size: 16px;
           font-weight: 600;
          color: #333;
        }

        .court-item:hover {
          background: #f8f9fa;
        }

        .court-item.active {
          background: #7C3AED;
          color: white;
          border-left-color: #0056b3;
        }

        .loading-state, .error-state {
          padding: 20px;
          text-align: center;
          color: #666;
        }

        /* Right Content Styles */
        .judgements-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
        }

        .top-controls {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 15px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
          flex-wrap: wrap;
        }

        .page-selector, .year-selector {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .page-selector label, .year-selector label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .page-select, .year-select {
          padding: 6px 30px 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          background: white;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
        }

        .results-info {
          font-size: 14px;
          color: #666;
        }

        .total-info {
          font-size: 14px;
          color: #7C3AED;
          margin-left: auto;
        }

        .total-info strong {
          font-weight: 700;
        }

        /* Table Styles */
        .table-container {
          flex: 1;
          overflow: auto;
        }

        .judgements-table {
          width: 100%;
          border-collapse: collapse;
        }

        .judgements-table thead {
          position: sticky;
          top: 0;
          z-index: 10;
          background: #e8e8f7;
        }

        .judgements-table th {
          padding: 12px 15px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          color: #333;
          border-bottom: 2px solid #d0d0d0;
        }

        .judgements-table th i {
          margin-right: 5px;
          vertical-align: middle;
        }

        .col-number {
          width: 50px;
          text-align: center !important;
        }

        .col-appellant {
          width: 35%;
        }

        .col-respondent {
          width: 35%;
        }

        .col-date {
          width: 15%;
        }

        .col-court {
          width: 15%;
        }

        .judgement-row {
          cursor: pointer;
          transition: background 0.2s;
        }

        .judgement-row:hover {
          background: #f8f9fa;
        }

        .judgement-row:nth-child(even) {
          background: #fafafa;
        }

        .judgement-row:nth-child(even):hover {
          background: #f0f0f0;
        }

        .judgements-table td {
          padding: 12px 15px;
          font-size: 13px;
          color: #333;
          border-bottom: 1px solid #f0f0f0;
        }

        .col-number i {
          font-size: 16px;
          color: #666;
        }

        .loading-table {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          gap: 15px;
        }

        .loading-table i {
          font-size: 48px;
          color: #7C3AED;
        }

        .loading-table p {
          font-size: 16px;
          color: #666;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .bx-spin {
          animation: spin 1s linear infinite;
        }

        /* Scrollbar Styles */
        .courts-sidebar::-webkit-scrollbar,
        .table-container::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .courts-sidebar::-webkit-scrollbar-track,
        .table-container::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .courts-sidebar::-webkit-scrollbar-thumb,
        .table-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .courts-sidebar::-webkit-scrollbar-thumb:hover,
        .table-container::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .courts-sidebar {
            width: 250px;
          }
          
          .col-appellant, .col-respondent {
            width: 30%;
          }
        }

        @media (max-width: 768px) {
          .content-wrapper {
            flex-direction: column;
            height: auto;
          }

          .courts-sidebar {
            width: 100%;
            max-height: 300px;
          }

          .top-controls {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .total-info {
            margin-left: 0;
          }

          .judgements-table {
            font-size: 12px;
          }

          .judgements-table th,
          .judgements-table td {
            padding: 8px 10px;
          }
        }

        @media (max-width: 575.98px) {
          .gojuris-main {
            margin-left: 60px;
            width: calc(100% - 60px);
          }
        }
      `}</style>
    </div>
  );
};

export default StateLaws;