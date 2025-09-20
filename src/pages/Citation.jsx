// src/pages/Citation.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ApiService from '../services/apiService';

const Citation = () => {
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

  const handleSearch = (type) => {
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
    
    // Show temporary alert for API integration pending
    alert(`Citation search initiated!\n\nSearch Data:\n${JSON.stringify(searchData, null, 2)}\n\n⚠️ API Integration Pending\nThe citation search API endpoint is not yet finalized. This is a placeholder response.`);
  };

  const renderDropdown = (isOpen, items, onSelect, isLoading, error, loadingText) => {
    if (isLoading) {
      return (
        <div className="citation-dropdown">
          <div className="citation-loading">{loadingText}</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="citation-dropdown">
          <div className="citation-error">Error: {error}</div>
        </div>
      );
    }

    if (!isOpen || items.length === 0) {
      return null;
    }

    return (
      <div className="citation-dropdown">
        {items.map((item) => (
          <button
            key={item}
            className="citation-option"
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        ))}
      </div>
    );
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
                        {renderDropdown(isJournalOpen, journals, handleJournalSelect, isLoadingJournals, journalsError, 'Loading journals...')}
                      </>
                    )}
                  </div>
                  {journalsError && <div className="citation-error">{journalsError}</div>}
                </div>

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
                        {renderDropdown(isYearOpen, years, handleYearSelect, isLoadingYears, yearsError, 'Loading years...')}
                      </>
                    )}
                  </div>
                  {yearsError && <div className="citation-error">{yearsError}</div>}
                </div>
              </div>

              <div className="citation-row">
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
                        {renderDropdown(isVolumeOpen, volumes, handleVolumeSelect, isLoadingVolumes, volumesError, 'Loading volumes...')}
                      </>
                    )}
                  </div>
                  {volumesError && <div className="citation-error">{volumesError}</div>}
                </div>

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
                        {renderDropdown(isPageOpen, pages, handlePageSelect, isLoadingPages, pagesError, 'Loading pages...')}
                      </>
                    )}
                  </div>
                  {pagesError && <div className="citation-error">{pagesError}</div>}
                </div>
              </div>
   
              <div className="citation-court-field">
                <div className="citation-dropdown-wrapper full-width">
                  <button
                    className="citation-dropdown-btn"
                    onClick={() => setIsCourtOpen(!isCourtOpen)}
                  >
                    {selectedCourt}
                    <i className="bx bx-chevron-down"></i>
                  </button>
                  
                  {isCourtOpen && (
                    <>
                      <div 
                        className="dropdown-backdrop"
                        onClick={() => setIsCourtOpen(false)}
                      />
                      <div className="citation-dropdown">
                        {courts.map((court) => (
                          <button
                            key={court}
                            className="citation-option"
                            onClick={() => handleCourtSelect(court)}
                          >
                            {court}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="citation-actions">
                <div className="citation-buttons">
                  <button 
                    className="citation-search-btn primary"
                    onClick={() => handleSearch('citations')}
                    disabled={selectedJournal === 'Select a option'}
                  >
                    Search Citations
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