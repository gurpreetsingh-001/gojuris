// src/pages/Database.jsx - New Design Based on Reference
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ApiService from '../services/apiService';

const SaveBookmarks = () => {
  const navigate = useNavigate();

  // State management
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isLoadingCourts, setIsLoadingCourts] = useState(true);
  const [courtsError, setCourtsError] = useState('');

  const [judgements, setJudgements] = useState([]);
  const [isLoadingJudgements, setIsLoadingJudgements] = useState(false);
  const [totalJudgements, setTotalJudgements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [years] = useState(
    Array.from({ length: 2025 - 1950 + 1 }, (_, i) => (2025 - i).toString())
  );

  const resultsPerPage = 25;

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
      setIsLoadingCourts(true);
      setCourtsError('');
      console.log('🏛️ Loading courts from API...');

      
      const courtsData = await ApiService.getBookmarksList()

      console.log('✅ Courts loaded:', courtsData);
      setCourts(courtsData);
      // Auto-select first court
      if (courtsData.length > 0) {
        setSelectedCourt(courtsData[0]);
        loadJudgements(courtsData[0], currentPage, selectedYear);
      }

    } catch (error) {
      console.error('❌ Error loading courts:', error);
      setCourtsError(error.message || 'Failed to load courts');
    } finally {
      setIsLoadingCourts(false);
    }
  };
  const formatDate = (dateStr) => {
    if (dateStr) {
      try {
        if (dateStr.length === 8) {
          const year = dateStr.substring(0, 4);
          const month = dateStr.substring(4, 6);
          const day = dateStr.substring(6, 8);
          return `${day}/${month}/${year}`;
        }
        return dateStr;
      } catch {
        return dateStr;
      }
    }
    return 'Date not available';
  };
  // Load judgements for selected court
  const loadJudgements = async (courtKey, page, year) => {
   
    try {
      setIsLoadingJudgements(true);
      console.log(`📊 Loading judgements for ${courtKey}, Page: ${page}, Year: ${year}`);
      const apiResponse = await ApiService.getBookmarkItems(courtKey);
      setJudgements(apiResponse);
      const searchResults = [];
      const totalCount =  0;
      const courtsList =  [];
      const yearList =  [];

      const resultsData = {
        results: searchResults,
        totalCount: totalCount,
        query: ``.trim(),
        searchType: 'Bookmark Search',
        timestamp: new Date().toISOString(),
        // ✅ IMPORTANT: Include API filter data
        courtsList: courtsList,
        yearList: yearList,
        searchData: {
          yearFrom: 2025,
          yearTo: 2025,
          mainkeys: 'All'
        }
      };

      console.log('💾 Storing citation results with API filter data:', resultsData);
      localStorage.setItem('searchResults', JSON.stringify(resultsData));

      // Navigate to results page
      //navigate('/results');
    } catch (error) {
      console.error('❌ Error loading judgements:', error);
    } finally {
      setIsLoadingJudgements(false);
    }
  };

  const handleCourtSelect = (courtKey) => {
    setSelectedCourt(courtKey);
    setCurrentPage(1);
    loadJudgements(courtKey, 1, selectedYear);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadJudgements(selectedCourt, page, selectedYear);
    window.scrollTo(0, 0);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setCurrentPage(1);
    loadJudgements(selectedCourt, 1, year);
  };
  const handleDelete = async (id) => {
    await ApiService.deleteBookmarkItem(id);
    setSelectedCourt(selectedCourt);
    setCurrentPage(1);
    loadJudgements(selectedCourt, 1, selectedYear);
  }
  const handleJudgementClick = (judgement) => {
    console.log('Judgement clicked:', judgement);
    // Navigate to judgement detail page
    const currentIndex = judgements.findIndex(result => result.highlightLink === judgement.highlightLink);
    const navigationData = {
      currentIndex: currentIndex,
      results: judgements.map(result => ({
        keycode: result.highlightLink,
        title: '',
        court: '',
        date: ''
      })),
      searchQuery: '',
      totalResults: judgements.length,
      currentPage: 1
    };

    sessionStorage.setItem('judgementNavigation', JSON.stringify(navigationData));
    navigate(`/judgement/${judgement.highlightLink}`);
  };


  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalJudgements);

  return (
    <div className="gojuris-layout">
      <Sidebar />

      <div className="gojuris-main">
        <Navbar />

        <div className="database-container">
          {/* Tabs */}


          <div className="content-wrapper">
            {/* Left Sidebar - Courts List */}
            <div className="courts-sidebar">
              <div className="courts-header">Select Bookmark</div>

              {isLoadingCourts ? (
                <div className="loading-state">Loading Bookmark...</div>
              ) : courtsError ? (
                <div className="error-state">{courtsError}</div>
              ) : (
                <div className="courts-list">
                  {courts.map((item, index) => (
                    <div
                      key={item}
                      className={`court-item ${selectedCourt === item ? 'active' : ''}`}
                      onClick={() => handleCourtSelect(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Content - Judgements Table */}
            <div className="judgements-content">
              {/* Top Controls */}
             

              {/* Judgements Table */}
              {isLoadingJudgements ? (
                <div className="loading-table">
                  <i className="bx bx-loader-alt bx-spin"></i>
                  <p>Loading judgements...</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="judgements-table">
                    <thead>
                      <tr>
                       
                        <th className="col-appellant">Party Details</th>
                        <th className="col-date">Date</th>
                        <th className="col-action">Action</th> 
                      </tr>
                    </thead>
                    <tbody>
                      {judgements.map((judgement, index) => (
                        <tr
                          key={judgement.highlightLink}
                          onClick={() => handleJudgementClick(judgement)}
                          className="judgement-row"
                        >
                          
                          <td className="col-appellant">{judgement.appelantRespondant}</td>
                          <td className="col-date">{formatDate(judgement.jDate)}</td>
                          <button
                            className="delete-btn"
                            style={{margin : "2px", paddingTop: "1px", paddingBottom: "1px", backgroundColor: "#8b5cf6", color: "white"}}
                            onClick={(e) => {
                              e.stopPropagation(); // stop row click
                               if (window.confirm("Are you sure you want to delete?")) {
                              handleDelete(judgement.id);
                               }
                            }}
                          >
                            Delete
                          </button>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
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
          font-weight: 600;
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
          font-size: 14px;
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
          overflow: hidden;
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

export default SaveBookmarks;