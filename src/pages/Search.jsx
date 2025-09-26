// src/pages/Search.jsx - Redesigned to match reference database layout exactly
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ApiService from '../services/apiService';

const Search = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
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
      console.log('🔍 Starting Database Search...', searchType);
      
      const searchPayload = {
        query: formData.queryText || 'Database Search',
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
        query: formData.queryText || 'Database Search',
        results: searchResults,
        totalCount: totalCount,
        searchType: searchType === 'sc' ? 'Supreme Court Search' : 'All Courts Search',
        timestamp: new Date().toISOString()
      };

      sessionStorage.setItem('searchResults', JSON.stringify(resultsData));
      navigate('/results');

    } catch (error) {
      console.error('❌ Database Search failed:', error);
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

        <div className="database-search-page">
          {error && (
            <div className="alert alert-danger">
              <i className="bx bx-error-circle me-2"></i>
              {error}
            </div>
          )}

          {/* Navigation Tabs */}
          

          {/* Main Content */}
          <div className="database-content">
            {/* Left Column */}
            <div className="left-panel">
              {/* Search Cases by Citations */}
              <div className="search-section">
                <h3 className="section-title">Search Cases by Citations</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Journal</label>
                    <select 
                      value={formData.journal}
                      onChange={(e) => handleInputChange('journal', e.target.value)}
                    >
                      <option value="">Select Journal</option>
                      <option value="AIR">AIR</option>
                      <option value="SCC">SCC</option>
                      <option value="SCR">SCR</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <select 
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
                    <label>Volume</label>
                    <select 
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
                    <label>Page</label>
                    <select 
                      value={formData.page}
                      onChange={(e) => handleInputChange('page', e.target.value)}
                    >
                      <option value="">Select Page</option>
                      {Array.from({length: 100}, (_, i) => (i + 1) * 10).map(page => (
                        <option key={page} value={page}>{page}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Search Cases by Party Name */}
              <div className="search-section">
                <h3 className="section-title">Search Cases by Party Name</h3>
                <div className="checkbox-row">
                  <label>
                    <input type="checkbox" />
                    Enable Autocomplete
                  </label>
                  <label>
                    <input type="checkbox" />
                    Enable Spelling Variations
                  </label>
                  <button className="search-in-both-btn">Search in Both</button>
                </div>
                <div className="form-group">
                  <label>Appellant</label>
                  <input 
                    type="text" 
                    value={formData.appellant}
                    onChange={(e) => handleInputChange('appellant', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Respondent</label>
                  <input 
                    type="text" 
                    value={formData.respondent}
                    onChange={(e) => handleInputChange('respondent', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Case No</label>
                  <input 
                    type="text" 
                    value={formData.caseNo}
                    onChange={(e) => handleInputChange('caseNo', e.target.value)}
                  />
                </div>
              </div>

              {/* Search Cases by Judge Name */}
              <div className="search-section">
                <h3 className="section-title">Search Cases by Judge Name</h3>
                <div className="form-group">
                  <label>Judges</label>
                  <input 
                    type="text" 
                    value={formData.judges}
                    onChange={(e) => handleInputChange('judges', e.target.value)}
                  />
                </div>
                <div className="radio-row">
                  <label>
                    <input 
                      type="radio" 
                      name="judgeSearch" 
                      value="exact"
                      checked={formData.searchJudgeType === 'exact'}
                      onChange={(e) => handleInputChange('searchJudgeType', e.target.value)}
                    />
                    Exact
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="judgeSearch" 
                      value="free"
                      checked={formData.searchJudgeType === 'free'}
                      onChange={(e) => handleInputChange('searchJudgeType', e.target.value)}
                    />
                    Free
                  </label>
                </div>
              </div>

              {/* Search Cases by Advocate Name */}
              <div className="search-section">
                <h3 className="section-title">Search Cases by Advocate Name</h3>
                <div className="form-group">
                  <label>Advocates</label>
                  <input 
                    type="text" 
                    value={formData.advocates}
                    onChange={(e) => handleInputChange('advocates', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="right-panel">
              {/* Search Cases by Subject And Topic */}
              <div className="search-section">
                <h3 className="section-title">Search Cases by Subject And Topic</h3>
                
                <div className="search-options-row">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={formData.exactPhrase}
                      onChange={(e) => handleCheckboxChange('exactPhrase', e.target.checked)}
                    />
                    Exact Phrase
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={formData.free}
                      onChange={(e) => handleCheckboxChange('free', e.target.checked)}
                    />
                    Free
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={formData.near}
                      onChange={(e) => handleCheckboxChange('near', e.target.checked)}
                    />
                    Near
                  </label>
                  <div className="magic-search">
                    <select>
                      <option>5</option>
                    </select>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={formData.magicSearch}
                        onChange={(e) => handleCheckboxChange('magicSearch', e.target.checked)}
                      />
                      Magic Search
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Type your Query Here :</label>
                  <textarea 
                    value={formData.queryText}
                    onChange={(e) => handleInputChange('queryText', e.target.value)}
                    rows="3"
                    placeholder="Enter your search query here..."
                  />
                </div>

                <div className="search-preferences">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={formData.stateFavourCases}
                      onChange={(e) => handleCheckboxChange('stateFavourCases', e.target.checked)}
                    />
                    State Favour Cases
                  </label>
                  
                  <div className="radio-group">
                    <label>
                      <input 
                        type="radio" 
                        name="searchOrder" 
                        value="most-recent"
                        checked={formData.searchOrder === 'most-recent'}
                        onChange={(e) => handleInputChange('searchOrder', e.target.value)}
                      />
                      Most Recent
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="searchOrder" 
                        value="least-recent"
                        checked={formData.searchOrder === 'least-recent'}
                        onChange={(e) => handleInputChange('searchOrder', e.target.value)}
                      />
                      Least Recent
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="searchOrder" 
                        value="most-relevant"
                        checked={formData.searchOrder === 'most-relevant'}
                        onChange={(e) => handleInputChange('searchOrder', e.target.value)}
                      />
                      Most Relevant
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="searchOrder" 
                        value="most-referred"
                        checked={formData.searchOrder === 'most-referred'}
                        onChange={(e) => handleInputChange('searchOrder', e.target.value)}
                      />
                      Most Referred
                    </label>
                  </div>

                  <div className="content-type">
                    <label>
                      <input 
                        type="checkbox" 
                        checked={formData.headnote}
                        onChange={(e) => handleCheckboxChange('headnote', e.target.checked)}
                      />
                      Headnote
                    </label>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={formData.fulltext}
                        onChange={(e) => handleCheckboxChange('fulltext', e.target.checked)}
                      />
                      Fulltext
                    </label>
                  </div>
                </div>

                {/* Courts Selection */}
                <div className="courts-section">
                  <div className="courts-header">
                    <button 
                      className="unselect-all-btn"
                      onClick={handleUnselectAllCourts}
                    >
                      UNSELECT ALL COURTS
                    </button>
                  </div>
                  <div className="courts-list">
                    <label>
                      <input 
                        type="checkbox" 
                        checked={formData.selectedCourts.all}
                        onChange={(e) => handleCourtChange('all', e.target.checked)}
                      />
                      All
                    </label>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={formData.selectedCourts.supremeCourt}
                        onChange={(e) => handleCourtChange('supremeCourt', e.target.checked)}
                      />
                      Supreme Court (Since 1950)
                    </label>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={formData.selectedCourts.privyCouncil}
                        onChange={(e) => handleCourtChange('privyCouncil', e.target.checked)}
                      />
                      Privy Council (Since 1872)
                    </label>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={formData.selectedCourts.allahabad}
                        onChange={(e) => handleCourtChange('allahabad', e.target.checked)}
                      />
                      Allahabad High Court (Since 1874)
                    </label>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={formData.selectedCourts.apHigh}
                        onChange={(e) => handleCourtChange('apHigh', e.target.checked)}
                      />
                      A.P. High Court (Since 1914)
                    </label>
                  </div>
                  
                  <div className="bench-section">
                    <label>Bench :</label>
                    <select 
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

                {/* Action Buttons */}
                <div className="action-buttons-grid">
                  <button 
                    className="search-sc-btn"
                    onClick={() => handleSearch('sc')}
                    disabled={isLoading}
                  >
                    Search SC
                  </button>
                  <button 
                    className="search-all-btn"
                    onClick={() => handleSearch('all')}
                    disabled={isLoading}
                  >
                    Search All
                  </button>
                  <button 
                    className="cloud-search-btn"
                    onClick={() => handleSearch('cloud')}
                    disabled={isLoading}
                  >
                    Cloud Search
                  </button>
                  <button 
                    className="clear-btn"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Search Cases by Acts and Sections */}
              <div className="search-section">
                <h3 className="section-title">Search Cases by Acts and Sections</h3>
                <div className="form-row">
                  <div className="form-group">
                    <input 
                      type="text" 
                      placeholder="Acts"
                      value={formData.acts}
                      onChange={(e) => handleInputChange('acts', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Section</label>
                    <input 
                      type="text" 
                      value={formData.section}
                      onChange={(e) => handleInputChange('section', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Date Wise Search */}
              <div className="search-section">
                <div className="date-search-header">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={formData.dateWiseSearch}
                      onChange={(e) => handleCheckboxChange('dateWiseSearch', e.target.checked)}
                    />
                    Date Wise Search
                  </label>
                </div>
                <div className="date-row">
                  <div className="form-group">
                    <label>From</label>
                    <input 
                      type="text" 
                      value={formData.dateFrom}
                      onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                      placeholder="01-01-1950"
                    />
                  </div>
                  <div className="form-group">
                    <label>To</label>
                    <input 
                      type="text" 
                      value={formData.dateTo}
                      onChange={(e) => handleInputChange('dateTo', e.target.value)}
                      placeholder="24-09-2025"
                    />
                  </div>
                  <button 
                    className="reset-date-btn"
                    onClick={handleResetDate}
                  >
                    Reset the Date
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Send Feedback Button */}
          <div className="feedback-section">
            <button className="send-feedback-btn">
              <i className="bx bx-message-dots"></i>
              Send Feedback
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .database-search-page {
          background: #f0f0f0;
          min-height: 100vh;
          font-family: Arial, sans-serif;
          font-size: 12px;
        }

        .database-tabs {
          background: white;
          border-bottom: 1px solid #ccc;
          padding: 0;
          margin: 0;
        }

        .db-tab {
          background: #e8e8e8;
          border: 1px solid #ccc;
          border-bottom: none;
          padding: 8px 16px;
          margin-right: 2px;
          cursor: pointer;
          font-size: 12px;
          display: inline-block;
        }

        .db-tab.active {
          background: white;
          border-bottom: 1px solid white;
          position: relative;
          z-index: 1;
        }

        .database-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 10px;
          background: white;
        }

        .left-panel,
        .right-panel {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .search-section {
          border: 1px solid #ccc;
          background: white;
        }

        .section-title {
          background: #7C3AED;
          color: white;
          margin: 0;
          padding: 6px 8px;
          font-size: 12px;
          font-weight: normal;
          text-decoration: underline;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 8px;
        }

        .form-group {
          margin-bottom: 8px;
        }

        .form-group label {
          display: block;
          font-size: 11px;
          color: #333;
          margin-bottom: 2px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 3px 5px;
          border: 1px solid #ccc;
          font-size: 11px;
          background: white;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 60px;
        }

        .checkbox-row,
        .radio-row {
          display: flex;
          gap: 15px;
          padding: 8px;
          align-items: center;
        }

        .checkbox-row label,
        .radio-row label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          cursor: pointer;
        }

        .search-in-both-btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 10px;
          cursor: pointer;
        }

        .search-options-row {
          display: flex;
          gap: 10px;
          padding: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-options-row label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
        }

        .magic-search {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .magic-search select {
          width: 40px;
          padding: 2px;
          font-size: 11px;
        }

        .search-preferences {
          padding: 8px;
          border-top: 1px solid #eee;
        }

        .radio-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin: 8px 0;
        }

        .radio-group label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
        }

        .content-type {
          display: flex;
          gap: 20px;
          margin: 8px 0;
        }

        .content-type label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
        }

        .courts-section {
          border: 1px solid #ccc;
          margin: 8px 0;
        }

        .courts-header {
          background: #e8e8e8;
          padding: 4px;
          text-align: center;
        }

        .unselect-all-btn {
          background: #6699FF;
          color: white;
          border: none;
          padding: 4px 8px;
          font-size: 10px;
          cursor: pointer;
        }

        .courts-list {
          padding: 8px;
          max-height: 120px;
          overflow-y: auto;
          background: #f9f9f9;
        }

        .courts-list label {
          display: block;
          margin: 2px 0;
          font-size: 11px;
          cursor: pointer;
        }

        .bench-section {
          padding: 8px;
          border-top: 1px solid #eee;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bench-section label {
          font-size: 11px;
          color: #333;
        }

        .bench-section select {
          padding: 3px 5px;
          border: 1px solid #ccc;
          font-size: 11px;
          background: white;
        }

        .action-buttons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 8px;
        }

        .search-sc-btn,
        .search-all-btn,
        .cloud-search-btn,
        .clear-btn {
          padding: 8px 12px;
          border: 1px solid #ccc;
          font-size: 11px;
          cursor: pointer;
          border-radius: 3px;
        }

        .search-sc-btn {
          background: #4CAF50;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .search-all-btn {
          background: #2196F3;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .cloud-search-btn {
          background: #FF5722;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .clear-btn {
          background: #f44336;
          color: white;
        }

        .date-search-header {
          padding: 8px;
          background: #f9f9f9;
        }

        .date-row {
          display: flex;
          gap: 8px;
          padding: 8px;
          align-items: end;
        }

        .reset-date-btn {
          background: #9C27B0;
          color: white;
          border: none;
          padding: 6px 10px;
          font-size: 10px;
          cursor: pointer;
          border-radius: 3px;
          white-space: nowrap;
        }

        .feedback-section {
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 1000;
        }

       .send-feedback-btn {
          background: #2196F3;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 15px;
          font-size: 11px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .send-feedback-btn:hover {
          background: #1976D2;
        }

        .alert {
          margin: 10px;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #f5c6cb;
          background: #f8d7da;
          color: #721c24;
          font-size: 12px;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .database-content {
            grid-template-columns: 1fr;
            gap: 5px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .action-buttons-grid {
            grid-template-columns: 1fr 1fr;
          }
          
          .radio-group {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .database-search-page {
            font-size: 11px;
          }
          
          .section-title {
            font-size: 11px;
            padding: 4px 6px;
          }
          
          .form-group input,
          .form-group select,
          .form-group textarea {
            font-size: 10px;
          }
          
          .action-buttons-grid {
            grid-template-columns: 1fr;
          }
          
          .date-row {
            flex-direction: column;
            align-items: stretch;
          }
          
          .reset-date-btn {
            margin-top: 8px;
          }
        }

        /* Loading state */
        .search-sc-btn:disabled,
        .search-all-btn:disabled,
        .cloud-search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Hover effects */
        .search-sc-btn:hover:not(:disabled) {
          background: #45a049;
        }
        
        .search-all-btn:hover:not(:disabled) {
          background: #1976D2;
        }
        
        .cloud-search-btn:hover:not(:disabled) {
          background: #E64A19;
        }
        
        .clear-btn:hover {
          background: #d32f2f;
        }
      `}</style>
    </div>
  );
};

export default Search;