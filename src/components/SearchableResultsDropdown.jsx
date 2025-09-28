// components/SearchableResultsDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';

const SearchableResultsDropdown = ({ 
  items, 
  selectedItem, 
  onSelect, 
  isOpen, 
  onToggle, 
  placeholder,
  icon,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Clear search term when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onToggle]);

  const handleItemSelect = (item) => {
    onSelect(item);
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    e.stopPropagation();
    
    if (e.key === 'Enter' && filteredItems.length > 0) {
      handleItemSelect(filteredItems[0]);
    }
  };

  return (
    <div className={`dropdown-container ${className}`} ref={dropdownRef}>
      <button 
        className="filter-btn dropdown-toggle"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle(!isOpen);
        }}
      >
        {icon && <i className={`${icon} me-1`}></i>}
        {selectedItem}
      </button>
      
      {isOpen && (
        <div className="dropdown-menu searchable-results-dropdown" style={{ display: 'block' }}>
          {/* Search Input */}
          <div className="dropdown-search-wrapper">
            <input
              ref={searchInputRef}
              type="text"
              className="dropdown-search-input"
              placeholder={`Search ${placeholder?.toLowerCase()}...`}
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onClick={(e) => e.stopPropagation()}
            />
            <i className="bx bx-search dropdown-search-icon"></i>
          </div>

          {/* Filtered Options */}
          <div className="dropdown-options-container">
            {filteredItems.length === 0 ? (
              <div className="no-results">No results found</div>
            ) : (
              filteredItems.map((item, index) => (
                <button
                  key={`${item}-${index}`}
                  className={`dropdown-item ${item === selectedItem ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleItemSelect(item);
                  }}
                >
                  {item}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableResultsDropdown;