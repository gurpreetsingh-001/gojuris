// src/pages/Search.jsx - Updated without Header, only Navbar
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ApiService from '../services/apiService';

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('All Courts Selected');
  const [activeSearchType, setActiveSearchType] = useState('all-words');
  const [isCourtDropdownOpen, setIsCourtDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    appellant: '',
    respondent: '',
    judge: '',
    advocate: '',
    caseNo: ''
  });

  useEffect(() => {
    // No padding needed for navbar
    document.body.style.paddingTop = '0';
    
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  const searchTypes = [
    { id: 'all-words', label: 'All Words' },
    { id: 'exact-phrase', label: 'Exact Phrase' },
    { id: 'near', label: 'Near' },
    { id: 'magic-search', label: 'Magic Search' }
  ];

  const courts = [
    'All Courts Selected',
    'Supreme Court',
    'High Court',
    'District Court',
    'Family Court',
    'Consumer Court'
  ];

  const sortOptions = [
    'Most Relevant',
    'Most Recent',
    'Oldest First',
    'Alphabetical'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async (searchType = 'all') => {
    setIsLoading(true);
    setError('');

    try {
      console.log('🔍 Starting Advanced Search...');
      console.log('Search type:', searchType);
      console.log('Form data:', formData);
      console.log('Selected court:', selectedCourt);

      // Build search payload
      const searchPayload = {
        query: searchQuery,
        pageSize: 25,
        page: 0,
        sortBy: sortBy === 'Most Recent' ? 'date' : 'relevance',
        sortOrder: sortBy === 'Oldest First' ? 'asc' : 'desc',
        filters: {
          court: selectedCourt !== 'All Courts Selected' ? selectedCourt : null,
          appellant: formData.appellant || null,
          respondent: formData.respondent || null,
          judge: formData.judge || null,
          advocate: formData.advocate || null,
          caseNo: formData.caseNo || null
        }
      };

      // Use your API service for search
      const apiResponse = await ApiService.searchJudgements(searchPayload);
      const searchResults = apiResponse.results || apiResponse.hits || [];
      const totalCount = apiResponse.total || searchResults.length;

      if (searchResults.length === 0) {
        setError('No results found. Try different search criteria.');
        setIsLoading(false);
        return;
      }

      // Store results
      const resultsData = {
        query: searchQuery || 'Advanced Search',
        results: searchResults,
        totalCount: totalCount,
        searchType: 'Advanced Search',
        timestamp: new Date().toISOString()
      };

      sessionStorage.setItem('searchResults', JSON.stringify(resultsData));
      navigate('/results');

    } catch (error) {
      console.error('❌ Advanced Search failed:', error);
      setError(error.message || 'Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFields = () => {
    setFormData({
      appellant: '',
      respondent: '',
      judge: '',
      advocate: '',
      caseNo: ''
    });
    setSearchQuery('');
    setError('');
  };

  return (
    <div className="gojuris-layout">
      <Sidebar />
      
      <div className="gojuris-main">
        <Navbar />

        <div className="search-content">
          {error && (
            <div className="alert alert-danger mx-3" role="alert">
              <i className="bx bx-error-circle me-2"></i>
              {error}
            </div>
          )}
          
          <div className="search-header">
            <div className="search-badge">
              <i className="bx bx-search-alt-2"></i>
              <span>Advanced Search</span>
            </div>
          </div>
          
          <div className="search-hero">
            <h1 className="search-main-title">
              Precise legal research with detailed filters
            </h1>
            
            <div className="search-form-card">
              {/* Main Search Input */}
              <div className="main-search-section">
                <div className="search-input-row">
                  <input
                    type="text"
                    className="main-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter your legal query..."
                    disabled={isLoading}
                  />
                  
                  <div className="sort-dropdown-wrapper">
                    <button
                      className="sort-dropdown-btn"
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                      disabled={isLoading}
                    >
                      {sortBy}
                      <i className="bx bx-chevron-down"></i>
                    </button>
                    
                    {isSortDropdownOpen && (
                      <>
                        <div 
                          className="dropdown-backdrop"
                          onClick={() => setIsSortDropdownOpen(false)}
                        />
                        <div className="sort-dropdown">
                          {sortOptions.map((option) => (
                            <button
                              key={option}
                              className="sort-option"
                              onClick={() => {
                                setSortBy(option);
                                setIsSortDropdownOpen(false);
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Search Type Buttons */}
                <div className="search-type-buttons">
                  {searchTypes.map((type) => (
                    <button
                      key={type.id}
                      className={`search-type-btn ${activeSearchType === type.id ? 'active' : ''}`}
                      onClick={() => setActiveSearchType(type.id)}
                      disabled={isLoading}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="form-fields-section">
                <div className="form-fields-grid">
                  <div className="form-field-group">
                    <input
                      type="text"
                      className="form-field-input"
                      placeholder="Appellant"
                      value={formData.appellant}
                      onChange={(e) => handleInputChange('appellant', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-field-group">
                    <input
                      type="text"
                      className="form-field-input"
                      placeholder="Respondent"
                      value={formData.respondent}
                      onChange={(e) => handleInputChange('respondent', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-field-group">
                    <input
                      type="text"
                      className="form-field-input"
                      placeholder="Judge"
                      value={formData.judge}
                      onChange={(e) => handleInputChange('judge', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-field-group">
                    <input
                      type="text"
                      className="form-field-input"
                      placeholder="Advocate"
                      value={formData.advocate}
                      onChange={(e) => handleInputChange('advocate', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-field-group">
                    <input
                      type="text"
                      className="form-field-input"
                      placeholder="Case No."
                      value={formData.caseNo}
                      onChange={(e) => handleInputChange('caseNo', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="form-field-group">
                    <div className="court-dropdown-wrapper">
                      <button
                        className="court-dropdown-btn"
                        onClick={() => setIsCourtDropdownOpen(!isCourtDropdownOpen)}
                        disabled={isLoading}
                      >
                        {selectedCourt}
                        <i className="bx bx-chevron-down"></i>
                      </button>
                      
                      {isCourtDropdownOpen && (
                        <>
                          <div 
                            className="dropdown-backdrop"
                            onClick={() => setIsCourtDropdownOpen(false)}
                          />
                          <div className="court-dropdown">
                            {courts.map((court) => (
                              <button
                                key={court}
                                className="court-option"
                                onClick={() => {
                                  setSelectedCourt(court);
                                  setIsCourtDropdownOpen(false);
                                }}
                              >
                                {court}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Info */}
              <div className="search-info-section">
                <p className="search-remaining">You have advanced searches remaining.</p>
                <a href="#" className="upgrade-link">Upgrade Plan</a>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons-section">
                <button 
                  className="search-action-btn primary"
                  onClick={() => handleSearch('supreme-court')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="bx bx-loader bx-spin"></i>
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-search"></i>
                      Search in Supreme Court
                    </>
                  )}
                </button>
                <button 
                  className="search-action-btn primary"
                  onClick={() => handleSearch('all')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="bx bx-loader bx-spin"></i>
                      Searching All...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-search"></i>
                      Search All
                    </>
                  )}
                </button>
                <button 
                  className="search-action-btn secondary"
                  onClick={handleClearFields}
                  disabled={isLoading}
                >
                  <i className="bx bx-refresh"></i>
                  Clear Fields
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
       <style jsx>{`

       /* Search Page Layout - Only Sidebar + Navbar */
.gojuris-layout {
  display: flex;
  min-height: 100vh;
}

.gojuris-main {
  flex: 1;
  margin-left: 70px;
  width: calc(100% - 70px);
  background: #ffffff;
  min-height: 100vh;
}

/* Search Content */
.search-content {
  padding: 2rem;
  background: var(--gj-background);
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.search-header {
  margin-bottom: 2rem;
  text-align: center;
}

.search-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid var(--gj-border);
  border-radius: 20px;
  color: var(--gj-primary);
  font-weight: 500;
  font-size: 14px;
}

.search-hero {
  margin-bottom: 3rem;
  text-align: center;
  width: 100%;
  max-width: 1000px;
}

.search-main-title {
  font-size: clamp(1.8rem, 6vw, 2.5rem);
  font-weight: 700;
  color: var(--gj-dark);
  line-height: 1.2;
  margin-bottom: 2rem;
}

.search-form-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
}

/* Main Search Section */
.main-search-section {
  margin-bottom: 2rem;
}

.search-input-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1.5rem;
}

.main-search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f8f9fa;
  outline: none;
  transition: all 0.2s ease;
}

.main-search-input:focus {
  border-color: var(--gj-primary);
  background-color: white;
  box-shadow: 0 0 0 3px rgba(var(--gj-primary-rgb), 0.1);
}

/* Sort Dropdown */
.sort-dropdown-wrapper {
  position: relative;
  width: 100%;
}

.sort-dropdown-btn {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  color: #6c757d;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-dropdown-btn:hover {
  border-color: #b0b7c3;
}

.sort-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 4px;
}

.sort-option {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: white;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.sort-option:hover {
  background: #f8f9fa;
}

/* Search Type Buttons */
.search-type-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.search-type-btn {
  padding: 8px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  background: white;
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.search-type-btn:hover {
  border-color: var(--gj-primary);
  color: var(--gj-primary);
}

.search-type-btn.active {
  background: var(--gj-primary);
  border-color: var(--gj-primary);
  color: white;
}

/* Form Fields */
.form-fields-section {
  margin-bottom: 1.5rem;
}

.form-fields-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.form-field-group {
  display: flex;
  flex-direction: column;
}

.form-field-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f8f9fa;
  outline: none;
  transition: all 0.2s ease;
}

.form-field-input:focus {
  border-color: var(--gj-primary);
  background-color: white;
  box-shadow: 0 0 0 3px rgba(var(--gj-primary-rgb), 0.1);
}

/* Court Dropdown */
.court-dropdown-wrapper {
  position: relative;
  width: 100%;
}

.court-dropdown-btn {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: #f8f9fa;
  color: var(--gj-dark);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.court-dropdown-btn:focus,
.court-dropdown-btn:hover {
  border-color: var(--gj-primary);
  background: white;
}

.court-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.court-option {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: white;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.court-option:hover {
  background: #f8f9fa;
}

/* Search Info */
.search-info-section {
  text-align: center;
  margin-bottom: 1.5rem;
}

.search-remaining {
  color: var(--gj-gray);
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.upgrade-link {
  color: var(--gj-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
}

.upgrade-link:hover {
  text-decoration: underline;
}

/* Action Buttons */
.action-buttons-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.search-action-btn {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  min-width: 200px;
  font-size: 0.95rem;
}

.search-action-btn.primary {
  background: var(--gj-primary);
  color: white;
}

.search-action-btn.primary:hover {
  background: #7c3aed;
  transform: translateY(-1px);
}

.search-action-btn.secondary {
  background: #f8f9fa;
  color: var(--gj-dark);
  border: 1px solid var(--gj-border);
}

.search-action-btn.secondary:hover {
  background: #e9ecef;
  border-color: var(--gj-primary);
}

.search-action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Dropdown backdrop */
.dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

/* Responsive */
@media (min-width: 576px) {
  .search-input-row {
    flex-direction: row;
    align-items: center;
  }
  
  .sort-dropdown-wrapper {
    width: auto;
    min-width: 200px;
  }
  
  .action-buttons-section {
    flex-direction: row;
    justify-content: center;
  }
  
  .search-action-btn {
    width: auto;
    min-width: 180px;
  }
}

@media (min-width: 768px) {
  .search-form-card {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .form-fields-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 991.98px) {
  .gojuris-main {
    margin-left: 60px;
    width: calc(100% - 60px);
  }
  
  .search-content {
    padding: 1rem;
  }
  
  .search-form-card {
    padding: 1.5rem;
  }
  
  .form-fields-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-action-btn {
    min-width: auto;
    width: 100%;
  }
}
       `}</style>
    </div>
  );
};

export default Search;