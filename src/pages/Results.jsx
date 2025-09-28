// src/pages/Results.jsx - Complete working version with searchable dropdowns
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ApiService from '../services/apiService';

// Searchable Dropdown Component
const SearchableDropdown = ({ 
  items, 
  selectedItem, 
  onSelect, 
  isOpen, 
  onToggle, 
  placeholder,
  icon,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Clear search term when dropdown closes
  React.useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleItemSelect = (item) => {
    onSelect(item);
    setSearchTerm('');
    onToggle(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    e.stopPropagation();
    
    if (e.key === 'Enter' && filteredItems.length > 0) {
      handleItemSelect(filteredItems[0]);
    }
  };

  return (
    <div className={`dropdown-container ${className}`}>
      <button 
        className="filter-btn dropdown-toggle"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle(!isOpen);
        }}
      >
        {icon && <i className={`${icon} me-1`}></i>}
        {selectedItem}
      </button>
      
      {isOpen && (
        <div className="dropdown-menu searchable-dropdown" style={{ display: 'block' }}>
          {/* Search Input */}
          <div className="dropdown-search-wrapper">
            <input
              type="text"
              className="dropdown-search-input"
              placeholder={`Search ${placeholder?.toLowerCase()}...`}
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
            <i className="bx bx-search dropdown-search-icon"></i>
          </div>

          {/* Filtered Options */}
          <div className="dropdown-options-container">
            {filteredItems.length === 0 ? (
              <div className="no-results">No results found</div>
            ) : (
              filteredItems.map((item, index) => (
                <button
                  key={`${item}-${index}`}
                  className={`dropdown-item ${item === selectedItem ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleItemSelect(item);
                  }}
                >
                  {item}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
  const [searchData, setSearchData] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [refineText, setRefineText] = useState('');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedCourt, setSelectedCourt] = useState('All Courts');
  const [availableYears, setAvailableYears] = useState(['All Years']);
  const [availableCourts, setAvailableCourts] = useState(['All Courts']);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showCourtDropdown, setShowCourtDropdown] = useState(false);

  // API response data
  const [apiCourtsList, setApiCourtsList] = useState([]);
  const [apiYearsList, setApiYearsList] = useState([]);

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
        setSearchData(resultsData.searchData || null);
        
        // NEW: Extract filters from API response
        extractFiltersFromApiResponse(resultsData);
        
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

  // NEW: Extract filter options from API response
  // Updated extractFiltersFromApiResponse function in Results.jsx
const extractFiltersFromApiResponse = (resultsData) => {
  console.log('🔍 Extracting filters from API response:', resultsData);
  
  // Extract years from yearList (API response format)
  if (resultsData.yearList && Array.isArray(resultsData.yearList)) {
    const years = resultsData.yearList
      .map(item => item.key)
      .sort((a, b) => b - a); // Sort newest first
    
    setApiYearsList(resultsData.yearList);
    setAvailableYears(['All Years', ...years]);
    console.log('📅 Available years from API:', years);
  } else {
    // Fallback: extract from results
    extractFiltersFromResults(resultsData.results || []);
  }
  
  // Extract courts from courtsList (API response format)
  if (resultsData.courtsList && Array.isArray(resultsData.courtsList)) {
    // Enhanced court mapping with more comprehensive list
    const courtMap = {
      'SC': 'Supreme Court Of India',
      'PHHC': 'Punjab And Haryana High Court',
      'JK': 'Jammu And Kashmir High Court', 
      'BOM': 'Bombay High Court',
      'DEL': 'Delhi High Court',
      'CAL': 'Calcutta High Court',
      'MAD': 'Madras High Court',
      'KAR': 'Karnataka High Court',
      'AP': 'Andhra Pradesh High Court',
      'TEL': 'Telangana High Court',
      'GUJ': 'Gujarat High Court',
      'RAJ': 'Rajasthan High Court',
      'MP': 'Madhya Pradesh High Court',
      'CHH': 'Chhattisgarh High Court',
      'ORI': 'Orissa High Court',
      'JHA': 'Jharkhand High Court',
      'BIH': 'Patna High Court',
      'ALL': 'Allahabad High Court',
      'UK': 'Uttarakhand High Court',
      'HP': 'Himachal Pradesh High Court',
      'MAN': 'Manipur High Court',
      'MEG': 'Meghalaya High Court',
      'TRI': 'Tripura High Court',
      'SIK': 'Sikkim High Court',
      'GAU': 'Gauhati High Court',
      'KER': 'Kerala High Court'
    };
    
    const courts = resultsData.courtsList
      .map(item => {
        const courtName = courtMap[item.key] || item.key;
        return {
          key: item.key,
          name: courtName,
          count: item.count
        };
      })
      .sort((a, b) => b.count - a.count); // Sort by count (highest first)
    
    setApiCourtsList(resultsData.courtsList);
    
    // Use only the court names for the dropdown
    const courtNames = courts.map(court => court.name);
    setAvailableCourts(['All Courts', ...courtNames]);
    
    console.log('🏛️ Available courts from API:', courts);
  } else {
    // Fallback: extract from results
    extractFiltersFromResults(resultsData.results || []);
  }
};

  // Extract unique years and courts with normalization (fallback)
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
      // In pages/Results.jsx - Update the court filtering logic in the useEffect
// Apply court filter with API court mapping
if (selectedCourt && selectedCourt !== 'All Courts') {
  filtered = filtered.filter(result => {
    if (!result.court) return false;
    
    // Create reverse mapping from display names to API abbreviations
    const displayToApiMap = {
      'Supreme Court Of India': ['SC', 'SUPREME COURT OF INDIA'],
      'Bombay High Court': ['BOM', 'BOMBAY HIGH COURT'],
      'Punjab And Haryana High Court': ['PHHC', 'PUNJAB AND HARYANA HIGH COURT', 'PUNJAB & HARYANA HIGH COURT'],
      'Jammu And Kashmir High Court': ['JK', 'JAMMU AND KASHMIR HIGH COURT', 'JAMMU & KASHMIR HIGH COURT'],
      'Delhi High Court': ['DEL', 'DELHI HIGH COURT'],
      'Calcutta High Court': ['CAL', 'CALCUTTA HIGH COURT'],
      'Madras High Court': ['MAD', 'MADRAS HIGH COURT'],
      'Karnataka High Court': ['KAR', 'KARNATAKA HIGH COURT'],
      'Andhra Pradesh High Court': ['AP', 'ANDHRA PRADESH HIGH COURT'],
      'Telangana High Court': ['TEL', 'TELANGANA HIGH COURT'],
      'Gujarat High Court': ['GUJ', 'GUJARAT HIGH COURT'],
      'Rajasthan High Court': ['RAJ', 'RAJASTHAN HIGH COURT'],
      'Madhya Pradesh High Court': ['MP', 'MADHYA PRADESH HIGH COURT'],
      'Chhattisgarh High Court': ['CHH', 'CHHATTISGARH HIGH COURT'],
      'Orissa High Court': ['ORI', 'ORISSA HIGH COURT'],
      'Jharkhand High Court': ['JHA', 'JHARKHAND HIGH COURT'],
      'Patna High Court': ['BIH', 'PATNA HIGH COURT'],
      'Allahabad High Court': ['ALL', 'ALLAHABAD HIGH COURT'],
      'Uttarakhand High Court': ['UK', 'UTTARAKHAND HIGH COURT'],
      'Himachal Pradesh High Court': ['HP', 'HIMACHAL PRADESH HIGH COURT'],
      'Manipur High Court': ['MAN', 'MANIPUR HIGH COURT'],
      'Meghalaya High Court': ['MEG', 'MEGHALAYA HIGH COURT'],
      'Tripura High Court': ['TRI', 'TRIPURA HIGH COURT'],
      'Sikkim High Court': ['SIK', 'SIKKIM HIGH COURT'],
      'Gauhati High Court': ['GAU', 'GAUHATI HIGH COURT'],
      'Kerala High Court': ['KER', 'KERALA HIGH COURT']
    };
    
    const resultCourtUpper = result.court.toUpperCase().trim();
    const possibleMatches = displayToApiMap[selectedCourt] || [selectedCourt.toUpperCase()];
    
    // Check if result court matches any of the possible variations
    return possibleMatches.some(match => 
      resultCourtUpper.includes(match) || match.includes(resultCourtUpper)
    );
  });
}

      console.log(`Filters applied: ${filtered.length} results from ${allResults.length} total`);
      setFilteredResults(filtered);
    } else {
      // No filters - use all results
      setFilteredResults(allResults);
    }
  }, [refineText, selectedYear, selectedCourt, allResults, currentPage]);

  // Update pagination to handle filter resets
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
          }
          else if (searchType === 'Keyword Search') {
            const apiResponse = await ApiService.searchKeyword(
              searchQuery,
              {
                pageSize: 25,
                page: page,
                sortBy: "relevance",
                sortOrder: "desc"
              }
            );
            
            setDisplayedResults(apiResponse.hits || []);
            setCurrentPage(page);
          }
          else if (searchType === 'Citation Search') {
            const apiResponse = await ApiService.searchCitation(
              searchData,
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

  // In Results.jsx - Update the handleJudgementClick function
const handleJudgementClick = (keycode, event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  if (keycode) {
    // Store navigation data for judgement page
    const currentIndex = displayedResults.findIndex(result => result.keycode === keycode);
    const navigationData = {
      currentIndex: currentIndex,
      results: displayedResults.map(result => ({
        keycode: result.keycode,
        title: formatResultTitle(result),
        court: result.court,
        date: result.date
      })),
      searchQuery: searchQuery,
      totalResults: totalResults,
      currentPage: currentPage
    };
    
    sessionStorage.setItem('judgementNavigation', JSON.stringify(navigationData));
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
            
            {/* NEW: Searchable Year Dropdown */}
            <SearchableDropdown
              items={availableYears}
              selectedItem={selectedYear}
              onSelect={(year) => {
                console.log('Year selected:', year);
                setSelectedYear(year);
                setShowCourtDropdown(false);
              }}
              isOpen={showYearDropdown}
              onToggle={(isOpen) => {
                setShowYearDropdown(isOpen);
                if (isOpen) setShowCourtDropdown(false);
              }}
              placeholder="years"
              icon="bx bx-calendar"
            />

            {/* NEW: Searchable Court Dropdown */}
            <SearchableDropdown
              items={availableCourts}
              selectedItem={selectedCourt}
              onSelect={(court) => {
                console.log('Court selected:', court);
                setSelectedCourt(court);
                setShowYearDropdown(false);
              }}
              isOpen={showCourtDropdown}
              onToggle={(isOpen) => {
                setShowCourtDropdown(isOpen);
                if (isOpen) setShowYearDropdown(false);
              }}
              placeholder="courts"
              icon="bx bx-building"
            />
            
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
                    <div className="result-title-with-accuracy">
                      <span>
                        {((currentPage - 1) * resultsPerPage) + index + 1}. {formatResultTitle(result)}
                      </span>
                      <span className="accuracy-badge">
                        Accuracy: {(result.accuracyPercentage || 0).toFixed(1)}%
                      </span>
                    </div>
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

        .result-title-with-accuracy {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .accuracy-badge {
          font-size: 0.85rem;
          color: #28a745;
          font-weight: 600;
          background: rgba(40, 167, 69, 0.1);
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          flex-shrink: 0;
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

        /* NEW: Searchable dropdown styles */
        .searchable-dropdown {
          padding: 0;
          min-width: 250px;
        }

        .dropdown-search-wrapper {
          position: relative;
          padding: 8px;
          border-bottom: 1px solid #dee2e6;
          background: #f8f9fa;
        }

        .dropdown-search-input {
          width: 100%;
          padding: 6px 10px 6px 28px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 13px;
          outline: none;
          background: white;
          transition: border-color 0.2s ease;
        }

        .dropdown-search-input:focus {
          border-color: var(--gj-primary);
          box-shadow: 0 0 0 2px rgba(var(--gj-primary-rgb), 0.1);
        }

        .dropdown-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          font-size: 14px;
          pointer-events: none;
        }

        .dropdown-options-container {
          max-height: 200px;
          overflow-y: auto;
          padding: 4px 0;
        }

        .no-results {
          padding: 10px 12px;
          color: #6c757d;
          font-style: italic;
          text-align: center;
          font-size: 13px;
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
          border-bottom: 1px solid #f0f0f0;
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
          color: #fff;
          transform: translateY(-1px);
        }

        /* Dark mode support */
        [data-theme="dark"] .dropdown-search-wrapper {
          background: var(--si-secondary);
          border-bottom-color: #334155;
        }

        [data-theme="dark"] .dropdown-search-input {
          background: var(--si-secondary);
          border-color: #334155;
          color: var(--si-dark);
        }

        [data-theme="dark"] .dropdown-search-input:focus {
          border-color: var(--gj-primary);
        }

        [data-theme="dark"] .dropdown-item {
          background: var(--si-secondary);
          color: var(--si-dark);
          border-bottom-color: #334155;
        }

        [data-theme="dark"] .dropdown-item:hover {
          background: #334155;
        }

        [data-theme="dark"] .no-results {
          color: #94a3b8;
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

          .searchable-dropdown {
            min-width: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default Results;