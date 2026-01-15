// src/pages/UniversalSearch.jsx - UPDATED WITH ALL CHANGES
import React, { useState,useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const UniversalSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('keyword');
  const [courtFilter, setCourtFilter] = useState('all');
  const [searchField, setSearchField] = useState('all');

    // ADD THIS useEffect to remove top space
  useEffect(() => {
    document.body.style.paddingTop = '0';

    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);


  // Mock search results
  const searchResults = [
    {
      id: 1,
      title: 'Common Cause (A Regd. Society) vs Union of India',
      accuracy: '100.0%',
      court: 'SUPREME COURT OF INDIA',
      date: '09/03/2018',
      citation: '2018 Legis bilge (SC) 141 | 2018 Legis (SC) 345',
      content: 'Constitution of India — Article 21 — Right to die with dignity — Will petition seeking just declaration of the right to die with dignity as a fundamental right — Petitioner argued that termina patients should have the right to die refuse unwanted medical or continue at heading the will even out a living Will — Respondent s noted in that person they of doctors is to preserve life, preventing the suspension...',
      highlights: [
        { text: 'right to die', type: 'right' },
        { text: 'fundamental', type: 'fundamental' }
      ]
    },
    {
      id: 2,
      title: 'State of Punjab vs Davinder Pal Singh Bhullar',
      accuracy: '96.5%',
      court: 'SUPREME COURT OF INDIA',
      date: '12/04/2013',
      citation: '2013 Legis bilge (SC) 89 | 2013 Legis (SC) 234',
      content: '1) Courts are not required to hold that there is a right to die as part of the fundamental right to life of this Article: 2) The intrusion of an act in the Ninth Schedule of the Constitution renders it immune from being challenged on the grounds of infringement of fundamental rights.',
      highlights: [
        { text: 'right to die', type: 'right' },
        { text: 'fundamental', type: 'fundamental' }
      ]
    },
    {
      id: 3,
      title: 'Common Cause (A Regd. Society) vs Union of India and Another',
      accuracy: '92.8%',
      court: 'SUPREME COURT OF INDIA',
      date: '05/03/2018',
      citation: '2018 Legis bilge (SC) 142 | 2018 Legis (SC) 343',
      content: '(iii) We are thus of the opinion that the right not to die take a life saving treatment sustained by a person who is competent to take an informed decision is not covered by the common of euthanasia at it is commonly understood but a decision to withdraw the saving treatment by a patient who is competent to take decision as well as with require to a patient who is not competent to take decision can be termed...',
      highlights: [
        { text: 'right', type: 'right' },
        { text: 'die', type: 'die' },
        { text: 'is', type: 'is' },
        { text: 'competent', type: 'competent' },
        { text: 'to', type: 'to' }
      ]
    }
  ];

  const highlightText = (text, highlights) => {
    let result = text;
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight.text})`, 'gi');
      result = result.replace(regex, `<mark class="highlight-${highlight.type}">$1</mark>`);
    });
    return result;
  };

  return (
    <div className="gojuris-layout">
      <Sidebar />

      <div className="gojuris-main">
        <Navbar />

        <div className="universal-search-page">
          <div className="universal-search-container">
            {/* Search Bar Section */}
            <div className="search-section">
              <div className="search-bar-wrapper">
                <div className="search-bar">
                  {/* Combo Dropdown on LEFT */}
                  <select 
                    className="search-field-dropdown"
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="citations">Citations</option>
                    <option value="parties">Parties</option>
                    <option value="statutes">Statutes</option>
                    <option value="subjects">Subjects</option>
                  </select>

                  <input
                    type="text"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="right to die is a fundamental right"
                  />

                  {/* Vertical Divider Line */}
                  <div className="vertical-divider"></div>

                  <button className="icon-btn voice-btn">
                    <i className="bx bx-microphone"></i>
                  </button>
                  <button className="icon-btn search-btn-icon">
                    <i className="bx bx-search"></i>
                  </button>
                </div>
              </div>

              {/* Search Type Tabs - Smaller & Left-Aligned with 3 buttons */}
              <div className="search-tabs">
                <button
                  className={`tab-btn ${activeTab === 'keyword' ? 'active' : ''}`}
                  onClick={() => setActiveTab('keyword')}
                >
                  Keyword Search
                </button>
                <button
                  className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ai')}
                >
                  AI Search
                </button>
                <button
                  className={`tab-btn ${activeTab === 'deep' ? 'active' : ''}`}
                  onClick={() => setActiveTab('deep')}
                >
                  AI Deep Search
                </button>
              </div>

              {/* Court Filter */}
              <div className="search-filters">
                <span className="filter-label">Search in:</span>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="court"
                    value="supreme"
                    checked={courtFilter === 'supreme'}
                    onChange={(e) => setCourtFilter(e.target.value)}
                  />
                  <span>Supreme Court</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="court"
                    value="all"
                    checked={courtFilter === 'all'}
                    onChange={(e) => setCourtFilter(e.target.value)}
                  />
                  <span>All Courts</span>
                </label>
              </div>
            </div>

            {/* Search Results */}
            <div className="results-container">
              {searchResults.map((result) => (
                <div key={result.id} className="result-card">
                  <div className="result-header">
                    <h3 className="result-title">
                      {result.id}. {result.title}
                    </h3>
                    <span className="accuracy-badge">Accuracy: {result.accuracy}</span>
                  </div>

                  <div className="result-meta">
                    <span className="meta-item">
                      <i className="bx bx-building"></i> {result.court}
                    </span>
                    <span className="meta-item">
                      <i className="bx bx-calendar"></i> {result.date}
                    </span>
                    <span className="meta-item">
                      <i className="bx bx-file"></i> {result.citation}
                    </span>
                  </div>

                  <div className="result-content">
                    <p dangerouslySetInnerHTML={{ 
                      __html: highlightText(result.content, result.highlights) 
                    }} />
                  </div>

                  {/* Action Buttons Layout - Like Results Page */}
                  <div className="result-actions">
                    {/* Left Side - Read Full Judgement Button */}
                    <button className="read-judgement-btn">
                      <i className="bx bx-book-open"></i>
                      Read Full Judgement
                    </button>

                    {/* Right Side - Icon Buttons */}
                    <div className="icon-actions">
                      {/* Bookmark Button - Using Image */}
                      <button className="action-btn bookmark-btn" title="Bookmark">
                        <img
                          src="/bookmarkresults.png"
                          alt="Bookmark"
                          style={{ width: '40px', height: '40px' }}
                        />
                      </button>

                      {/* Print Button - Circular with Boxicon */}
                      <button className="action-btn print-btn" title="Print">
                        <i className="bx bx-printer"></i>
                      </button>

                      {/* Share Button - Circular with Boxicon */}
                      <button className="action-btn share-btn" title="Share">
                        <i className="bx bx-share-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
    min-height: 100vh;
  }

  .universal-search-page {
    background: #f8f9fa;
    padding: 0;
  }

  .universal-search-container {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    padding: 1.5rem 1rem;
  }

  /* Search Section */
  .search-section {
    background: white;
    padding: 30px;
    border-radius: 16px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .search-bar-wrapper {
    margin-bottom: 20px;
  }

  .search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    background: white;
    border: 2px solid #8b5cf6;
    border-radius: 50px;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
  }

  /* Search Field Dropdown on LEFT */
  .search-field-dropdown {
    padding: 8px 12px;
    border: none;
    background: #f3f4f6;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    cursor: pointer;
    outline: none;
    transition: all 0.3s ease;
    min-width: 120px;
  }

  .search-field-dropdown:hover {
    background: #e5e7eb;
  }

  .search-field-dropdown:focus {
    background: #ddd6fe;
    color: #8b5cf6;
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    color: #333;
    padding: 8px;
  }

  .search-input::placeholder {
    color: #999;
  }

  /* Vertical Divider Line */
  .vertical-divider {
    width: 2px;
    height: 30px;
    background: #e5e7eb;
    margin: 0 8px;
  }

  .icon-btn {
    background: transparent;
    border: none;
    padding: 8px;
    cursor: pointer;
    color: #666;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 20px;
  }

  .icon-btn:hover {
    background: #f3f4f6;
    color: #8b5cf6;
  }

  .search-btn-icon {
    background: #8b5cf6 !important;
    color: white !important;
    padding: 10px 12px;
  }

  .search-btn-icon:hover {
    background: #7c3aed !important;
  }

  /* Search Tabs - Smaller & Left-Aligned with 3 buttons */
  .search-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 8px 16px;
    border: 1px solid #e5e7eb;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: #666;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .tab-btn:hover {
    border-color: #8b5cf6;
    color: #8b5cf6;
  }

  .tab-btn.active {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border-color: #8b5cf6;
  }

  /* Search Filters */
  .search-filters {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .filter-label {
    font-weight: 500;
    color: #333;
    font-size: 15px;
  }

  .radio-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 15px;
    color: #555;
  }

  .radio-label input[type="radio"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #8b5cf6;
  }

  /* Results Container */
  .results-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Result Card */
  .result-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
  }

  .result-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-left-color: #8b5cf6;
  }

  /* Result Header */
  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    gap: 20px;
  }

  .result-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
    flex: 1;
    line-height: 1.4;
  }

  .accuracy-badge {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
  }

  /* Result Meta */
  .result-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e7eb;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #6b7280;
  }

  .meta-item i {
    color: #8b5cf6;
    font-size: 16px;
  }

  /* Result Content */
  .result-content {
    margin-bottom: 20px;
    line-height: 1.7;
  }

  .result-content p {
    color: #4b5563;
    font-size: 15px;
    margin: 0;
  }

  /* Highlighted Text */
  .result-content :global(mark) {
    border-radius: 3px;
    padding: 2px 4px;
    font-weight: 500;
  }

  .result-content :global(.highlight-right) {
    background-color: #fde68a;
    color: #92400e;
  }

  .result-content :global(.highlight-fundamental) {
    background-color: #d8b4fe;
    color: #6b21a8;
  }

  .result-content :global(.highlight-die) {
    background-color: #fecaca;
    color: #991b1b;
  }

  .result-content :global(.highlight-is) {
    background-color: #bfdbfe;
    color: #1e40af;
  }

  .result-content :global(.highlight-competent) {
    background-color: #d1fae5;
    color: #065f46;
  }

  .result-content :global(.highlight-to) {
    background-color: #fed7aa;
    color: #9a3412;
  }

  /* Result Actions - Like Results Page Layout */
  .result-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  /* Read Full Judgement Button */
  .read-judgement-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .read-judgement-btn:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }

  .read-judgement-btn i {
    font-size: 16px;
  }

  /* Icon Actions Container */
  .icon-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  /* Action Buttons - Exact Style from Results Page */
  .action-btn {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .action-btn:hover {
    transform: translateY(-1px);
  }

  /* Bookmark Button - Image */
  .bookmark-btn img {
    width: 40px;
    height: 40px;
    transition: opacity 0.2s ease;
  }

  .bookmark-btn:hover img {
    opacity: 0.7;
  }

  /* Print and Share Buttons - Circular Background */
  .print-btn i,
  .share-btn i {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: white;
    border: 1px solid #e5e7eb;
    color: #6b7280;
    font-size: 18px;
    transition: all 0.2s ease;
  }

  .print-btn:hover i,
  .share-btn:hover i {
    border-color: #8b5cf6;
    color: #8b5cf6;
    background: #f9fafb;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .universal-search-container {
      padding: 1rem;
    }

    .result-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .accuracy-badge {
      align-self: flex-start;
    }
  }

  @media (max-width: 768px) {
    .gojuris-main {
      margin-left: 60px;
      width: calc(100% - 60px);
    }

    .universal-search-container {
      padding: 0.75rem 0.5rem;
    }

    .search-section {
      padding: 20px;
    }

    .search-bar {
      flex-wrap: wrap;
    }

    .search-field-dropdown {
      min-width: 100px;
      font-size: 13px;
    }

    .vertical-divider {
      height: 25px;
    }

    .search-tabs {
      gap: 8px;
    }

    .tab-btn {
      font-size: 12px;
      padding: 6px 12px;
    }

    .search-filters {
      flex-wrap: wrap;
    }

    .result-meta {
      flex-direction: column;
      gap: 10px;
    }

    .result-actions {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
    }

    .read-judgement-btn {
      justify-content: center;
    }

    .icon-actions {
      justify-content: center;
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

export default UniversalSearch;