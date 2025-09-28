// components/SearchableDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';

const SearchableDropdown = ({ 
  items, 
  selectedItem, 
  onSelect, 
  isOpen, 
  onToggle, 
  isLoading, 
  error, 
  loadingText, 
  placeholder,
  disabled = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleItemSelect = (item) => {
    onSelect(item);
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    // Prevent dropdown from closing when typing
    e.stopPropagation();
    
    // Handle Enter key to select first filtered item
    if (e.key === 'Enter' && filteredItems.length > 0) {
      handleItemSelect(filteredItems[0]);
    }
  };

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
    <div className="citation-dropdown searchable-dropdown" ref={dropdownRef}>
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
          filteredItems.map((item) => (
            <button
              key={item}
              className="citation-option"
              onClick={() => handleItemSelect(item)}
            >
              {item}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchableDropdown;