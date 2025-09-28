// pages/Citation.jsx - Updated to keep ALL existing API functionality
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import SearchableDropdown from '../components/SearchableDropdown';
import ApiService from '../services/apiService';

const Citation = () => {
  const navigate = useNavigate();

  // State for selected values
  const [selectedJournal, setSelectedJournal] = useState('Select a option');
  const [selectedYear, setSelectedYear] = useState('Select a option');
  const [selectedVolume, setSelectedVolume] = useState('Select a option');
  const [selectedPage, setSelectedPage] = useState('Select a option');
  const [selectedCourt, setSelectedCourt] = useState('All Courts Selected');

  // State for dropdown visibility
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [isPageOpen, setIsPageOpen] = useState(false);
  const [isCourtOpen, setIsCourtOpen] = useState(false);

  // State for API data
  const [journals, setJournals] = useState([]);
  const [years, setYears] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [pages, setPages] = useState([]);
  const [courts] = useState([
    'All Courts Selected',
    'Supreme Court',
    'High Courts',
    'District Courts',
    'Tribunals'
  ]);

  // Loading states
  const [isLoadingJournals, setIsLoadingJournals] = useState(true);
  const [isLoadingYears, setIsLoadingYears] = useState(false);
  const [isLoadingVolumes, setIsLoadingVolumes] = useState(false);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error states
  const [journalsError, setJournalsError] = useState('');
  const [yearsError, setYearsError] = useState('');
  const [volumesError, setVolumesError] = useState('');
  const [pagesError, setPagesError] = useState('');

  // API base URL
  const API_BASE_URL = 'http://216.172.100.173:8001';

  useEffect(() => {
    document.body.style.paddingTop = '0';
    loadJournals();

    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  // Authenticated API request helper
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

  // API Methods
  const loadJournals = async () => {
    try {
      setIsLoadingJournals(true);
      setJournalsError('');
      console.log('🔍 Loading journals...');

      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/Journals`);
      setJournals(data);
      console.log('✅ Journals loaded:', data);
    } catch (error) {
      console.error('❌ Error loading journals:', error);
      setJournalsError(error.message);
    } finally {
      setIsLoadingJournals(false);
    }
  };

  const loadYears = async (journalName) => {
    try {
      setIsLoadingYears(true);
      setYearsError('');
      console.log('🔍 Loading years for:', journalName);

      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/Journals/${encodeURIComponent(journalName)}/years`);
      setYears(data);
      console.log('✅ Years loaded for', journalName, ':', data);
    } catch (error) {
      console.error('❌ Error loading years:', error);
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
      console.log('🔍 Loading volumes for:', journalName, year);

      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/Journals/${encodeURIComponent(journalName)}/years/${year}/volumes`);
      setVolumes(data);
      console.log('✅ Volumes loaded for', journalName, year, ':', data);
    } catch (error) {
      console.error('❌ Error loading volumes:', error);
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
      console.log('🔍 Loading pages for:', journalName, year, volume);

      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/Journals/${encodeURIComponent(journalName)}/years/${year}/volumes/${encodeURIComponent(volume)}/pages`);
      setPages(data);
      console.log('✅ Pages loaded for', journalName, year, volume, ':', data);
    } catch (error) {
      console.error('❌ Error loading pages:', error);
      setPagesError(error.message);
      setPages([]);
    } finally {
      setIsLoadingPages(false);
    }
  };

  // Event Handlers
  const handleJournalSelect = (journal) => {
    setSelectedJournal(journal);
    setIsJournalOpen(false);

    // Reset dependent dropdowns
    setSelectedYear('Select a option');
    setSelectedVolume('Select a option');
    setSelectedPage('Select a option');
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
    setSelectedYear(year);
    setIsYearOpen(false);

    // Reset dependent dropdowns
    setSelectedVolume('Select a option');
    setSelectedPage('Select a option');
    setVolumes([]);
    setPages([]);

    // Clear errors
    setVolumesError('');
    setPagesError('');

    // Load volumes for selected journal and year
    if (year !== 'Select a option' && selectedJournal !== 'Select a option') {
      loadVolumes(selectedJournal, year);
    }
  };

  const handleVolumeSelect = (volume) => {
    setSelectedVolume(volume);
    setIsVolumeOpen(false);

    // Reset dependent dropdown
    setSelectedPage('Select a option');
    setPages([]);

    // Clear errors
    setPagesError('');

    // Load pages for selected journal, year, and volume
    if (volume !== 'Select a option' && selectedJournal !== 'Select a option' && selectedYear !== 'Select a option') {
      loadPages(selectedJournal, selectedYear, volume);
    }
  };

  const handlePageSelect = (page) => {
    setSelectedPage(page);
    setIsPageOpen(false);
  };

  const handleCourtSelect = (court) => {
    setSelectedCourt(court);
    setIsCourtOpen(false);
  };

 // In pages/Citation.jsx - Update the handleSearch function
const handleSearch = async (type) => {
  console.log('Search type:', type);

  // Validate required fields
  if (selectedJournal === 'Select a option') {
    alert('Please select a journal');
    return;
  }

  // Collect search data
  const searchData = {
    journal: selectedJournal,
    year: selectedYear !== 'Select a option' ? selectedYear : null,
    volume: selectedVolume !== 'Select a option' ? selectedVolume : null,
    page: selectedPage !== 'Select a option' ? selectedPage : null,
    court: selectedCourt !== 'All Courts Selected' ? selectedCourt : null,
    searchType: type
  };

  console.log('🔍 Citation search data:', searchData);

  try {
    setIsLoading(true);

    // Use the citation search API endpoint: /Judgement/Search
    const apiResponse = await ApiService.searchCitation(searchData);

    console.log('✅ Citation Search Results:', apiResponse);

    // Handle the exact API structure
    const searchResults = apiResponse.hits || [];
    const totalCount = apiResponse.total || 0;
    const courtsList = apiResponse.courtsList || [];
    const yearList = apiResponse.yearList || [];

    // ✅ Store results with COMPLETE API response data
    const resultsData = {
      results: searchResults,
      totalCount: totalCount,
      query: `${searchData.journal} ${searchData.year || ''} ${searchData.volume || ''} ${searchData.page || ''}`.trim(),
      searchType: 'Citation Search',
      timestamp: new Date().toISOString(),
      // ✅ IMPORTANT: Include API filter data
      courtsList: courtsList,
      yearList: yearList,
      searchData: searchData
    };

    console.log('💾 Storing citation results with API filter data:', resultsData);
    sessionStorage.setItem('searchResults', JSON.stringify(resultsData));

    // Navigate to results page
    navigate('/results');

  } catch (error) {
    console.error('Citation search failed:', error);
    alert(`Citation search failed: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="gojuris-layout">
      <Sidebar />

      <div className="gojuris-main">
        <Navbar />

        <div className="citation-container" style={{ padding: '2rem' }}>
          <div className="citation-content">
            <h1 className="citation-main-title">Citation Search (Law Journals of India)</h1>

            <div className="citation-form">
              <div className="citation-row">
                {/* Journal Name Dropdown */}
                <div className="citation-field">
                  <label className="citation-label">Journal Name</label>
                  <div className="citation-dropdown-wrapper">
                    <button
                      className="citation-dropdown-btn"
                      onClick={() => setIsJournalOpen(!isJournalOpen)}
                      disabled={isLoadingJournals}
                    >
                      {isLoadingJournals ? 'Loading journals...' : selectedJournal}
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
                          selectedItem={selectedJournal}
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
                <div className="citation-field">
                  <label className="citation-label">Year</label>
                  <div className="citation-dropdown-wrapper">
                    <button
                      className="citation-dropdown-btn"
                      onClick={() => setIsYearOpen(!isYearOpen)}
                      disabled={isLoadingYears || selectedJournal === 'Select a option'}
                    >
                      {isLoadingYears ? 'Loading years...' : selectedYear}
                      <i className="bx bx-chevron-down"></i>
                    </button>

                    {(isYearOpen || isLoadingYears || yearsError) && selectedJournal !== 'Select a option' && (
                      <>
                        <div
                          className="dropdown-backdrop"
                          onClick={() => setIsYearOpen(false)}
                        />
                        <SearchableDropdown
                          items={years}
                          selectedItem={selectedYear}
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

              <div className="citation-row">
                {/* Volume Dropdown */}
                <div className="citation-field">
                  <label className="citation-label">Volume</label>
                  <div className="citation-dropdown-wrapper">
                    <button
                      className="citation-dropdown-btn"
                      onClick={() => setIsVolumeOpen(!isVolumeOpen)}
                      disabled={isLoadingVolumes || selectedYear === 'Select a option'}
                    >
                      {isLoadingVolumes ? 'Loading volumes...' : selectedVolume}
                      <i className="bx bx-chevron-down"></i>
                    </button>

                    {(isVolumeOpen || isLoadingVolumes || volumesError) && selectedYear !== 'Select a option' && (
                      <>
                        <div
                          className="dropdown-backdrop"
                          onClick={() => setIsVolumeOpen(false)}
                        />
                        <SearchableDropdown
                          items={volumes}
                          selectedItem={selectedVolume}
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
                <div className="citation-field">
                  <label className="citation-label">Page</label>
                  <div className="citation-dropdown-wrapper">
                    <button
                      className="citation-dropdown-btn"
                      onClick={() => setIsPageOpen(!isPageOpen)}
                      disabled={isLoadingPages || selectedVolume === 'Select a option'}
                    >
                      {isLoadingPages ? 'Loading pages...' : selectedPage}
                      <i className="bx bx-chevron-down"></i>
                    </button>

                    {(isPageOpen || isLoadingPages || pagesError) && selectedVolume !== 'Select a option' && (
                      <>
                        <div
                          className="dropdown-backdrop"
                          onClick={() => setIsPageOpen(false)}
                        />
                        <SearchableDropdown
                          items={pages}
                          selectedItem={selectedPage}
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

              <div className="citation-actions">
                <div className="citation-buttons">
                  <button
                    className="citation-search-btn primary"
                    onClick={() => handleSearch('citations')}
                    disabled={selectedJournal === 'Select a option' || isLoading}
                  >
                    {isLoading ? 'Searching...' : 'Search Citations'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Citation;