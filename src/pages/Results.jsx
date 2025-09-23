// src/pages/Results.jsx - Complete working version with filters
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ApiService from '../services/apiService';

const Results = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all-courts');
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [displayedResults, setDisplayedResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [searchType, setSearchType] = useState('Search');
  const [isLoading, setIsLoading] = useState(true);
  const [embeddingVector, setEmbeddingVector] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [refineText, setRefineText] = useState('');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedCourt, setSelectedCourt] = useState('All Courts');
  const [availableYears, setAvailableYears] = useState([]);
  const [availableCourts, setAvailableCourts] = useState([]);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showCourtDropdown, setShowCourtDropdown] = useState(false);

  useEffect(() => {
    document.body.style.paddingTop = '0';
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);
    
  useEffect(() => {
    // Load search results from sessionStorage
    const savedResults = sessionStorage.getItem('searchResults');
    
    if (savedResults) {
      try {
        const resultsData = JSON.parse(savedResults);
        const results = resultsData.results || [];
        
        setAllResults(results);
        setFilteredResults(results);
        setDisplayedResults(results);
        setSearchQuery(resultsData.query || '');
        setTotalResults(resultsData.totalCount || results.length);
        setSearchType(resultsData.searchType || 'Search');
        setEmbeddingVector(resultsData.embeddingVector || null);
        
        // Extract unique years and courts from results
        extractFiltersFromResults(results);
        
      } catch (error) {
        console.error('Failed to parse search results:', error);
        setAllResults([]);
        setFilteredResults([]);
        setTotalResults(0);
      }
    } else {
      navigate('/ai-search');
    }
    
    setIsLoading(false);
  }, [navigate]);

  // Extract unique years and courts with normalization
  const extractFiltersFromResults = (results) => {
    const years = new Set();
    const courts = new Set();

    results.forEach(result => {
      // Extract year from date
      if (result.date) {
        try {
          const dateStr = result.date.toString();
          let year = null;
          
          if (dateStr.length === 8) {
            year = dateStr.substring(0, 4);
          } else if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
              year = parts[2];
            }
          } else if (dateStr.includes('-')) {
            year = dateStr.split('-')[0];
          }
          
          if (year && year.length === 4 && !isNaN(year)) {
            years.add(year);
          }
        } catch (error) {
          console.warn('Date parsing error:', error);
        }
      }

      // Normalize court names to Title Case
      if (result.court && typeof result.court === 'string') {
        const cleanCourt = result.court.trim();
        if (cleanCourt) {
          const normalizedCourt = cleanCourt.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          courts.add(normalizedCourt);
        }
      }
    });

    setAvailableYears(['All Years', ...Array.from(years).sort((a, b) => b - a)]);
    setAvailableCourts(['All Courts', ...Array.from(courts).sort()]);
  };

  // Apply filters with better logic
  // FIXED: Apply filters with API pagination support
// FIXED: Apply filters that work with API pagination
useEffect(() => {
  const hasFilters = refineText.trim() || selectedYear !== 'All Years' || selectedCourt !== 'All Courts';
  
  if (hasFilters) {
    // When filters are applied, we need to go back to page 1 and search the full dataset
    // This is because we can't filter API results locally - we only have 25 results at a time
    
    if (currentPage > 1) {
      console.log('Filter applied on page > 1, resetting to page 1');
      setCurrentPage(1);
      return; // Let the page change handle the filtering
    }
    
    // Apply filters to page 1 results
    let filtered = [...allResults];

    // Apply refine text filter
    if (refineText && refineText.trim()) {
      const searchTerm = refineText.trim().toLowerCase();
      filtered = filtered.filter(result => {
        const title = formatResultTitle(result).toLowerCase();
        const court = (result.court || '').toLowerCase();
        const content = formatResultContent(result).toLowerCase();
        const date = formatDate(result).toLowerCase();
        
        return title.includes(searchTerm) || 
               court.includes(searchTerm) || 
               content.includes(searchTerm) ||
               date.includes(searchTerm);
      });
    }

    // Apply year filter
    if (selectedYear && selectedYear !== 'All Years') {
      filtered = filtered.filter(result => {
        if (!result.date) return false;
        
        try {
          const dateStr = result.date.toString();
          let resultYear = null;
          
          if (dateStr.length === 8) {
            resultYear = dateStr.substring(0, 4);
          } else if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
              resultYear = parts[2];
            }
          } else if (dateStr.includes('-')) {
            resultYear = dateStr.split('-')[0];
          }
          
          return resultYear === selectedYear;
        } catch (error) {
          return false;
        }
      });
    }

    // Apply court filter with normalization
    if (selectedCourt && selectedCourt !== 'All Courts') {
      filtered = filtered.filter(result => {
        if (!result.court) return false;
        
        const resultCourt = result.court.trim().toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return resultCourt === selectedCourt;
      });
    }

    console.log(`Filters applied: ${filtered.length} results from ${allResults.length} total`);
    setFilteredResults(filtered);
  } else {
    // No filters - use all results
    setFilteredResults(allResults);
  }
}, [refineText, selectedYear, selectedCourt, allResults, currentPage]);

// FIXED: Update pagination to handle filter resets
useEffect(() => {
  const hasFilters = refineText.trim() || selectedYear !== 'All Years' || selectedCourt !== 'All Courts';
  
  if (hasFilters) {
    // Use filtered results for pagination (local only)
    const total = Math.ceil(filteredResults.length / resultsPerPage);
    setTotalPages(total);
    
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    setDisplayedResults(filteredResults.slice(startIndex, endIndex));
  } else {
    // Use total API results for pagination
    const total = Math.ceil(totalResults / resultsPerPage);
    setTotalPages(total);
    
    // Only update displayedResults if we're on page 1 or if we just cleared filters
    if (currentPage === 1 && allResults.length > 0) {
      setDisplayedResults(allResults);
    }
  }
}, [filteredResults, currentPage, resultsPerPage, totalResults]);
  // Handle pagination with API calls
  const handlePageChange = async (page) => {
    if (page >= 1 && page <= totalPages && !isLoading) {
      setIsLoading(true);
      
      try {
        const hasFilters = refineText.trim() || selectedYear !== 'All Years' || selectedCourt !== 'All Courts';
        
        if (hasFilters) {
          const startIndex = (page - 1) * resultsPerPage;
          const endIndex = startIndex + resultsPerPage;
          setDisplayedResults(filteredResults.slice(startIndex, endIndex));
          setCurrentPage(page);
        } else {
          if (embeddingVector && searchType === 'AI Search') {
            const apiResponse = await ApiService.searchWithAI(
              searchQuery, 
              embeddingVector, 
              {
                pageSize: 25,
                page: page,
                sortBy: "relevance",
                sortOrder: "desc"
              }
            );
            
            setDisplayedResults(apiResponse.hits || []);
            setCurrentPage(page);
          } else {
            const startIndex = (page - 1) * resultsPerPage;
            const endIndex = startIndex + resultsPerPage;
            setDisplayedResults(allResults.slice(startIndex, endIndex));
            setCurrentPage(page);
          }
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
      } catch (error) {
        console.error('Pagination failed:', error);
        const startIndex = (page - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        setDisplayedResults(allResults.slice(startIndex, endIndex));
        setCurrentPage(page);
      }
      
      setIsLoading(false);
    }
  };

  const handleRefineSearch = () => {
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setRefineText('');
    setSelectedYear('All Years');
    setSelectedCourt('All Courts');
    setCurrentPage(1);
  };

  const generatePaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-btn ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  // Format functions
  const formatResultContent = (result) => {
    let content = '';
    
    if (result.headnoteAll) {
      content = result.headnoteAll;
    } else if (result.newHeadnote) {
      content = result.newHeadnote;
    } else if (result.issueForConsideration) {
      content = result.issueForConsideration;
    } else if (result.lawPoint) {
      content = result.lawPoint;
    } else if (result.held) {
      content = result.held;
    } else {
      content = 'Content not available';
    }
    
    return content.length > 400 ? content.substring(0, 400) + '...' : content;
  };

  const formatResultTitle = (result) => {
    if (result.appellant && result.respondent) {
      return `${result.appellant} vs ${result.respondent}`;
    }
    
    if (result.keycode) {
      return `Case ${result.keycode}`;
    }
    
    return 'Legal Case';
  };

  const formatCourt = (result) => {
    return result.court || 'Court not specified';
  };

  const formatDate = (result) => {
    if (result.date) {
      try {
        const dateStr = result.date.toString();
        if (dateStr.length === 8) {
          const year = dateStr.substring(0, 4);
          const month = dateStr.substring(4, 6);
          const day = dateStr.substring(6, 8);
          return `${day}/${month}/${year}`;
        }
        return result.date;
      } catch {
        return result.date;
      }
    }
    return 'Date not available';
  };

  const handleJudgementClick = (keycode, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (keycode) {
      navigate(`/judgement/${keycode}`);
    }
  };

  const highlightText = (text, query) => {
    if (!text || !query) return { __html: text };
    
    const words = query.toLowerCase().split(' ').filter(word => word.length > 2);
    let highlightedText = text;
    
    words.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });
    
    return { __html: highlightedText };
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
              <p className="mt-2">Loading search results...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasFilters = refineText.trim() || selectedYear !== 'All Years' || selectedCourt !== 'All Courts';
  const currentDisplayCount = hasFilters ? filteredResults.length : totalResults;

  return (
    <div className="gojuris-layout">
      <Sidebar />
      
      <div className="gojuris-main">
        <Navbar />

        {/* Header Section */}
        <div className="results-header-section">
          <div className="results-main-info">
            <h1 className="results-main-title">{searchQuery || 'Search Results'}</h1>
            <div className="results-breadcrumb">
              <span className="breadcrumb-item">
                <i className="bx bx-search-alt me-1"></i>
                Searches
              </span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item">Search Result</span>
            </div>
          </div>
          <div className="results-count-badge">
            Showing {((currentPage - 1) * resultsPerPage) + 1} - {Math.min(currentPage * resultsPerPage, currentDisplayCount)} of {currentDisplayCount} Cases Found
          </div>
        </div>

        {/* Controls Section */}
        <div className="controls-section">
          <div className="pagination-controls">
            {currentPage > 1 && (
              <button className="page-btn" onClick={() => handlePageChange(currentPage - 1)}>
                Previous
              </button>
            )}
            
            {generatePaginationButtons()}
            
            {currentPage < totalPages && (
              <button className="page-btn" onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            )}
            
            {totalPages > 1 && (
              <button className="page-btn" onClick={() => handlePageChange(totalPages)}>
                Last
              </button>
            )}
          </div>

          <div className="filter-actions">
            <div className="search-type-field">
              <input 
                type="text" 
                placeholder="Type to search in results" 
                className="act-search-input"
                value={refineText}
                onChange={(e) => setRefineText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRefineSearch()}
              />
            </div>
            
            <button className="refine-btn" onClick={handleRefineSearch}>
              Refine
            </button>
            
          {/* WORKING Year Dropdown */}
<div className="dropdown-container">
  <button 
    className="filter-btn dropdown-toggle"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Year dropdown clicked, current state:', showYearDropdown);
      setShowYearDropdown(!showYearDropdown);
      setShowCourtDropdown(false);
    }}
  >
    <i className="bx bx-calendar me-1"></i>
    {selectedYear}
  </button>
  {showYearDropdown && (
    <div className="dropdown-menu" style={{ display: 'block' }}>
      {availableYears.map((year, index) => (
        <button
          key={`year-${index}`}
          className={`dropdown-item ${year === selectedYear ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Year selected:', year);
            setSelectedYear(year);
            setShowYearDropdown(false);
          }}
        >
          {year}
        </button>
      ))}
    </div>
  )}
</div>

{/* WORKING Court Dropdown */}
<div className="dropdown-container">
  <button 
    className="filter-btn dropdown-toggle"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Court dropdown clicked, current state:', showCourtDropdown);
      setShowCourtDropdown(!showCourtDropdown);
      setShowYearDropdown(false);
    }}
  >
    <i className="bx bx-building me-1"></i>
    {selectedCourt}
  </button>
  {showCourtDropdown && (
    <div className="dropdown-menu" style={{ display: 'block' }}>
      {availableCourts.map((court, index) => (
        <button
          key={`court-${index}`}
          className={`dropdown-item ${court === selectedCourt ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Court selected:', court);
            setSelectedCourt(court);
            setShowCourtDropdown(false);
          }}
        >
          {court}
        </button>
      ))}
    </div>
  )}
</div>
            
            <button className="filter-btn">
              <i className="bx bx-history me-1"></i>
              Search History
            </button>
            
            <button className="filter-btn dropdown-toggle">
              <i className="bx bx-sort me-1"></i>
              Most Relevance
            </button>
          </div>
        </div>

        <div className="search-results">
          {displayedResults.length === 0 ? (
            <div className="no-results">
              <div className="text-center py-5">
                <i className="bx bx-search-alt" style={{ fontSize: '3rem', color: 'var(--gj-gray)' }}></i>
                <h4 className="mt-3">No Results Found</h4>
                <p className="text-muted">Try adjusting your search filters</p>
                <button 
                  className="btn btn-primary mt-3"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            displayedResults.map((result, index) => (
              <div key={result.keycode || index} className="result-item">
                <div className="result-header">
                  <h3 
                    className="result-title"
                    onClick={(e) => handleJudgementClick(result.keycode, e)}
                    style={{ 
                      cursor: result.keycode ? 'pointer' : 'default',
                      color: result.keycode ? 'var(--gj-primary)' : 'inherit'
                    }}
                    title={result.keycode ? 'Click to view full judgement' : ''}
                  >
                    {((currentPage - 1) * resultsPerPage) + index + 1}. {formatResultTitle(result)}
                  </h3>
                </div>

                <div className="result-meta">
                  <span>
                    <i className="bx bx-building"></i>
                    {formatCourt(result)}
                  </span>
                  <span>
                    <i className="bx bx-calendar"></i>
                    {formatDate(result)}
                  </span>
                  {result.keycode && (
                    <span>
                      <i className="bx bx-file"></i>
                      {result.keycode}
                    </span>
                  )}
                </div>

                <div 
                  className="result-content"
                  dangerouslySetInnerHTML={highlightText(formatResultContent(result), searchQuery + ' ' + refineText)}
                />

                {result.keycode && (
                  <div className="result-actions">
                    <button 
                      className="read-judgement"
                      onClick={(e) => handleJudgementClick(result.keycode, e)}
                    >
                      <i className="bx bx-book-open"></i>
                      Read Full Judgement
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
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

        .results-header-section {
          background: white;
          padding: 2rem;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .results-main-info h1 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .results-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          color: #6c757d;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
        }

        .breadcrumb-separator {
          color: #adb5bd;
        }

        .results-count-badge {
          font-size: 0.9rem;
          color: #6c757d;
          font-weight: 500;
        }

        .controls-section {
          background: white;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .pagination-controls {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .page-btn {
          background: white;
          border: 1px solid #dee2e6;
          color: #495057;
          padding: 0.375rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .page-btn:hover {
          background: #e9ecef;
          border-color: #adb5bd;
        }

        .page-btn.active {
          background: var(--gj-primary);
          border-color: var(--gj-primary);
          color: white;
        }

        .filter-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .act-search-input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          font-size: 0.875rem;
          min-width: 200px;
        }

        .refine-btn {
          background: #8b5cf6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .refine-btn:hover {
          background: #8b5cf6;
        }

        .dropdown-container {
          position: relative;
        }

        .filter-btn {
          background: white;
          border: 1px solid #dee2e6;
          color: #17a2b8;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .filter-btn:hover {
          background: #e9ecef;
          border-color: #17a2b8;
        }

        .filter-btn.dropdown-toggle::after {
          content: '▼';
          font-size: 0.7rem;
          margin-left: 0.25rem;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          min-width: 200px;
          max-height: 300px;
          overflow-y: auto;
        }

        .dropdown-item {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background 0.2s ease;
        }

        .dropdown-item:hover {
          background: #f8f9fa;
        }

        .dropdown-item.active {
          background: var(--gj-primary);
          color: white;
        }

        .search-results {
          padding: 2rem;
          background: #f8f9fa;
        }

        .result-item {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .result-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(var(--gj-primary-rgb), 0.15);
          border-color: var(--gj-primary);
        }

        .result-title {
          color: var(--gj-primary);
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .result-title:hover {
          color: var(--gj-secondary);
          text-decoration: underline;
        }

        .result-meta {
          display: flex;
          gap: 2rem;
          margin-bottom: 1rem;
          font-size: 14px;
          color: #6c757d;
          flex-wrap: wrap;
        }

        .result-meta span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .result-meta i {
          color: var(--gj-primary);
        }

        .result-content {
          line-height: 1.6;
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 15px;
        }

        .result-content mark {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(217, 70, 239, 0.2));
          color: var(--gj-primary);
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          font-weight: 600;
        }

        .read-judgement {
          background: var(--gj-primary);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }

        .read-judgement:hover {
          background: #8b5cf6;
          color:#fff;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .gojuris-main {
            margin-left: 0;
            width: 100%;
          }

          .results-header-section {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
            padding: 1rem;
          }

          .results-main-info h1 {
            font-size: 1.2rem;
          }

          .controls-section {
            flex-direction: column;
            align-items: stretch;
            padding: 1rem;
          }

          .filter-actions {
            justify-content: center;
          }

          .act-search-input {
            min-width: 100%;
          }

          .result-meta {
            flex-direction: column;
            gap: 0.5rem;
          }

          .search-results {
            padding: 1rem;
          }

          .dropdown-menu {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default Results;