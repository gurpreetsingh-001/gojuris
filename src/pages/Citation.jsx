// src/pages/Citation.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Citation = () => {
  const [selectedJournal, setSelectedJournal] = useState('Select a option');
  const [selectedYear, setSelectedYear] = useState('Select a option');
  const [selectedVolume, setSelectedVolume] = useState('Select a option');
  const [selectedPage, setSelectedPage] = useState('Select a option');
  const [selectedCourt, setSelectedCourt] = useState('All Courts Selected');

  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [isPageOpen, setIsPageOpen] = useState(false);
  const [isCourtOpen, setIsCourtOpen] = useState(false);

  useEffect(() => {
    document.body.style.paddingTop = '0';
    
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  const journals = [
    'All India Reporter (AIR)',
    'Supreme Court Cases (SCC)',
    'Bombay High Court Reports (BHC)',
    'Delhi Law Times (DLT)',
    'Indian Law Reports (ILR)',
    'Madras Law Journal (MLJ)'
  ];

  const years = ['2024', '2023', '2022', '2021', '2020', '2019', '2018'];
  const volumes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const pages = ['1-50', '51-100', '101-150', '151-200', '201-250', '251-300'];
  const courts = [
    'All Courts Selected',
    'Supreme Court',
    'High Courts',
    'District Courts',
    'Tribunals'
  ];

  const handleSearch = (type) => {
    console.log('Search type:', type);
  };

  return (
    <div className="gojuris-layout">
      <Sidebar />
      
      <div className="gojuris-main">
        {/* Replace the old header with Navbar component */}
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
                    >
                      {selectedJournal}
                      <i className="bx bx-chevron-down"></i>
                    </button>
                    
                    {isJournalOpen && (
                      <>
                        <div 
                          className="dropdown-backdrop"
                          onClick={() => setIsJournalOpen(false)}
                        />
                        <div className="citation-dropdown">
                          {journals.map((journal) => (
                            <button
                              key={journal}
                              className="citation-option"
                              onClick={() => {
                                setSelectedJournal(journal);
                                setIsJournalOpen(false);
                              }}
                            >
                              {journal}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="citation-field">
                  <label className="citation-label">Year</label>
                  <div className="citation-dropdown-wrapper">
                    <button
                      className="citation-dropdown-btn"
                      onClick={() => setIsYearOpen(!isYearOpen)}
                    >
                      {selectedYear}
                      <i className="bx bx-chevron-down"></i>
                    </button>
                    
                    {isYearOpen && (
                      <>
                        <div 
                          className="dropdown-backdrop"
                          onClick={() => setIsYearOpen(false)}
                        />
                        <div className="citation-dropdown">
                          {years.map((year) => (
                            <button
                              key={year}
                              className="citation-option"
                              onClick={() => {
                                setSelectedYear(year);
                                setIsYearOpen(false);
                              }}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="citation-row">
                <div className="citation-field">
                  <label className="citation-label">Volume</label>
                  <div className="citation-dropdown-wrapper">
                    <button
                      className="citation-dropdown-btn"
                      onClick={() => setIsVolumeOpen(!isVolumeOpen)}
                    >
                      {selectedVolume}
                      <i className="bx bx-chevron-down"></i>
                    </button>
                    
                    {isVolumeOpen && (
                      <>
                        <div 
                          className="dropdown-backdrop"
                          onClick={() => setIsVolumeOpen(false)}
                        />
                        <div className="citation-dropdown">
                          {volumes.map((volume) => (
                            <button
                              key={volume}
                              className="citation-option"
                              onClick={() => {
                                setSelectedVolume(volume);
                                setIsVolumeOpen(false);
                              }}
                            >
                              {volume}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="citation-field">
                  <label className="citation-label">Page</label>
                  <div className="citation-dropdown-wrapper">
                    <button
                      className="citation-dropdown-btn"
                      onClick={() => setIsPageOpen(!isPageOpen)}
                    >
                      {selectedPage}
                      <i className="bx bx-chevron-down"></i>
                    </button>
                    
                    {isPageOpen && (
                      <>
                        <div 
                          className="dropdown-backdrop"
                          onClick={() => setIsPageOpen(false)}
                        />
                        <div className="citation-dropdown">
                          {pages.map((page) => (
                            <button
                              key={page}
                              className="citation-option"
                              onClick={() => {
                                setSelectedPage(page);
                                setIsPageOpen(false);
                              }}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
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
                              onClick={() => {
                                setSelectedCourt(court);
                                setIsCourtOpen(false);
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
              <div className="citation-actions">
                <div className="citation-buttons">
                  <button 
                    className="citation-search-btn primary"
                    onClick={() => handleSearch('citations')}
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