// components/MultiSelectDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';

const MultiSelectDropdown = ({ 
  options, 
  selectedValues, 
  onChange, 
  placeholder, 
  searchable = true,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    let newSelected;
    if (selectedValues.includes(option)) {
      newSelected = selectedValues.filter(val => val !== option);
    } else {
      newSelected = [...selectedValues, option];
    }
    onChange(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) return selectedValues[0];
    return `${selectedValues.length} selected`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      <button 
        className="multi-select-button"
        onClick={handleToggle}
        type="button"
      >
        <span>{getDisplayText()}</span>
        <i className={`bx bx-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>
      
      {isOpen && (
        <div className="multi-select-options">
          {searchable && (
            <div className="multi-select-search">
              <input
                type="text"
                placeholder={`Search ${label?.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="multi-select-search-input"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          
          <div className="multi-select-option select-all" onClick={handleSelectAll}>
            <input
              type="checkbox"
              checked={selectedValues.length === options.length}
              onChange={() => {}}
            />
            <span>Select All</span>
          </div>
          
          {filteredOptions.map((option) => (
            <div
              key={option}
              className="multi-select-option"
              onClick={() => handleSelect(option)}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={() => {}}
              />
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;