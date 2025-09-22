// src/pages/Search.jsx - Exact design match from screenshots
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ApiService from '../services/apiService';

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('All Courts Selected');
  const [activeSearchType, setActiveSearchType] = useState('exact-phrase');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data for all search fields
  const [formData, setFormData] = useState({
    // Cases by Citations
    caseNoCitation1: '',
    appellantCitation1: '',
    caseNoCitation2: '',
    appellantCitation2: '',
    
    // Cases by Party Name
    appellantName: '',
    respondentName: '',
    caseNoName: '',
    
    // Cases by Judge Name
    judgeName: '',
    
    // Cases by Advocate Name
    advocateName: '',
    
    // Cases by Acts and Sections
    actsFields: [''],
    sectionsFields: [''],
    
    // Date range
    dateFrom: '01-01-1950',
    dateTo: '01-01-1950'
  });

  useEffect(() => {
    document.body.style.paddingTop = '0';
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  const searchTypes = [
    { id: 'exact-phrase', label: 'Exact Phrase' },
    { id: 'free', label: 'Free' },
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddActsRow = () => {
    setFormData(prev => ({
      ...prev,
      actsFields: [...prev.actsFields, ''],
      sectionsFields: [...prev.sectionsFields, '']
    }));
  };

  const handleDeleteActsRow = (index) => {
    if (formData.actsFields.length > 1) {
      setFormData(prev => ({
        ...prev,
        actsFields: prev.actsFields.filter((_, i) => i !== index),
        sectionsFields: prev.sectionsFields.filter((_, i) => i !== index)
      }));
    }
  };

  const handleActsChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      actsFields: prev.actsFields.map((field, i) => i === index ? value : field)
    }));
  };

  const handleSectionsChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      sectionsFields: prev.sectionsFields.map((field, i) => i === index ? value : field)
    }));
  };

  const handleSearch = async (searchType = 'all') => {
    setIsLoading(true);
    setError('');

    try {
      console.log('🔍 Starting Advanced Search...');
      
      const searchPayload = {
        query: searchQuery,
        pageSize: 25,
        page: 0,
        sortBy: 'relevance',
        sortOrder: 'desc',
        filters: {
          court: selectedCourt !== 'All Courts Selected' ? selectedCourt : null,
          ...formData
        }
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
      caseNoCitation1: '',
      appellantCitation1: '',
      caseNoCitation2: '',
      appellantCitation2: '',
      appellantName: '',
      respondentName: '',
      caseNoName: '',
      judgeName: '',
      advocateName: '',
      actsFields: [''],
      sectionsFields: [''],
      dateFrom: '01-01-1950',
      dateTo: '01-01-1950'
    });
    setSearchQuery('');
    setError('');
  };

  const handleReset = () => {
    setFormData(prev => ({
      ...prev,
      dateFrom: '01-01-1950',
      dateTo: '01-01-1950'
    }));
  };

  return (
    <div className="gojuris-layout">
      <Sidebar />
      
      <div className="gojuris-main">
        <Navbar />

        <div className="advance-search-page">
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bx bx-error-circle me-2"></i>
              {error}
            </div>
          )}
          
          <div className="advance-search-container">
            <h1 className="page-title">Advance Search</h1>
            
            <div className="search-grid">
              {/* Left Column */}
              <div className="left-column">
                {/* Cases by Citations */}
                <div className="search-category">
                  <h3 className="category-title">Cases by Citations</h3>
                  <div className="citation-grid">
                    <div className="citation-row">
                      <div className="field-group">
                        <label className="field-label">Case No</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.caseNoCitation1}
                          onChange={(e) => handleInputChange('caseNoCitation1', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="field-group">
                        <label className="field-label">Appellant</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.appellantCitation1}
                          onChange={(e) => handleInputChange('appellantCitation1', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="citation-row">
                      <div className="field-group">
                        <label className="field-label">Case No</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.caseNoCitation2}
                          onChange={(e) => handleInputChange('caseNoCitation2', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="field-group">
                        <label className="field-label">Appellant</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.appellantCitation2}
                          onChange={(e) => handleInputChange('appellantCitation2', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cases by Party Name */}
                <div className="search-category">
                  <h3 className="category-title">Cases by Party Name</h3>
                  <div className="category-content">
                    <div className="checkbox-options">
                      <label className="checkbox-item">
                        <input type="checkbox" />
                        <span>Enable Autocomplete</span>
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" />
                        <span>Enable Spelling Variations</span>
                      </label>
                    </div>
                    <div className="field-group">
                      <label className="field-label">Appellant</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Example - Murder"
                        value={formData.appellantName}
                        onChange={(e) => handleInputChange('appellantName', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Respondent</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Example - Murder"
                        value={formData.respondentName}
                        onChange={(e) => handleInputChange('respondentName', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Case No</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Example - Murder"
                        value={formData.caseNoName}
                        onChange={(e) => handleInputChange('caseNoName', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Cases by Judge Name */}
                <div className="search-category">
                  <h3 className="category-title">Cases by Judge Name</h3>
                  <div className="category-content">
                    <div className="radio-options">
                      <label className="radio-item">
                        <input type="radio" name="judgeSearch" value="exact" defaultChecked />
                        <span>Exact</span>
                      </label>
                      <label className="radio-item">
                        <input type="radio" name="judgeSearch" value="free" />
                        <span>Free</span>
                      </label>
                    </div>
                    <div className="field-group">
                      <label className="field-label">Judges</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Type your Query Here"
                        value={formData.judgeName}
                        onChange={(e) => handleInputChange('judgeName', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Cases by Advocate Name */}
                <div className="search-category">
                  <h3 className="category-title">Cases by Advocate Name</h3>
                  <div className="category-content">
                    <div className="field-group">
                      <label className="field-label">Advocates</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Type your Query Here"
                        value={formData.advocateName}
                        onChange={(e) => handleInputChange('advocateName', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="right-column">
                {/* Cases by Subject and Topic */}
                <div className="search-category">
                  <h3 className="category-title">Cases by Subject and Topic</h3>
                  <div className="category-content">
                    <div className="radio-options">
                      {searchTypes.map((type) => (
                        <label key={type.id} className="radio-item">
                          <input 
                            type="radio" 
                            name="searchType" 
                            value={type.id}
                            checked={activeSearchType === type.id}
                            onChange={() => setActiveSearchType(type.id)}
                          />
                          <span>{type.label}</span>
                        </label>
                      ))}
                    </div>
                    
                    <div className="field-group">
                      <label className="field-label">Type your Query Here :</label>
                      <div className="query-wrapper">
                        <input
                          type="text"
                          className="form-input query-input"
                          placeholder="Example - Murder"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          disabled={isLoading}
                        />
                        <button className="delete-sub-btn">Delete Sub.</button>
                      </div>
                    </div>

                    <div className="options-row">
                      <label className="checkbox-item">
                        <input type="checkbox" defaultChecked />
                        <span>Most Recent</span>
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" />
                        <span>Least Recent</span>
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" />
                        <span>Most Relevant</span>
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" />
                        <span>Most Referred</span>
                      </label>
                    </div>

                    <div className="content-row">
                      <label className="checkbox-item">
                        <input type="checkbox" defaultChecked />
                        <span>Headnote</span>
                      </label>
                      <label className="checkbox-item">
                        <input type="checkbox" />
                        <span>Fulltext</span>
                      </label>
                    </div>

                    <div className="field-group">
                      <label className="field-label">Select all Courts</label>
                      <div className="court-selector">
                        <select 
                          className="form-select"
                          value={selectedCourt}
                          onChange={(e) => setSelectedCourt(e.target.value)}
                        >
                          <option>All Courts Selected</option>
                          {courts.map((court) => (
                            <option key={court} value={court}>{court}</option>
                          ))}
                        </select>
                        <button className="court-btn all-btn">All</button>
                        <button className="court-btn clear-btn">Clear</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cases by Acts and Sections */}
                <div className="search-category">
                  <h3 className="category-title">Cases by Acts and Sections</h3>
                  <div className="category-content">
                    <div className="acts-sections-layout">
                      <div className="acts-column">
                        {formData.actsFields.map((act, index) => (
                          <div key={index} className="input-with-action">
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Example - Murder"
                              value={act}
                              onChange={(e) => handleActsChange(index, e.target.value)}
                              disabled={isLoading}
                            />
                            {formData.actsFields.length > 1 && (
                              <button 
                                className="delete-btn"
                                onClick={() => handleDeleteActsRow(index)}
                                type="button"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        <button 
                          className="add-row-button"
                          onClick={handleAddActsRow}
                          type="button"
                        >
                          <i className="bx bx-plus"></i> Add Row
                        </button>
                      </div>
                      
                      <div className="sections-column">
                        {/* <h4 className="section-header">Section</h4> */}
                        {formData.sectionsFields.map((section, index) => (
                          <div key={index} className="input-with-action">
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Enter Section Here"
                              value={section}
                              onChange={(e) => handleSectionsChange(index, e.target.value)}
                              disabled={isLoading}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date Wise Search */}
                <div className="search-category">
                  <h3 className="category-title">
                    <i className="bx bx-calendar"></i> Date Wise Search
                  </h3>
                  <div className="category-content">
                    <div className="date-row">
                      <div className="date-field">
                        <label className="field-label">From</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="01-01-1950"
                          value={formData.dateFrom}
                          onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="date-field">
                        <label className="field-label">To</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="01-01-1950"
                          value={formData.dateTo}
                          onChange={(e) => handleInputChange('dateTo', e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <button 
                        className="reset-button"
                        onClick={handleReset}
                        type="button"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button 
                    className="action-button search-sc"
                    onClick={() => handleSearch('sc')}
                    disabled={isLoading}
                  >
                    Search In SC
                  </button>
                  <button 
                    className="action-button search-all"
                    onClick={() => handleSearch('all')}
                    disabled={isLoading}
                  >
                    Search All
                  </button>
                  <button 
                    className="action-button clear"
                    onClick={handleClearFields}
                    disabled={isLoading}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .gojuris-layout {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
        }

        .gojuris-main {
          flex: 1;
          margin-left: 70px;
          width: calc(100% - 70px);
          min-height: 100vh;
        }

        .advance-search-page {
          padding: 20px;
          background: #f8f9fa;
          min-height: calc(100vh - 80px);
        }

        .advance-search-container {
          max-width: 1400px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .page-title {
          background: #f8f9fa;
          padding: 15px 20px;
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #333;
          border-bottom: 1px solid #e9ecef;
          border-radius: 8px 8px 0 0;
        }

        .search-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          padding: 20px;
        }

        .left-column,
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .search-category {
          border: 1px solid #e9ecef;
          border-radius: 6px;
          background: white;
        }

        .category-title {
          background: #f8f9fa;
          padding: 12px 15px;
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #495057;
          border-bottom: 1px solid #e9ecef;
        }

        .category-content {
          padding: 15px;
        }

        .citation-grid {
          padding: 15px;
        }

        .citation-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }

        .citation-row:last-child {
          margin-bottom: 0;
        }

        .field-group {
          margin-bottom: 15px;
        }

        .field-group:last-child {
          margin-bottom: 0;
        }

        .field-label {
          display: block;
          margin-bottom: 5px;
          font-size: 12px;
          font-weight: 500;
          color: #6c757d;
        }

        .form-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 13px;
          background: white;
          transition: border-color 0.15s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .form-select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 13px;
          background: white;
        }

        .checkbox-options,
        .radio-options {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .checkbox-item,
        .radio-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #495057;
          cursor: pointer;
        }

        .checkbox-item input,
        .radio-item input {
          margin: 0;
        }

        .query-wrapper {
          display: flex;
          gap: 8px;
          align-items: stretch;
        }

        .query-input {
          flex: 1;
        }

        .delete-sub-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
        }

        .options-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 15px;
        }

        .content-row {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
        }

        .court-selector {
          display: flex;
          gap: 8px;
          align-items: stretch;
        }

        .form-select {
          flex: 1;
        }

        .court-btn {
          padding: 8px 12px;
          border: 1px solid;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
        }

        .all-btn {
          background: #17a2b8;
          color: white;
          border-color: #17a2b8;
        }

        .clear-btn {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
        }

        .acts-sections-layout {
          display: grid;
          grid-template-columns: 1fr 200px;
          gap: 15px;
        }

        .acts-column,
        .sections-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .input-with-action {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .input-with-action .form-input {
          flex: 1;
        }

        .delete-btn {
          width: 24px;
          height: 24px;
          border: none;
          background: #dc3545;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          line-height: 1;
          flex-shrink: 0;
        }

        .section-header {
          margin: 0 0 10px 0;
          font-size: 13px;
          font-weight: 600;
          color: #495057;
        }

        .add-row-button {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          border: 1px solid #6c757d;
          border-radius: 4px;
          background: white;
          color: #6c757d;
          font-size: 12px;
          cursor: pointer;
          margin-top: 5px;
          width: fit-content;
        }

        .date-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 15px;
          align-items: end;
        }

        .date-field {
          display: flex;
          flex-direction: column;
        }

        .reset-button {
          background: #dc3545;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          height: fit-content;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 20px;
          padding-bottom: 20px;
        }

        .action-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .search-sc {
          background: #007bff;
          color: white;
        }

        .search-all {
          background: #17a2b8;
          color: white;
        }

        .clear {
          background: #6c757d;
          color: white;
        }

        .action-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .action-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .search-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .advance-search-page {
            padding: 10px;
          }

          .citation-row {
            grid-template-columns: 1fr;
          }

          .options-row {
            grid-template-columns: 1fr;
          }

          .checkbox-options,
          .content-row {
            flex-direction: column;
            gap: 10px;
          }

          .acts-sections-layout {
            grid-template-columns: 1fr;
          }

          .date-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .action-buttons {
            flex-direction: column;
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

export default Search;