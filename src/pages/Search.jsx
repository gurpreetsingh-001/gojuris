// src/pages/Search.jsx
import React, { useState } from 'react';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('All Courts Selected');
  const [activeSearchType, setActiveSearchType] = useState('all-words');
  const [isCourtDropdownOpen, setIsCourtDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    appellant: '',
    respondent: '',
    judge: '',
    advocate: '',
    caseNo: ''
  });

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

  const handleSearch = (searchType) => {
    console.log('Search type:', searchType);
    console.log('Form data:', formData);
    console.log('Selected court:', selectedCourt);
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
  };

  return (
    <div className="search-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h1 className="search-page-title mb-5">Advance Search</h1>
            
            <div className="advance-search-card">
              {/* Main Search Input */}
              <div className="main-search-section">
                <div className="search-input-row">
                  <input
                    type="text"
                    className="main-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask anything"
                  />
                  
                  <div className="sort-dropdown-wrapper">
                    <button
                      className="sort-dropdown-btn"
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
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
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="form-fields-section">
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-field-input"
                      placeholder="Appellant"
                      value={formData.appellant}
                      onChange={(e) => handleInputChange('appellant', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-field-input"
                      placeholder="Respondent"
                      value={formData.respondent}
                      onChange={(e) => handleInputChange('respondent', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-field-input"
                      placeholder="Judge"
                      value={formData.judge}
                      onChange={(e) => handleInputChange('judge', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-field-input"
                      placeholder="Advocate"
                      value={formData.advocate}
                      onChange={(e) => handleInputChange('advocate', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-field-input"
                      placeholder="Case No."
                      value={formData.caseNo}
                      onChange={(e) => handleInputChange('caseNo', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="court-dropdown-wrapper">
                      <button
                        className="court-dropdown-btn"
                        onClick={() => setIsCourtDropdownOpen(!isCourtDropdownOpen)}
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
                <p className="search-remaining">You have searches remaining.</p>
                <a href="#" className="upgrade-link">Upgrade Plan</a>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons-section">
                <button 
                  className="search-action-btn primary"
                  onClick={() => handleSearch('supreme-court')}
                >
                  Search in Supreme Court
                </button>
                <button 
                  className="search-action-btn primary"
                  onClick={() => handleSearch('all')}
                >
                  Search All
                </button>
                <button 
                  className="search-action-btn secondary"
                  onClick={handleClearFields}
                >
                  Clear Fields
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;