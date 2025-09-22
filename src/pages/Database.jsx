// src/pages/Database.jsx - Complete with data filtering functionality
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ApiService from '../services/apiService';

const Database = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]); // NEW: Filtered results
  const [allResults, setAllResults] = useState([]); // NEW: Store all results
  const [totalResults, setTotalResults] = useState(57801);
  const [isLoading, setIsLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('Most Relevance');
  const [sortByYear, setSortByYear] = useState('By Year');
  const [sortByCourt, setSortByCourt] = useState('By Courts');
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isCourtDropdownOpen, setIsCourtDropdownOpen] = useState(false);
  const [isRelevanceDropdownOpen, setIsRelevanceDropdownOpen] = useState(false);

  const resultsPerPage = 25;

  useEffect(() => {
    document.body.style.paddingTop = '0';
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  useEffect(() => {
    loadDatabaseResults();
  }, []);

  // NEW: Apply filters whenever filter criteria changes
  useEffect(() => {
    applyFilters();
  }, [allResults, sortByYear, sortByCourt, sortBy, filterText]);

  const loadDatabaseResults = async () => {
    setIsLoading(true);
    try {
      const mockResults = generateAllMockResults(); // Generate more data
      setAllResults(mockResults);
      setFilteredResults(mockResults);
      setSearchResults(mockResults.slice(0, resultsPerPage));
    } catch (error) {
      console.error('Error loading database results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Generate results with different years and courts
  const generateAllMockResults = () => {
    const results = [];
    const years = ['2025', '2024', '2023', '2022', '2021'];
    const courts = ['SUPREME COURT OF INDIA', 'HIGH COURT OF DELHI', 'HIGH COURT OF MUMBAI', 'DISTRICT COURT'];
    const acts = ['Central Excise Act', 'Income Tax Act', 'Criminal Procedure Code', 'Evidence Act', 'Contract Act'];
    
    for (let i = 0; i < 200; i++) { // Generate 200 results
      const randomYear = years[Math.floor(Math.random() * years.length)];
      const randomCourt = courts[Math.floor(Math.random() * courts.length)];
      const randomAct = acts[Math.floor(Math.random() * acts.length)];
      
      results.push({
        id: i + 1,
        title: `${randomAct} -- Price as Sole Consideration`,
        case: `Case ${i + 1} vs. Commissioner ${randomYear} Legal Eagle`,
        content: `For Section 4(1)(a) to apply, price must be the sole consideration, which was not the case in the MOU transactions -- Extended Limitation Cannot be invoked without concrete evidence of suppression or fra...`,
        date: `20 Jan ${randomYear}`,
        court: randomCourt,
        year: randomYear,
        act: randomAct,
        keycode: `SC${1000 + i}`,
        relevanceScore: Math.random() * 100 // For sorting
      });
    }
    return results;
  };

  // NEW: Apply all filters and sorting
  const applyFilters = () => {
    let filtered = [...allResults];

    // Filter by year
    if (sortByYear !== 'By Year') {
      filtered = filtered.filter(result => result.year === sortByYear);
      console.log(`Filtered by year ${sortByYear}:`, filtered.length, 'results');
    }

    // Filter by court
    if (sortByCourt !== 'By Courts') {
      filtered = filtered.filter(result => result.court.includes(sortByCourt.toUpperCase()));
      console.log(`Filtered by court ${sortByCourt}:`, filtered.length, 'results');
    }

    // Filter by text
    if (filterText.trim()) {
      filtered = filtered.filter(result => 
        result.title.toLowerCase().includes(filterText.toLowerCase()) ||
        result.act.toLowerCase().includes(filterText.toLowerCase()) ||
        result.case.toLowerCase().includes(filterText.toLowerCase())
      );
      console.log(`Filtered by text "${filterText}":`, filtered.length, 'results');
    }

    // Sort results
    switch (sortBy) {
      case 'Most Recent':
        filtered.sort((a, b) => parseInt(b.year) - parseInt(a.year));
        break;
      case 'Oldest First':
        filtered.sort((a, b) => parseInt(a.year) - parseInt(b.year));
        break;
      case 'Most Relevance':
      default:
        filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
        break;
    }

    setFilteredResults(filtered);
    setTotalResults(filtered.length);
    setCurrentPage(1); // Reset to first page
    
    // Update displayed results for current page
    const startIndex = 0;
    const endIndex = Math.min(resultsPerPage, filtered.length);
    setSearchResults(filtered.slice(startIndex, endIndex));
    
    console.log('Final filtered results:', filtered.length);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = Math.min(startIndex + resultsPerPage, filteredResults.length);
    setSearchResults(filteredResults.slice(startIndex, endIndex));
    window.scrollTo(0, 0);
  };

  const handleJudgementClick = (keycode) => {
    navigate(`/judgement/${keycode}`);
  };

  // WORKING HANDLERS WITH DATA FILTERING
  const toggleYearDropdown = () => {
    setIsYearDropdownOpen(!isYearDropdownOpen);
    setIsCourtDropdownOpen(false);
    setIsRelevanceDropdownOpen(false);
  };

  const selectYear = (year) => {
    console.log('Year selected:', year);
    setSortByYear(year);
    setIsYearDropdownOpen(false);
    // applyFilters will be called automatically by useEffect
  };

  const toggleCourtDropdown = () => {
    setIsCourtDropdownOpen(!isCourtDropdownOpen);
    setIsYearDropdownOpen(false);
    setIsRelevanceDropdownOpen(false);
  };

  const selectCourt = (court) => {
    console.log('Court selected:', court);
    setSortByCourt(court);
    setIsCourtDropdownOpen(false);
  };

  const toggleRelevanceDropdown = () => {
    setIsRelevanceDropdownOpen(!isRelevanceDropdownOpen);
    setIsYearDropdownOpen(false);
    setIsCourtDropdownOpen(false);
  };

  const selectRelevance = (option) => {
    console.log('Relevance selected:', option);
    setSortBy(option);
    setIsRelevanceDropdownOpen(false);
  };

  // NEW: Refine handler
  const handleRefine = () => {
    console.log('Refining with text:', filterText);
    applyFilters(); // Force reapply filters
  };

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const generatePaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    
    for (let i = 1; i <= Math.min(maxButtons, totalPages); i++) {
      buttons.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    return buttons;
  };

  if (isLoading) {
    return (
      <div className="gojuris-layout">
        <Sidebar />
        <div className="gojuris-main">
          <Navbar />
          <div className="loading-container">
            <i className="bx bx-loader bx-spin"></i>
            <p>Loading database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gojuris-layout">
      <Sidebar />
      
      <div className="gojuris-main">
        <Navbar />

        <div className="database-page">
          {/* Header Section */}
          <div className="database-header">
            <div className="header-content">
              <div className="search-badge">
                <i className="bx bx-search-alt"></i>
                <span>Searches</span>
              </div>
              <h1 className="page-title">Landmark Cases on criminal Law</h1>
              <div className="breadcrumb">
                <span>Home</span>
                <i className="bx bx-chevron-right"></i>
                <span>Search Result</span>
              </div>
            </div>
            <div className="results-count">
              Showing {((currentPage - 1) * resultsPerPage) + 1} - {Math.min(currentPage * resultsPerPage, totalResults)} of {totalResults} Cases Found
            </div>
          </div>

          {/* ACTIVE FILTERS DISPLAY */}
          {(sortByYear !== 'By Year' || sortByCourt !== 'By Courts' || filterText) && (
            <div className="active-filters">
              <span className="filter-label">Active Filters:</span>
              {sortByYear !== 'By Year' && (
                <span className="filter-tag">
                  Year: {sortByYear}
                  <button onClick={() => setSortByYear('By Year')}>×</button>
                </span>
              )}
              {sortByCourt !== 'By Courts' && (
                <span className="filter-tag">
                  Court: {sortByCourt}
                  <button onClick={() => setSortByCourt('By Courts')}>×</button>
                </span>
              )}
              {filterText && (
                <span className="filter-tag">
                  Text: "{filterText}"
                  <button onClick={() => setFilterText('')}>×</button>
                </span>
              )}
            </div>
          )}

          {/* Controls Section */}
          <div className="controls-section">
            {/* Left side - Pagination */}
            <div className="left-controls">
              <div className="pagination-controls">
                {generatePaginationButtons()}
                {totalPages > 5 && (
                  <button 
                    className="page-btn"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    Last
                  </button>
                )}
              </div>
            </div>

            {/* Right side - Filters */}
            <div className="right-controls">
              <div className="filter-row">
                <input
                  type="text"
                  placeholder="Type Act for serching in list"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="filter-input"
                />
                <button className="refine-btn" onClick={handleRefine}>
                  Refine
                </button>
                
                {/* Dropdown Controls */}
                <div className="dropdown-group">
                  {/* Year Dropdown */}
                  <div className="simple-dropdown">
                    <button 
                      className="dropdown-button"
                      onClick={toggleYearDropdown}
                      type="button"
                    >
                      <i className="bx bx-chevron-down"></i>
                      {sortByYear}
                    </button>
                    {isYearDropdownOpen && (
                      <div className="dropdown-list">
                        <button 
                          className="dropdown-option" 
                          onClick={() => selectYear('By Year')}
                          type="button"
                        >
                          All Years
                        </button>
                        <button 
                          className="dropdown-option" 
                          onClick={() => selectYear('2025')}
                          type="button"
                        >
                          2025
                        </button>
                        <button 
                          className="dropdown-option" 
                          onClick={() => selectYear('2024')}
                          type="button"
                        >
                          2024
                        </button>
                        <button 
                          className="dropdown-option" 
                          onClick={() => selectYear('2023')}
                          type="button"
                        >
                          2023
                        </button>
                        <button 
                          className="dropdown-option" 
                          onClick={() => selectYear('2022')}
                          type="button"
                        >
                          2022
                        </button>
                        <button 
                          className="dropdown-option" 
                          onClick={() => selectYear('2021')}
                          type="button"
                        >
                          2021
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Court Dropdown */}
                  <div className="simple-dropdown">
                    <button 
                      className="dropdown-button"
                      onClick={toggleCourtDropdown}
                      type="button"
                    >
                      <i className="bx bx-chevron-down"></i>
                      {sortByCourt}
                    </button>
                    {isCourtDropdownOpen && (
                      <div className="dropdown-list">
                        <button 
                          className="dropdown-option" 
                          onClick={() => selectCourt('By Courts')}
                          type="button"
                        >
                          All Courts
                        </button>
                        <button 
                          className="dropdown-option" 
                          onClick={() => selectCourt('Supreme Court')}
                          type="button"
                        >
                          Supreme Court
                        </button>
                        <button 
                          className="dropdown-option" 
                          onClick={() => selectCourt('High Court')}
                          type="button"
                        >
                          High Court
                        </button>
                        <button 
                          className="dropdown-option" 
                          onClick={() => selectCourt('District Court')}
                          type="button"
                        >
                          District Court
                        </button>
                      </div>
                    )}
                  </div>

                  <button className="history-btn">
                    <i className="bx bx-history"></i>
                    Search History
                  </button>

                  {/* Relevance Dropdown */}
                  <div className="simple-dropdown">
                    <button 
                      className="dropdown-button"
                      onClick={toggleRelevanceDropdown}
                      type="button"
                    >
                      <i className="bx bx-chevron-down"></i>
                      {sortBy}
                    </button>
                    {isRelevanceDropdownOpen && (
                      <div className="dropdown-list">
                        <button 
                          className="dropdown-option" 
                          onClick={() => selectRelevance('Most Relevance')}
                          type="button"
                        >
                          Most Relevance
                        </button>
                        <button 
                          className="dropdown-option" 
                          onClick={() => selectRelevance('Most Recent')}
                          type="button"
                        >
                          Most Recent
                        </button>
                        <button 
                          className="dropdown-option" 
                          onClick={() => selectRelevance('Oldest First')}
                          type="button"
                        >
                          Oldest First
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="results-section">
            {searchResults.length === 0 ? (
              <div className="no-results">
                <h3>No results found</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              searchResults.map((result, index) => (
                <div key={result.id} className="result-card">
                  <div className="result-header">
                    <h3 
                      className="result-title"
                      onClick={() => handleJudgementClick(result.keycode)}
                    >
                      {result.title}
                    </h3>
                  </div>
                  
                  <div className="result-case-info">
                    <em>{result.case}</em>
                  </div>
                  
                  <div className="result-content">
                    {result.content}
                  </div>
                  
                  <div 
                    className="read-more-link"
                    onClick={() => handleJudgementClick(result.keycode)}
                  >
                    Read More.
                  </div>
                  
                  <div className="result-footer">
                    <div className="result-meta">
                      <span className="meta-item">
                        <i className="bx bx-calendar"></i>
                        Date of Decision {result.date}
                      </span>
                      <span className="meta-item">
                        <i className="bx bx-building"></i>
                        {result.court}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .gojuris-layout {
          display: flex;
          min-height: 100vh;
        }

        .gojuris-main {
          flex: 1;
          margin-left: 70px;
          width: calc(100% - 70px);
          background: #f8f9fa;
          min-height: 100vh;
        }

        .database-page {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          font-size: 2rem;
          color: #007bff;
        }

        .database-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e9ecef;
        }

        .header-content {
          flex: 1;
        }

        .search-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 20px;
          color: #007bff;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .page-title {
          font-size: 32px;
          font-weight: 600;
          color: #333;
          margin: 10px 0;
          line-height: 1.2;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6c757d;
          font-size: 14px;
        }

        .breadcrumb i {
          font-size: 12px;
        }

        .results-count {
          background: #f8f9fa;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          color: #495057;
          font-weight: 500;
          flex-shrink: 0;
        }

        /* NEW: Active Filters Display */
        .active-filters {
          margin-bottom: 15px;
          padding: 10px;
          background: #e8f4f8;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-label {
          font-weight: 600;
          color: #495057;
          font-size: 14px;
        }

        .filter-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #007bff;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .filter-tag button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 16px;
          padding: 0;
          margin-left: 5px;
        }

        .controls-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding: 15px 0;
          border-bottom: 1px solid #e9ecef;
        }

        .left-controls {
          flex-shrink: 0;
        }

        .pagination-controls {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .page-btn {
          padding: 8px 12px;
          border: 1px solid #dee2e6;
          background: white;
          color: #495057;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .page-btn:hover {
          background: #e9ecef;
        }

        .page-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .right-controls {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }

        .filter-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .filter-input {
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
          width: 250px;
          background: #f8f9fa;
        }

        .refine-btn {
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .dropdown-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .simple-dropdown {
          position: relative;
          display: inline-block;
        }

        .dropdown-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid #2196f3;
          border-radius: 4px;
          background: #e3f2fd;
          font-size: 14px;
          cursor: pointer;
          color: #1976d2;
          white-space: nowrap;
          min-width: 120px;
          justify-content: space-between;
        }

        .dropdown-button:hover {
          background: #bbdefb;
        }

        .dropdown-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ced4da;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          margin-top: 2px;
          min-width: 150px;
        }

        .dropdown-option {
          display: block;
          width: 100%;
          padding: 8px 12px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          border-bottom: 1px solid #f8f9fa;
          transition: background-color 0.2s ease;
        }

        .dropdown-option:hover {
          background: #f8f9fa;
        }

        .dropdown-option:last-child {
          border-bottom: none;
        }

        .history-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: 1px solid #ced4da;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          color: #495057;
          white-space: nowrap;
        }

        .history-btn:hover {
          background: #f8f9fa;
        }

        .results-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .no-results {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .result-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          transition: box-shadow 0.2s ease;
        }

        .result-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .result-title {
          font-size: 18px;
          font-weight: 600;
          color: #17a2b8;
          margin: 0 0 10px 0;
          cursor: pointer;
          line-height: 1.3;
        }

        .result-title:hover {
          text-decoration: underline;
        }

        .result-case-info {
          font-size: 14px;
          color: #6c757d;
          font-style: italic;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .result-content {
          font-size: 14px;
          color: #495057;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .read-more-link {
          color: #17a2b8;
          font-size: 14px;
          cursor: pointer;
          font-weight: 500;
          margin-bottom: 15px;
        }

        .read-more-link:hover {
          text-decoration: underline;
        }

        .result-footer {
          border-top: 1px solid #f1f3f4;
          padding-top: 12px;
        }

        .result-meta {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #6c757d;
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .meta-item i {
          font-size: 14px;
        }

        @media (max-width: 1200px) {
          .controls-section {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }

          .left-controls,
          .right-controls {
            justify-content: center;
          }

          .filter-row {
            justify-content: center;
            flex-wrap: wrap;
          }

          .dropdown-group {
            flex-wrap: wrap;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .database-page {
            padding: 10px;
          }

          .database-header {
            flex-direction: column;
            gap: 15px;
          }

          .page-title {
            font-size: 24px;
          }

          .filter-input {
            width: 200px;
          }

          .result-meta {
            flex-direction: column;
            gap: 8px;
          }

          .pagination-controls {
            flex-wrap: wrap;
            justify-content: center;
          }

          .dropdown-button {
            min-width: 100px;
          }
        }

        @media (max-width: 575.98px) {
          .gojuris-main {
            margin-left: 60px;
            width: calc(100% - 60px);
          }

          .database-page {
            padding: 5px;
          }

          .result-card {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default Database;