// src/pages/Search.jsx - Modern themed advance search with 2-column layout
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ApiService from '../services/apiService';

const Search = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data for all search fields
  const [formData, setFormData] = useState({
    // Citations
    journal: '',
    year: '',
    volume: '',
    page: '',
    
    // Party Names
    appellant: '',
    respondent: '',
    caseNo: '',
    
    // Judge Name
    judges: '',
    searchJudgeType: 'exact',
    
    // Advocate Name
    advocates: '',
    
    // Subject and Topic
    queryText: '',
    exactPhrase: false,
    free: false,
    near: false,
    magicSearch: true,
    stateFavourCases: false,
    searchOrder: 'most-recent',
    headnote: true,
    fulltext: true,
    selectedCourts: {
      all: true,
      supremeCourt: true,
      privyCouncil: true,
      allahabad: true,
      apHigh: true
    },
    bench: 'All',
    
    // Acts and Sections
    acts: '',
    section: '',
    
    // Date Range
    dateWiseSearch: false,
    dateFrom: '01-01-1950',
    dateTo: '24-09-2025'
  });

  useEffect(() => {
    document.body.style.paddingTop = '0';
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleCourtChange = (court, checked) => {
    setFormData(prev => ({
      ...prev,
      selectedCourts: {
        ...prev.selectedCourts,
        [court]: checked
      }
    }));
  };

  const handleUnselectAllCourts = () => {
    setFormData(prev => ({
      ...prev,
      selectedCourts: {
        all: false,
        supremeCourt: false,
        privyCouncil: false,
        allahabad: false,
        apHigh: false
      }
    }));
  };

  const handleSearch = async (searchType) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('🔍 Starting Advanced Search...', searchType);
      
      const searchPayload = {
        query: formData.queryText || 'Advanced Search',
        pageSize: 25,
        page: 0,
        sortBy: 'relevance',
        sortOrder: 'desc',
        filters: formData
      };

      const apiResponse = await ApiService.searchJudgements(searchPayload);
      const searchResults = apiResponse.results || apiResponse.hits || [];
      const totalCount = apiResponse.total || searchResults.length;

      if (searchResults.length === 0) {
        setError('No results found. Try different search criteria.');
        setIsLoading(false);
        return;
      }

      const resultsData = {
        query: formData.queryText || 'Advanced Search',
        results: searchResults,
        totalCount: totalCount,
        searchType: searchType === 'sc' ? 'Supreme Court Search' : 'All Courts Search',
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

  const handleClear = () => {
    setFormData({
      journal: '',
      year: '',
      volume: '',
      page: '',
      appellant: '',
      respondent: '',
      caseNo: '',
      judges: '',
      searchJudgeType: 'exact',
      advocates: '',
      queryText: '',
      exactPhrase: false,
      free: false,
      near: false,
      magicSearch: true,
      stateFavourCases: false,
      searchOrder: 'most-recent',
      headnote: true,
      fulltext: true,
      selectedCourts: {
        all: true,
        supremeCourt: true,
        privyCouncil: true,
        allahabad: true,
        apHigh: true
      },
      bench: 'All',
      acts: '',
      section: '',
      dateWiseSearch: false,
      dateFrom: '01-01-1950',
      dateTo: '24-09-2025'
    });
  };

  const handleResetDate = () => {
    setFormData(prev => ({
      ...prev,
      dateFrom: '01-01-1950',
      dateTo: '24-09-2025'
    }));
  };

  return (
    <div className="gojuris-layout">
      <Sidebar />
      
      <div className="gojuris-main">
        <Navbar />

        <div className="advance-search-page">
          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">Advanced Search</h1>
            <p className="page-subtitle">Search through comprehensive legal database with advanced filters</p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="bx bx-error-circle"></i>
              {error}
            </div>
          )}

          {/* Main Content Grid */}
          <div className="search-container">
            {/* Left Column */}
            <div className="left-column">
              {/* Search Cases by Citations */}
              <div className="search-card">
                <div className="card-header">
                  <h3 className="card-title">Search Cases by Citations</h3>
                </div>
                <div className="card-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Journal</label>
                      <select 
                        className="form-select"
                        value={formData.journal}
                        onChange={(e) => handleInputChange('journal', e.target.value)}
                      >
                        <option value="">Select Journal</option>
                        <option value="AIR">AIR</option>
                        <option value="SCC">SCC</option>
                        <option value="SCR">SCR</option>
                        <option value="CrLJ">CrLJ</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Year</label>
                      <select 
                        className="form-select"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                      >
                        <option value="">Select Year</option>
                        {Array.from({length: 75}, (_, i) => 2025 - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Volume</label>
                      <select 
                        className="form-select"
                        value={formData.volume}
                        onChange={(e) => handleInputChange('volume', e.target.value)}
                      >
                        <option value="">Select Volume</option>
                        {Array.from({length: 50}, (_, i) => i + 1).map(vol => (
                          <option key={vol} value={vol}>{vol}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Page</label>
                      <input 
                        type="text"
                        className="form-input"
                        placeholder="Page number"
                        value={formData.page}
                        onChange={(e) => handleInputChange('page', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Cases by Party Name */}
              <div className="search-card">
                <div className="card-header">
                  <h3 className="card-title">Search Cases by Party Name</h3>
                </div>
                <div className="card-content">
                  <div className="checkbox-options">
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Enable Autocomplete
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Enable Spelling Variations
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Appellant</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Enter appellant name"
                      value={formData.appellant}
                      onChange={(e) => handleInputChange('appellant', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Respondent</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Enter respondent name"
                      value={formData.respondent}
                      onChange={(e) => handleInputChange('respondent', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Case Number</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Enter case number"
                      value={formData.caseNo}
                      onChange={(e) => handleInputChange('caseNo', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Search Cases by Judge Name */}
              <div className="search-card">
                <div className="card-header">
                  <h3 className="card-title">Search Cases by Judge Name</h3>
                </div>
                <div className="card-content">
                  <div className="form-group">
                    <label className="form-label">Judge Name</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Enter judge name"
                      value={formData.judges}
                      onChange={(e) => handleInputChange('judges', e.target.value)}
                    />
                  </div>
                  <div className="radio-options">
                    <label className="radio-label">
  <input 
    type="radio" 
    name="judgeSearch" 
    value="exact"
    checked={formData.searchJudgeType === 'exact'}
    onChange={(e) => handleInputChange('searchJudgeType', e.target.value)}
  />
  <span className="radio-mark"></span>
  Exact Match
</label>
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="judgeSearch" 
                        value="free"
                        checked={formData.searchJudgeType === 'free'}
                        onChange={(e) => handleInputChange('searchJudgeType', e.target.value)}
                      />
                      <span className="radio-mark"></span>
                      Free Search
                    </label>
                  </div>
                </div>
              </div>

              {/* Search Cases by Advocate Name */}
              <div className="search-card">
                <div className="card-header">
                  <h3 className="card-title">Search Cases by Advocate Name</h3>
                </div>
                <div className="card-content">
                  <div className="form-group">
                    <label className="form-label">Advocate Name</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Enter advocate name"
                      value={formData.advocates}
                      onChange={(e) => handleInputChange('advocates', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="right-column">
              {/* Search Cases by Subject And Topic */}
              <div className="search-card">
                <div className="card-header">
                  <h3 className="card-title">Search Cases by Subject And Topic</h3>
                </div>
                <div className="card-content">
                  <div className="search-options">
                   <label className="checkbox-label">
  <input 
    type="checkbox" 
    checked={formData.exactPhrase}
    onChange={(e) => handleCheckboxChange('exactPhrase', e.target.checked)}
  />
  <span className="checkmark"></span>
  Exact Phrase
</label>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={formData.free}
                        onChange={(e) => handleCheckboxChange('free', e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      Free Search
                    </label>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={formData.near}
                        onChange={(e) => handleCheckboxChange('near', e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      Near
                    </label>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={formData.magicSearch}
                        onChange={(e) => handleCheckboxChange('magicSearch', e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      Magic Search
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Type your Query Here</label>
                    <textarea 
                      className="form-textarea"
                      rows="4"
                      placeholder="Enter your search query here..."
                      value={formData.queryText}
                      onChange={(e) => handleInputChange('queryText', e.target.value)}
                    />
                  </div>

                  <div className="search-preferences">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={formData.stateFavourCases}
                        onChange={(e) => handleCheckboxChange('stateFavourCases', e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      State Favour Cases
                    </label>
                    
                    <div className="radio-grid">
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="searchOrder" 
                          value="most-recent"
                          checked={formData.searchOrder === 'most-recent'}
                          onChange={(e) => handleInputChange('searchOrder', e.target.value)}
                        />
                        <span className="radio-mark"></span>
                        Most Recent
                      </label>
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="searchOrder" 
                          value="least-recent"
                          checked={formData.searchOrder === 'least-recent'}
                          onChange={(e) => handleInputChange('searchOrder', e.target.value)}
                        />
                        <span className="radio-mark"></span>
                        Least Recent
                      </label>
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="searchOrder" 
                          value="most-relevant"
                          checked={formData.searchOrder === 'most-relevant'}
                          onChange={(e) => handleInputChange('searchOrder', e.target.value)}
                        />
                        <span className="radio-mark"></span>
                        Most Relevant
                      </label>
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="searchOrder" 
                          value="most-referred"
                          checked={formData.searchOrder === 'most-referred'}
                          onChange={(e) => handleInputChange('searchOrder', e.target.value)}
                        />
                        <span className="radio-mark"></span>
                        Most Referred
                      </label>
                    </div>

                    <div className="content-types">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={formData.headnote}
                          onChange={(e) => handleCheckboxChange('headnote', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Headnote
                      </label>
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={formData.fulltext}
                          onChange={(e) => handleCheckboxChange('fulltext', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Full Text
                      </label>
                    </div>
                  </div>

                  {/* Courts Selection */}
                  <div className="courts-section">
                    <div className="courts-header">
                      <button 
                        className="unselect-all-btn"
                        onClick={handleUnselectAllCourts}
                        type="button"
                      >
                        Unselect All Courts
                      </button>
                    </div>
                    <div className="courts-list">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={formData.selectedCourts.all}
                          onChange={(e) => handleCourtChange('all', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        All Courts
                      </label>
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={formData.selectedCourts.supremeCourt}
                          onChange={(e) => handleCourtChange('supremeCourt', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Supreme Court (Since 1950)
                      </label>
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={formData.selectedCourts.privyCouncil}
                          onChange={(e) => handleCourtChange('privyCouncil', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Privy Council (Since 1872)
                      </label>
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={formData.selectedCourts.allahabad}
                          onChange={(e) => handleCourtChange('allahabad', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Allahabad High Court (Since 1874)
                      </label>
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={formData.selectedCourts.apHigh}
                          onChange={(e) => handleCourtChange('apHigh', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        A.P. High Court (Since 1914)
                      </label>
                    </div>
                    
                    <div className="bench-section">
                      <label className="form-label">Bench</label>
                      <select 
                        className="form-select"
                        value={formData.bench}
                        onChange={(e) => handleInputChange('bench', e.target.value)}
                      >
                        <option value="All">All</option>
                        <option value="Constitutional">Constitutional</option>
                        <option value="Criminal">Criminal</option>
                        <option value="Civil">Civil</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Cases by Acts and Sections */}
              <div className="search-card">
                <div className="card-header">
                  <h3 className="card-title">Search Cases by Acts and Sections</h3>
                </div>
                <div className="card-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Acts</label>
                      <input 
                        type="text" 
                        className="form-input"
                        placeholder="Enter act name"
                        value={formData.acts}
                        onChange={(e) => handleInputChange('acts', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Section</label>
                      <input 
                        type="text" 
                        className="form-input"
                        placeholder="Enter section"
                        value={formData.section}
                        onChange={(e) => handleInputChange('section', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Wise Search */}
              <div className="search-card">
                <div className="card-header">
                  <label className="checkbox-label card-title-checkbox">
                    <input 
                      type="checkbox" 
                      checked={formData.dateWiseSearch}
                      onChange={(e) => handleCheckboxChange('dateWiseSearch', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Date Wise Search
                  </label>
                </div>
                <div className="card-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">From</label>
                      <input 
                        type="text" 
                        className="form-input"
                        placeholder="01-01-1950"
                        value={formData.dateFrom}
                        onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                        disabled={!formData.dateWiseSearch}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">To</label>
                      <input 
                        type="text" 
                        className="form-input"
                        placeholder="24-09-2025"
                        value={formData.dateTo}
                        onChange={(e) => handleInputChange('dateTo', e.target.value)}
                        disabled={!formData.dateWiseSearch}
                      />
                    </div>
                    <button 
                      className="reset-date-btn"
                      onClick={handleResetDate}
                      type="button"
                      disabled={!formData.dateWiseSearch}
                    >
                      Reset Date
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons-section">
            <button 
              className="search-btn search-sc-btn"
              onClick={() => handleSearch('sc')}
              disabled={isLoading}
            >
              {isLoading ? (
                <i className="bx bx-loader bx-spin"></i>
              ) : (
                <i className="bx bx-search"></i>
              )}
              Search Supreme Court
            </button>
            <button 
              className="search-btn search-all-btn"
              onClick={() => handleSearch('all')}
              disabled={isLoading}
            >
              {isLoading ? (
                <i className="bx bx-loader bx-spin"></i>
              ) : (
                <i className="bx bx-search"></i>
              )}
              Search All Courts
            </button>
            <button 
              className="clear-btn"
              onClick={handleClear}
              type="button"
            >
              <i className="bx bx-refresh"></i>
              Clear All
            </button>
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
        }

        .advance-search-page {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Page Header */
        .page-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 600;
          color: var(--gj-primary, #8b5cf6);
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          color: #6c757d;
          font-size: 1rem;
          margin: 0;
        }

        /* Alert */
        .alert {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Main Container */
        .search-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .left-column,
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Search Cards */
        .search-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .card-header {
          background: linear-gradient(135deg, var(--gj-primary, #8b5cf6) 0%, var(--gj-secondary, #a855f7) 100%);
          padding: 1rem 1.5rem;
        }

        .card-title {
          color: white;
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
        }

        .card-title-checkbox {
          color: white;
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-content {
          padding: 1.5rem;
        }

        /* Form Elements */
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-row:last-child {
          margin-bottom: 0;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;
          background: white;
          transition: all 0.2s ease;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--gj-primary, #8b5cf6);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .form-input:disabled,
        .form-select:disabled {
          background: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        /* Replace the existing checkbox and radio styles in your <style jsx> with this: */

/* Checkbox and Radio Styles - Fixed */
.checkbox-options,
.search-options,
.content-types {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.radio-options {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.radio-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin: 1rem 0;
}

.checkbox-label,
.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  user-select: none;
}

/* Hide default checkbox/radio */
.checkbox-label input[type="checkbox"],
.radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
  margin: 0;
  opacity: 0;
  position: absolute;
  z-index: -1;
}

/* Custom Checkbox */
.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background: white;
  transition: all 0.2s ease;
  position: relative;
  display: inline-block;
  flex-shrink: 0;
}

.checkbox-label:hover .checkmark {
  border-color: var(--gj-primary, #8b5cf6);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: var(--gj-primary, #8b5cf6);
  border-color: var(--gj-primary, #8b5cf6);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Custom Radio */
.radio-mark {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  background: white;
  transition: all 0.2s ease;
  position: relative;
  display: inline-block;
  flex-shrink: 0;
}

.radio-label:hover .radio-mark {
  border-color: var(--gj-primary, #8b5cf6);
}

.radio-label input[type="radio"]:checked + .radio-mark {
  border-color: var(--gj-primary, #8b5cf6);
}

.radio-label input[type="radio"]:checked + .radio-mark::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--gj-primary, #8b5cf6);
  border-radius: 50%;
  top: 3px;
  left: 3px;
}

/* Focus states */
.checkbox-label input[type="checkbox"]:focus + .checkmark,
.radio-label input[type="radio"]:focus + .radio-mark {
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}
        /* Courts Section */
        .courts-section {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          margin: 1rem 0;
          overflow: hidden;
        }

        .courts-header {
          background: #f3f4f6;
          padding: 0.75rem;
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .unselect-all-btn {
          background: var(--gj-primary, #8b5cf6);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .unselect-all-btn:hover {
          background: var(--gj-secondary, #a855f7);
          transform: translateY(-1px);
        }

        .courts-list {
          padding: 1rem;
          background: #fafafa;
          max-height: 200px;
          overflow-y: auto;
        }

        .courts-list .checkbox-label {
          display: block;
          margin-bottom: 0.75rem;
          padding: 0.25rem 0;
        }

        .courts-list .checkbox-label:last-child {
          margin-bottom: 0;
        }

        .bench-section {
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        /* Search Preferences */
        .search-preferences {
          border-top: 1px solid #f3f4f6;
          padding-top: 1rem;
          margin-top: 1rem;
        }

        /* Action Buttons Section */
        .action-buttons-section {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 2rem;
        }

        .search-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .search-sc-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .search-sc-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }

        .search-all-btn {
          background: linear-gradient(135deg, var(--gj-primary, #8b5cf6) 0%, var(--gj-secondary, #a855f7) 100%);
          color: white;
        }

        .search-all-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--gj-secondary, #a855f7) 0%, #9333ea 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
        }

        .clear-btn {
          background: #f3f4f6;
          color: #374151;
          border: 2px solid #e5e7eb;
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .clear-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
        }

        .search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .reset-date-btn {
          background: #6366f1;
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .reset-date-btn:hover:not(:disabled) {
          background: #4f46e5;
          transform: translateY(-1px);
        }

        .reset-date-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .search-container {
            gap: 1.5rem;
          }
          
          .advance-search-page {
            padding: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .search-container {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .radio-grid {
            grid-template-columns: 1fr;
          }
          
          .action-buttons-section {
            flex-direction: column;
            align-items: center;
          }
          
          .search-btn,
          .clear-btn {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }
          
          .advance-search-page {
            padding: 1rem;
          }
          
          .page-title {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .checkbox-options,
          .search-options,
          .content-types {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .radio-options {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .card-content {
            padding: 1rem;
          }
          
          .courts-list {
            max-height: 150px;
          }
        }

        /* Loading Animation */
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .bx-spin {
          animation: spin 1s linear infinite;
        }

        /* Scrollbar Styling */
        .courts-list::-webkit-scrollbar {
          width: 6px;
        }

        .courts-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .courts-list::-webkit-scrollbar-thumb {
          background: var(--gj-primary, #8b5cf6);
          border-radius: 3px;
        }

        .courts-list::-webkit-scrollbar-thumb:hover {
          background: var(--gj-secondary, #a855f7);
        }
      `}</style>
    </div>
  );
};

export default Search;