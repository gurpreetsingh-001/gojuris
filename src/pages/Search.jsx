// src/pages/Search.jsx - Modern themed advance search with 2-column layout
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import SearchableDropdown from '../components/SearchableDropdown';
import ApiService from '../services/apiService';

const Search = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [isJournalOpen, setIsJournalOpen] = useState(false);
const [isYearOpen, setIsYearOpen] = useState(false);
const [isVolumeOpen, setIsVolumeOpen] = useState(false);
const [isPageOpen, setIsPageOpen] = useState(false);

// API data states
const [journals, setJournals] = useState([]);
const [years, setYears] = useState([]);
const [volumes, setVolumes] = useState([]);
const [pages, setPages] = useState([]);

// Loading states
const [isLoadingJournals, setIsLoadingJournals] = useState(true);
const [isLoadingYears, setIsLoadingYears] = useState(false);
const [isLoadingVolumes, setIsLoadingVolumes] = useState(false);
const [isLoadingPages, setIsLoadingPages] = useState(false);

// Error states
const [journalsError, setJournalsError] = useState('');
const [yearsError, setYearsError] = useState('');
const [volumesError, setVolumesError] = useState('');
const [pagesError, setPagesError] = useState('');

// API base URL
const API_BASE_URL = 'http://216.172.100.173:8001';

// Add these API methods after your existing useEffect
const makeAuthenticatedRequest = async (url) => {
  const token = ApiService.getAccessToken();

  if (!token) {
    throw new Error('No access token found. Please login again.');
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  if (response.status === 401) {
    ApiService.clearTokensAndRedirect();
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const loadJournals = async () => {
  try {
    setIsLoadingJournals(true);
    setJournalsError('');
    console.log('Loading journals...');

    const data = await makeAuthenticatedRequest(`${API_BASE_URL}/Journals`);
    setJournals(data);
    console.log('Journals loaded:', data);
  } catch (error) {
    console.error('Error loading journals:', error);
    setJournalsError(error.message);
  } finally {
    setIsLoadingJournals(false);
  }
};

const loadYears = async (journalName) => {
  try {
    setIsLoadingYears(true);
    setYearsError('');
    console.log('Loading years for:', journalName);

    const data = await makeAuthenticatedRequest(`${API_BASE_URL}/Journals/${encodeURIComponent(journalName)}/years`);
    setYears(data);
    console.log('Years loaded for', journalName, ':', data);
  } catch (error) {
    console.error('Error loading years:', error);
    setYearsError(error.message);
    setYears([]);
  } finally {
    setIsLoadingYears(false);
  }
};

const loadVolumes = async (journalName, year) => {
  try {
    setIsLoadingVolumes(true);
    setVolumesError('');
    console.log('Loading volumes for:', journalName, year);

    const data = await makeAuthenticatedRequest(`${API_BASE_URL}/Journals/${encodeURIComponent(journalName)}/years/${year}/volumes`);
    setVolumes(data);
    console.log('Volumes loaded for', journalName, year, ':', data);
  } catch (error) {
    console.error('Error loading volumes:', error);
    setVolumesError(error.message);
    setVolumes([]);
  } finally {
    setIsLoadingVolumes(false);
  }
};

const loadPages = async (journalName, year, volume) => {
  try {
    setIsLoadingPages(true);
    setPagesError('');
    console.log('Loading pages for:', journalName, year, volume);

    const data = await makeAuthenticatedRequest(`${API_BASE_URL}/Journals/${encodeURIComponent(journalName)}/years/${year}/volumes/${encodeURIComponent(volume)}/pages`);
    setPages(data);
    console.log('Pages loaded for', journalName, year, volume, ':', data);
  } catch (error) {
    console.error('Error loading pages:', error);
    setPagesError(error.message);
    setPages([]);
  } finally {
    setIsLoadingPages(false);
  }
};
// Citation event handlers
const handleJournalSelect = (journal) => {
  setFormData(prev => ({
    ...prev,
    selectedJournal: journal,
    selectedYear: 'Select a option',
    selectedVolume: 'Select a option', 
    selectedPage: 'Select a option'
  }));
  setIsJournalOpen(false);

  // Reset dependent dropdowns
  setYears([]);
  setVolumes([]);
  setPages([]);

  // Clear errors
  setYearsError('');
  setVolumesError('');
  setPagesError('');

  // Load years for selected journal
  if (journal !== 'Select a option') {
    loadYears(journal);
  }
};

const handleYearSelect = (year) => {
  setFormData(prev => ({
    ...prev,
    selectedYear: year,
    selectedVolume: 'Select a option',
    selectedPage: 'Select a option'
  }));
  setIsYearOpen(false);

  // Reset dependent dropdowns
  setVolumes([]);
  setPages([]);

  // Clear errors
  setVolumesError('');
  setPagesError('');

  // Load volumes for selected journal and year
  if (year !== 'Select a option' && formData.selectedJournal !== 'Select a option') {
    loadVolumes(formData.selectedJournal, year);
  }
};

const handleVolumeSelect = (volume) => {
  setFormData(prev => ({
    ...prev,
    selectedVolume: volume,
    selectedPage: 'Select a option'
  }));
  setIsVolumeOpen(false);

  // Reset dependent dropdown
  setPages([]);

  // Clear errors
  setPagesError('');

  // Load pages for selected journal, year, and volume
  if (volume !== 'Select a option' && formData.selectedJournal !== 'Select a option' && formData.selectedYear !== 'Select a option') {
    loadPages(formData.selectedJournal, formData.selectedYear, volume);
  }
};

const handlePageSelect = (page) => {
  setFormData(prev => ({
    ...prev,
    selectedPage: page
  }));
  setIsPageOpen(false);
};
useEffect(() => {
  document.body.style.paddingTop = '0';
  loadJournals(); // Add this line
  return () => {
    document.body.style.paddingTop = '';
  };
}, []);
  // Form data for all search fields
  const [formData, setFormData] = useState({
    // Citations
    journal: '',
    year: '',
    volume: '',
    page: '',

    selectedJournal: 'Select a option',
  selectedYear: 'Select a option', 
  selectedVolume: 'Select a option',
  selectedPage: 'Select a option',
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
    nearWords: '5',
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
             {/* Search Cases by Citations */}
<div className="search-card">
  <div className="card-header">
    <h3 className="card-title">Search Cases by Citations</h3>
  </div>
  <div className="card-content">
    <div className="form-row">
      {/* Journal Name Dropdown */}
      <div className="form-group">
        <label className="form-label">Journal</label>
        <div className="citation-dropdown-wrapper">
          <button
            className="citation-dropdown-btn"
            onClick={() => setIsJournalOpen(!isJournalOpen)}
            disabled={isLoadingJournals}
          >
            {isLoadingJournals ? 'Loading journals...' : formData.selectedJournal}
            <i className="bx bx-chevron-down"></i>
          </button>

          {(isJournalOpen || isLoadingJournals || journalsError) && (
            <>
              <div
                className="dropdown-backdrop"
                onClick={() => setIsJournalOpen(false)}
              />
              <SearchableDropdown
                items={journals}
                selectedItem={formData.selectedJournal}
                onSelect={handleJournalSelect}
                isOpen={isJournalOpen}
                onToggle={setIsJournalOpen}
                isLoading={isLoadingJournals}
                error={journalsError}
                loadingText="Loading journals..."
                placeholder="journals"
              />
            </>
          )}
        </div>
        {journalsError && <div className="citation-error">{journalsError}</div>}
      </div>

      {/* Year Dropdown */}
      <div className="form-group">
        <label className="form-label">Year</label>
        <div className="citation-dropdown-wrapper">
          <button
            className="citation-dropdown-btn"
            onClick={() => setIsYearOpen(!isYearOpen)}
            disabled={isLoadingYears || formData.selectedJournal === 'Select a option'}
          >
            {isLoadingYears ? 'Loading years...' : formData.selectedYear}
            <i className="bx bx-chevron-down"></i>
          </button>

          {(isYearOpen || isLoadingYears || yearsError) && formData.selectedJournal !== 'Select a option' && (
            <>
              <div
                className="dropdown-backdrop"
                onClick={() => setIsYearOpen(false)}
              />
              <SearchableDropdown
                items={years}
                selectedItem={formData.selectedYear}
                onSelect={handleYearSelect}
                isOpen={isYearOpen}
                onToggle={setIsYearOpen}
                isLoading={isLoadingYears}
                error={yearsError}
                loadingText="Loading years..."
                placeholder="years"
              />
            </>
          )}
        </div>
        {yearsError && <div className="citation-error">{yearsError}</div>}
      </div>
    </div>

    <div className="form-row">
      {/* Volume Dropdown */}
      <div className="form-group">
        <label className="form-label">Volume</label>
        <div className="citation-dropdown-wrapper">
          <button
            className="citation-dropdown-btn"
            onClick={() => setIsVolumeOpen(!isVolumeOpen)}
            disabled={isLoadingVolumes || formData.selectedYear === 'Select a option'}
          >
            {isLoadingVolumes ? 'Loading volumes...' : formData.selectedVolume}
            <i className="bx bx-chevron-down"></i>
          </button>

          {(isVolumeOpen || isLoadingVolumes || volumesError) && formData.selectedYear !== 'Select a option' && (
            <>
              <div
                className="dropdown-backdrop"
                onClick={() => setIsVolumeOpen(false)}
              />
              <SearchableDropdown
                items={volumes}
                selectedItem={formData.selectedVolume}
                onSelect={handleVolumeSelect}
                isOpen={isVolumeOpen}
                onToggle={setIsVolumeOpen}
                isLoading={isLoadingVolumes}
                error={volumesError}
                loadingText="Loading volumes..."
                placeholder="volumes"
              />
            </>
          )}
        </div>
        {volumesError && <div className="citation-error">{volumesError}</div>}
      </div>

      {/* Page Dropdown */}
      <div className="form-group">
        <label className="form-label">Page</label>
        <div className="citation-dropdown-wrapper">
          <button
            className="citation-dropdown-btn"
            onClick={() => setIsPageOpen(!isPageOpen)}
            disabled={isLoadingPages || formData.selectedVolume === 'Select a option'}
          >
            {isLoadingPages ? 'Loading pages...' : formData.selectedPage}
            <i className="bx bx-chevron-down"></i>
          </button>

          {(isPageOpen || isLoadingPages || pagesError) && formData.selectedVolume !== 'Select a option' && (
            <>
              <div
                className="dropdown-backdrop"
                onClick={() => setIsPageOpen(false)}
              />
              <SearchableDropdown
                items={pages}
                selectedItem={formData.selectedPage}
                onSelect={handlePageSelect}
                isOpen={isPageOpen}
                onToggle={setIsPageOpen}
                isLoading={isLoadingPages}
                error={pagesError}
                loadingText="Loading pages..."
                placeholder="pages"
              />
            </>
          )}
        </div>
        {pagesError && <div className="citation-error">{pagesError}</div>}
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
    {/* Search Type Radio Buttons */}
    <div className="search-type-options">
      <label className="radio-label">
        <input 
          type="radio" 
          name="searchType" 
          value="exact-phrase"
          checked={formData.searchType === 'exact-phrase'}
          onChange={(e) => handleInputChange('searchType', e.target.value)}
        />
        <span className="radio-mark"></span>
        Exact Phrase
      </label>
      <label className="radio-label">
        <input 
          type="radio" 
          name="searchType" 
          value="free-search"
          checked={formData.searchType === 'free-search'}
          onChange={(e) => handleInputChange('searchType', e.target.value)}
        />
        <span className="radio-mark"></span>
        Free Search
      </label>
      <label className="radio-label">
        <input 
          type="radio" 
          name="searchType" 
          value="near"
          checked={formData.searchType === 'near'}
          onChange={(e) => handleInputChange('searchType', e.target.value)}
        />
        <span className="radio-mark"></span>
        Near
        <input 
          type="text" 
          className="near-words-input"
          placeholder="5"
          value={formData.nearWords || '5'}
          onChange={(e) => handleInputChange('nearWords', e.target.value)}
          disabled={formData.searchType !== 'near'}
        />
        Words
      </label>
      <label className="radio-label">
        <input 
          type="radio" 
          name="searchType" 
          value="magic-search"
          checked={formData.searchType === 'magic-search'}
          onChange={(e) => handleInputChange('searchType', e.target.value)}
        />
        <span className="radio-mark"></span>
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
      
      {/* Single Line Radio Buttons for Sort Order */}
      <div className="sort-order-row">
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
          padding: 1rem; /* Reduced from 2rem */
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Page Header - Compact */
        .page-header {
          text-align: center;
          margin-bottom: 1rem; /* Reduced from 2rem */
        }

        .page-title {
          font-size: 1.75rem; /* Reduced from 2rem */
          font-weight: 600;
          color: var(--gj-primary, #8b5cf6);
          margin-bottom: 0.25rem; /* Reduced from 0.5rem */
        }

        .page-subtitle {
          color: #6c757d;
          font-size: 0.875rem; /* Reduced from 1rem */
          margin: 0;
        }

        /* Alert - Compact */
        .alert {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          padding: 0.75rem; /* Reduced from 1rem */
          border-radius: 6px; /* Reduced from 8px */
          margin-bottom: 1rem; /* Reduced from 2rem */
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Main Container - Compact */
        .search-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem; /* Reduced from 2rem */
          margin-bottom: 1rem; /* Reduced from 2rem */
        }

        .left-column,
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 1rem; /* Reduced from 1.5rem */
        }

        /* Search Cards - Compact */
        .search-card {
          background: white;
          border-radius: 8px; /* Reduced from 12px */
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06); /* Reduced shadow */
          overflow: hidden;
        }

        .card-header {
          background: linear-gradient(135deg, var(--gj-primary, #8b5cf6) 0%, var(--gj-secondary, #a855f7) 100%);
          padding: 0.75rem 1rem; /* Reduced from 1rem 1.5rem */
        }

        .card-title {
          color: white;
          font-size: 0.875rem; /* Reduced from 1rem */
          font-weight: 600;
          margin: 0;
        }

        .card-title-checkbox {
          color: white;
          font-size: 0.875rem; /* Reduced from 1rem */
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-content {
          padding: 1rem; /* Reduced from 1.5rem */
        }

        /* Form Elements - Compact */
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem; /* Reduced from 1rem */
          margin-bottom: 0.75rem; /* Reduced from 1rem */
        }

        .form-row:last-child {
          margin-bottom: 0;
        }

        .form-group {
          margin-bottom: 0.75rem; /* Reduced from 1rem */
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-label {
          display: block;
          font-size: 0.8rem; /* Reduced from 0.875rem */
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.25rem; /* Reduced from 0.5rem */
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.5rem 0.75rem; /* Reduced from 0.75rem 1rem */
          border: 2px solid #e5e7eb;
          border-radius: 6px; /* Reduced from 8px */
          font-size: 0.8rem; /* Reduced from 0.875rem */
          background: white;
          transition: all 0.2s ease;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--gj-primary, #8b5cf6);
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1); /* Reduced from 3px */
        }

        .form-input:disabled,
        .form-select:disabled {
          background: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px; /* Reduced from 100px */
        }

        /* Checkbox and Radio Styles - Compact */
        .checkbox-options,
        .search-options,
        .content-types {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem; /* Reduced from 1rem */
          margin-bottom: 0.75rem; /* Reduced from 1rem */
        }

        .radio-options {
          display: flex;
          gap: 1.5rem; /* Reduced from 2rem */
          margin-top: 0.25rem; /* Reduced from 0.5rem */
        }

        .checkbox-label,
        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.375rem; /* Reduced from 0.5rem */
          cursor: pointer;
          font-size: 0.8rem; /* Reduced from 0.875rem */
          color: #374151;
          user-select: none;
        }

        /* Hide default checkbox/radio */
        .checkbox-label input[type="checkbox"],
        .radio-label input[type="radio"] {
          width: 16px; /* Reduced from 18px */
          height: 16px; /* Reduced from 18px */
          margin: 0;
          opacity: 0;
          position: absolute;
          z-index: -1;
        }

        /* Custom Checkbox - Compact */
        .checkmark {
          width: 16px; /* Reduced from 18px */
          height: 16px; /* Reduced from 18px */
          border: 2px solid #d1d5db;
          border-radius: 3px; /* Reduced from 4px */
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
          left: 4px; /* Adjusted for smaller size */
          top: 1px; /* Adjusted for smaller size */
          width: 3px; /* Reduced from 4px */
          height: 7px; /* Reduced from 8px */
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        /* Custom Radio - Compact */
        .radio-mark {
          width: 16px; /* Reduced from 18px */
          height: 16px; /* Reduced from 18px */
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
          width: 6px; /* Reduced from 8px */
          height: 6px; /* Reduced from 8px */
          background: var(--gj-primary, #8b5cf6);
          border-radius: 50%;
          top: 3px;
          left: 3px;
        }

        /* Focus states */
        .checkbox-label input[type="checkbox"]:focus + .checkmark,
        .radio-label input[type="radio"]:focus + .radio-mark {
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1); /* Reduced from 3px */
        }

        /* Search Type Options - Compact */
        .search-type-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem; /* Reduced from 1rem */
          margin-bottom: 0.75rem; /* Reduced from 1rem */
          padding: 0.75rem; /* Reduced from 1rem */
          background: #f8f9fa;
          border-radius: 6px; /* Reduced from 8px */
        }

        /* Sort Order in Single Row - Compact */
        .sort-order-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem; /* Reduced from 1rem */
          margin: 0.75rem 0; /* Reduced from 1rem 0 */
          padding: 0.5rem; /* Reduced from 0.75rem */
          background: #f8f9fa;
          border-radius: 4px; /* Reduced from 6px */
        }

        /* Near Words Input - Compact */
        .near-words-input {
          width: 50px; /* Reduced from 60px */
          padding: 0.2rem 0.4rem; /* Reduced padding */
          margin: 0 0.375rem; /* Reduced margin */
          border: 1px solid #d1d5db;
          border-radius: 3px; /* Reduced from 4px */
          font-size: 0.8rem; /* Reduced from 0.875rem */
          text-align: center;
        }

        .near-words-input:disabled {
          background: #f3f4f6;
          color: #9ca3af;
        }

        .near-words-input:focus {
          outline: none;
          border-color: var(--gj-primary, #8b5cf6);
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
        }

        /* Courts Section - Compact */
        .courts-section {
          border: 2px solid #e5e7eb;
          border-radius: 6px; /* Reduced from 8px */
          margin: 0.75rem 0; /* Reduced from 1rem 0 */
          overflow: hidden;
        }

        .courts-header {
          background: #f3f4f6;
          padding: 0.5rem; /* Reduced from 0.75rem */
          text-align: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .unselect-all-btn {
          background: var(--gj-primary, #8b5cf6);
          color: white;
          border: none;
          padding: 0.375rem 0.75rem; /* Reduced from 0.5rem 1rem */
          border-radius: 4px; /* Reduced from 6px */
          font-size: 0.7rem; /* Reduced from 0.75rem */
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
          padding: 0.75rem; /* Reduced from 1rem */
          background: #fafafa;
          max-height: 160px; /* Reduced from 200px */
          overflow-y: auto;
        }

        .courts-list .checkbox-label {
          display: block;
          margin-bottom: 0.5rem; /* Reduced from 0.75rem */
          padding: 0.125rem 0; /* Reduced from 0.25rem 0 */
        }

        .courts-list .checkbox-label:last-child {
          margin-bottom: 0;
        }

        .bench-section {
          padding: 0.75rem; /* Reduced from 1rem */
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        /* Search Preferences - Compact */
        .search-preferences {
          border-top: 1px solid #f3f4f6;
          padding-top: 0.75rem; /* Reduced from 1rem */
          margin-top: 0.75rem; /* Reduced from 1rem */
        }

        /* Action Buttons Section - Compact */
        .action-buttons-section {
          display: flex;
          justify-content: center;
          gap: 0.75rem; /* Reduced from 1rem */
          flex-wrap: wrap;
          margin-top: 1rem; /* Reduced from 2rem */
        }

        .search-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem; /* Reduced from 0.5rem */
          padding: 0.625rem 1.5rem; /* Reduced from 0.875rem 2rem */
          border: none;
          border-radius: 6px; /* Reduced from 8px */
          font-size: 0.8rem; /* Reduced from 0.875rem */
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
          transform: translateY(-1px); /* Reduced from -2px */
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); /* Reduced shadow */
        }

        .search-all-btn {
          background: linear-gradient(135deg, var(--gj-primary, #8b5cf6) 0%, var(--gj-secondary, #a855f7) 100%);
          color: white;
        }

        .search-all-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--gj-secondary, #a855f7) 0%, #9333ea 100%);
          transform: translateY(-1px); /* Reduced from -2px */
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3); /* Reduced shadow */
        }

        .clear-btn {
          background: #f3f4f6;
          color: #374151;
          border: 2px solid #e5e7eb;
          padding: 0.625rem 1.5rem; /* Reduced from 0.875rem 2rem */
          border-radius: 6px; /* Reduced from 8px */
          font-size: 0.8rem; /* Reduced from 0.875rem */
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 0.375rem; /* Reduced from 0.5rem */
        }

        .clear-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
          transform: translateY(-1px); /* Reduced from -2px */
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3); /* Reduced shadow */
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
          padding: 0.5rem 0.75rem; /* Reduced from 0.75rem 1rem */
          border-radius: 4px; /* Reduced from 6px */
          font-size: 0.7rem; /* Reduced from 0.75rem */
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

        /* Responsive Design - Compact */
        @media (max-width: 1200px) {
          .search-container {
            gap: 0.75rem; /* Reduced from 1.5rem */
          }
          
          .advance-search-page {
            padding: 0.75rem; /* Reduced from 1.5rem */
          }
        }

        @media (max-width: 768px) {
          .search-container {
            grid-template-columns: 1fr;
            gap: 0.75rem; /* Reduced from 1rem */
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .action-buttons-section {
            flex-direction: column;
            align-items: center;
          }
          
          .search-btn,
          .clear-btn {
            width: 100%;
            max-width: 280px; /* Reduced from 300px */
            justify-content: center;
          }
          
          .advance-search-page {
            padding: 0.75rem; /* Reduced from 1rem */
          }
          
          .page-title {
            font-size: 1.25rem; /* Reduced from 1.5rem */
          }

          .search-type-options,
          .sort-order-row {
            flex-direction: column;
            gap: 0.5rem; /* Reduced from 0.75rem */
          }
        }

        @media (max-width: 480px) {
          .checkbox-options,
          .search-options,
          .content-types {
            flex-direction: column;
            gap: 0.375rem; /* Reduced from 0.5rem */
          }
          
          .radio-options {
            flex-direction: column;
            gap: 0.375rem; /* Reduced from 0.5rem */
          }
          
          .card-content {
            padding: 0.75rem; /* Reduced from 1rem */
          }
          
          .courts-list {
            max-height: 120px; /* Reduced from 150px */
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
          width: 4px; /* Reduced from 6px */
        }

        .courts-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px; /* Reduced from 3px */
        }

        .courts-list::-webkit-scrollbar-thumb {
          background: var(--gj-primary, #8b5cf6);
          border-radius: 2px; /* Reduced from 3px */
        }

        .courts-list::-webkit-scrollbar-thumb:hover {
          background: var(--gj-secondary, #a855f7);
        }
          /* Citation dropdown styles */
/* Simple Citation Dropdown Fix */
.citation-dropdown-wrapper {
  position: relative;
}

.citation-dropdown-btn {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
}

.citation-dropdown-btn:hover {
  border-color: #8b5cf6;
}

.citation-dropdown-btn:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

/* Main dropdown container - simple fix */
.citation-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  margin-top: 2px;
  min-height: 200px;
  max-height: 300px;
}

/* Search input area */
.dropdown-search-wrapper {
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.dropdown-search-input {
  width: 100%;
  padding: 6px 30px 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.8rem;
}

.dropdown-search-icon {
  position: absolute;
  right: 18px;
  top: 14px;
  color: #6b7280;
}

/* Options list */
.dropdown-options-container {
  max-height: 220px;
  overflow-y: auto;
}

.citation-option {
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: white;
  text-align: left;
  cursor: pointer;
  font-size: 0.8rem;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
}

.citation-option:hover {
  background-color: #f8f9fa;
}

/* Loading and error states */
.citation-loading,
.citation-error {
  padding: 20px;
  text-align: center;
  font-size: 0.8rem;
}

.citation-loading {
  color: #6b7280;
}

.citation-error {
  color: #ef4444;
}

/* Backdrop */
.dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9998;
}

/* Make sure parent containers don't clip */
.search-card,
.card-content,
.form-group {
  overflow: visible !important;
}
      `}</style>
    </div>
  );
};

export default Search;