// src/components/SearchInterface.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchInterface = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('search');
  const [isJurisdictionOpen, setIsJurisdictionOpen] = useState(false);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('Filter');
  const [searchQuery, setSearchQuery] = useState('What is the statute of limitations for filing a civil case in India?');

  const tabs = [
    { id: 'chat', label: 'Chat', icon: 'bx-chat' },
    { id: 'search', label: 'Search', icon: 'bx-search' },
    { id: 'database', label: 'Database', icon: 'bx-data' },
    { id: 'virtual', label: 'Virtual Assistance', icon: 'bx-bot' }
  ];

  const jurisdictions = [
    'India',
    'United States',
    'United Kingdom', 
    'Canada',
    'Australia',
    'European Union'
  ];

  const actionButtons = [
    'Summarize the case',
    'Ask same question with new jurisdiction',
    'Draft a memo based on this output',
    'Advanced Search'
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleJurisdictionSelect = (jurisdiction) => {
    setSelectedJurisdiction(jurisdiction);
    setIsJurisdictionOpen(false);
  };

  const handleAdvanceSearch = () => {
    navigate('/search');
  };

  const handleActionClick = (button, index) => {
    if (button === 'Advanced Search') {
      handleAdvanceSearch();
    } else {
      // Handle other button actions
      console.log(`Clicked: ${button}`);
    }
  };

  const handleSearch = () => {
    console.log('Search clicked:', {
      query: searchQuery,
      jurisdiction: selectedJurisdiction,
      activeTab: activeTab
    });
      navigate('/results');
  };

  return (
    <section className="search-interface-compact">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="search-card-compact">
              {/* Tabs Row */}
              <div className="tabs-row">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <i className={`bx ${tab.icon}`}></i>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Search Input Row */}
              <div className="search-row">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    className="search-input-compact"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What is the statute of limitations for filing a civil case in India?"
                  />
                </div>
                
                <div className="jurisdiction-wrapper">
                  <button
                    className="jurisdiction-btn"
                    onClick={() => setIsJurisdictionOpen(!isJurisdictionOpen)}
                  >
                    Jurisdiction: {selectedJurisdiction}
                    <i className="bx bx-chevron-down"></i>
                  </button>
                  
                  {isJurisdictionOpen && (
                    <>
                      <div 
                        className="dropdown-backdrop"
                        onClick={() => setIsJurisdictionOpen(false)}
                      />
                      <div className="jurisdiction-dropdown">
                        {jurisdictions.map((jurisdiction) => (
                          <button
                            key={jurisdiction}
                            className="jurisdiction-item"
                            onClick={() => handleJurisdictionSelect(jurisdiction)}
                          >
                            {jurisdiction}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <button className="search-submit-btn" onClick={handleSearch}>
                  <i className="bx bx-right-arrow-alt"></i>
                </button>
              </div>

              {/* Action Buttons Row */}
              <div className="action-buttons-row">
                {actionButtons.map((button, index) => (
                  <button
                    key={index}
                    className="action-btn-compact"
                    onClick={() => handleActionClick(button, index)}
                  >
                    {button}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchInterface;