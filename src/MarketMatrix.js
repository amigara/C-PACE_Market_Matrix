import React, { useState, useEffect, useRef } from "react";
import "./marketMatrix.css";
import CompanyModal from "./CompanyModal"; // Keep for table view
import CATEGORY_ORDER, { LAYOUT_CONFIG } from "./categoryConfig"; // Import the category order and layout configuration

// List of all 50 U.S. states plus DC
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", 
  "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", 
  "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
  "District of Columbia"
];

const MarketMatrix = () => {
  const [companiesData, setCompaniesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [warnings, setWarnings] = useState(null); // Keep for logging purposes, but don't display
  const [searchTerm, setSearchTerm] = useState(''); // New state for search functionality
  const [selectedStates, setSelectedStates] = useState([]); // State for selected states
  const [stateSearchTerm, setStateSearchTerm] = useState(''); // State for searching states
  const [includeNational, setIncludeNational] = useState(true); // State for including national companies
  
  // New state variables for collapsible filters
  const [stateFilterExpanded, setStateFilterExpanded] = useState(true);
  const [categoryFilterExpanded, setCategoryFilterExpanded] = useState(true);
  
  // State for tracking window width for responsive behavior
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  
  // State for table sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'verified', // Default sort by verification status (verified first)
    direction: 'descending'
  });
  
  // State for modal in both grid and table views
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  // State for tracking data source - now we only have 'netlify'
  const [dataSource, setDataSource] = useState('netlify');

  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        // Fetch from Netlify function
        const response = await fetch('/api/getCompanies');
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `API error: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        // Check if we have the new response format with nested data
        const data = responseData.data || responseData;
        
        // Store any warnings for logging but don't display to users
        if (responseData.warning) {
          setWarnings(responseData.warning);
          console.warn("API Warning:", responseData.warning);
          
          if (responseData.availableTables) {
            console.info("Available tables:", responseData.availableTables);
          }
        }
        
        processData(data);
        setDataSource('netlify');
        console.log("Data loaded from Netlify function successfully");
      } catch (err) {
        console.error("Error fetching company data:", err);
        setError(`Failed to load company data: ${err.message}`);
        setLoading(false);
      }
    };

    const processData = (data) => {
      // If data is an array of companies with category property
      if (Array.isArray(data)) {
        // Group companies by category
        const groupedData = data.reduce((acc, company) => {
          if (!acc[company.category]) {
            acc[company.category] = [];
          }
          acc[company.category].push(company);
          return acc;
        }, {});
        
        setCompaniesData(groupedData);
      } else {
        // If data is already grouped by category
        setCompaniesData(data);
      }
      
      // Set all categories and initialize active filters
      let categories = [];
      
      if (Array.isArray(data)) {
        // For array data, extract unique categories
        categories = [...new Set(data.map(item => item.category))];
      } else {
        // For pre-grouped data, get categories from object keys
        categories = Object.keys(data);
      }
      
      // Sort categories based on the CATEGORY_ORDER configuration
      categories.sort((a, b) => {
        const indexA = CATEGORY_ORDER.indexOf(a);
        const indexB = CATEGORY_ORDER.indexOf(b);
        
        // If both categories are in the config, sort by their position
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        
        // If only one category is in the config, prioritize it
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        
        // If neither is in the config, sort alphabetically
        return a.localeCompare(b);
      });
      
      setAllCategories(categories);
      setActiveFilters(categories);
      setLoading(false);
    };

    fetchCompaniesData();
  }, []);

  // When changing view mode, reset selected state
  useEffect(() => {
    setSelectedCompany(null);
  }, [viewMode]);

  // Handle filter button clicks
  const toggleFilter = (category) => {
    if (activeFilters.includes(category)) {
      // Remove the category if it's already active
      setActiveFilters(activeFilters.filter(cat => cat !== category));
    } else {
      // Add the category if it's not active
      setActiveFilters([...activeFilters, category]);
    }
    
    // No need to reset expandedCompany anymore
  };
  
  // Select all categories
  const selectAll = () => {
    setActiveFilters([...allCategories]);
    // No need to reset expandedCompany anymore
  };
  
  // Clear all categories
  const clearAll = () => {
    setActiveFilters([]);
    // No need to reset expandedCompany anymore
  };

  // Toggle view mode
  const toggleView = (mode) => {
    setViewMode(mode);
  };
  
  // Open company modal in both grid and table views
  const openCompanyModal = (company) => {
    setSelectedCompany(company);
  };
  
  // Close company modal
  const closeCompanyModal = () => {
    setSelectedCompany(null);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // No need to reset expandedCompany anymore
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Toggle state selection
  const toggleStateSelection = (state) => {
    if (selectedStates.includes(state)) {
      setSelectedStates(selectedStates.filter(s => s !== state));
    } else {
      setSelectedStates([...selectedStates, state]);
    }
    // No need to reset expandedCompany anymore
  };
  
  // Select all states
  const selectAllStates = () => {
    setSelectedStates([...US_STATES]);
    // No need to reset expandedCompany anymore
  };
  
  // Clear all selected states
  const clearStateSelection = () => {
    setSelectedStates([]);
    // No need to reset expandedCompany anymore
  };
  
  // Filter states based on search term
  const getFilteredStates = () => {
    if (!stateSearchTerm) return US_STATES;
    return US_STATES.filter(state => 
      state.toLowerCase().includes(stateSearchTerm.toLowerCase())
    );
  };

  // Filter the data based on active filters, search term, selected states, and sort by verification status
  const getFilteredData = () => {
    if (!companiesData) return {};
    
    // First filter by categories
    const categoryFiltered = Object.entries(companiesData)
      .filter(([category]) => activeFilters.includes(category))
      .reduce((obj, [category, companies]) => {
        obj[category] = companies;
        return obj;
      }, {});
    
    // Then filter by states if any are selected
    const stateAndCategoryFiltered = selectedStates.length > 0 
      ? Object.entries(categoryFiltered).reduce((obj, [category, companies]) => {
          // Filter companies that operate in any of the selected states or nationally (if includeNational is true)
          const filteredCompanies = companies.filter(company => 
            company.states && (
              // Include if company operates in any selected state
              selectedStates.some(state => company.states.includes(state)) ||
              // Or if company operates nationally and includeNational is true
              (includeNational && company.states.includes("National"))
            )
          );
          
          if (filteredCompanies.length > 0) {
            obj[category] = filteredCompanies;
          }
          return obj;
        }, {})
      : categoryFiltered; // If no states selected, use category filtered data
    
    // Then filter by search term if one exists
    if (searchTerm.trim() === '') {
      // No search term, just sort the companies within each category
      const result = {};
      
      // Use allCategories to maintain the original order
      allCategories.forEach(category => {
        if (stateAndCategoryFiltered[category]) {
          // Sort companies to put verified ones first
          result[category] = [...stateAndCategoryFiltered[category]].sort((a, b) => {
            // If a is verified and b is not, a comes first
            if (a.verified && !b.verified) return -1;
            // If b is verified and a is not, b comes first
            if (!a.verified && b.verified) return 1;
            // Otherwise maintain original order
            return 0;
          });
        }
      });
      
      return result;
    } else {
      // Filter by search term
      const searchTermLower = searchTerm.toLowerCase();
      const result = {};
      
      // Use allCategories to maintain the original order
      allCategories.forEach(category => {
        if (stateAndCategoryFiltered[category]) {
          // Filter companies by search term
          const filteredCompanies = stateAndCategoryFiltered[category].filter(company => 
            company.name.toLowerCase().includes(searchTermLower) || 
            (company.contactInfo && company.contactInfo.toLowerCase().includes(searchTermLower)) ||
            (company.states && company.states.some(state => state.toLowerCase().includes(searchTermLower))) ||
            (company.allCategories && company.allCategories.some(cat => cat.toLowerCase().includes(searchTermLower)))
          );
          
          // Only include categories that have matching companies
          if (filteredCompanies.length > 0) {
        // Sort companies to put verified ones first
            result[category] = [...filteredCompanies].sort((a, b) => {
          // If a is verified and b is not, a comes first
          if (a.verified && !b.verified) return -1;
          // If b is verified and a is not, b comes first
          if (!a.verified && b.verified) return 1;
          // Otherwise maintain original order
          return 0;
            });
          }
        }
        });
        
      return result;
    }
  };

  // Function for sorting table columns
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Toggle state filter expansion
  const toggleStateFilter = () => {
    setStateFilterExpanded(!stateFilterExpanded);
  };
  
  // Toggle category filter expansion
  const toggleCategoryFilter = () => {
    setCategoryFilterExpanded(!categoryFilterExpanded);
  };

  // Add window resize listener for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (loading) return <div className="matrix-loading">Loading market matrix...</div>;
  if (error) return (
    <div className="matrix-error">
      <h3>Error Loading Data</h3>
      <p>{error}</p>
      <p>Please check your Airtable connection and try again.</p>
      <button 
        onClick={() => window.location.reload()} 
        className="retry-button"
      >
        Retry
      </button>
    </div>
  );

  const filteredData = getFilteredData();
  
  // Get all companies for table view
  const allCompanies = Object.entries(filteredData).reduce((acc, [category, companies]) => {
    return [...acc, ...companies.map(company => ({ ...company, category }))];
  }, []);
  
  // Sort companies for table view based on current sort configuration
  const sortedAllCompanies = [...allCompanies].sort((a, b) => {
    // Special handling for verified status (boolean)
    if (sortConfig.key === 'verified') {
      if (a.verified && !b.verified) return sortConfig.direction === 'ascending' ? 1 : -1;
      if (!a.verified && b.verified) return sortConfig.direction === 'ascending' ? -1 : 1;
      return 0;
    }
    
    // Handle regular string sorting
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    // If we're sorting by name or category but they're equal, fallback to verified status
    return a.verified === b.verified ? 0 : a.verified ? -1 : 1;
  });

  return (
    <div className="market-matrix-container">
      <h2 className="matrix-title">C-PACE Market Matrix</h2>
      
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search companies and organizations..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button className="search-clear-button" onClick={clearSearch}>
              ×
            </button>
          )}
        </div>
      </div>
      
      {/* State Filter Dropdown */}
      <div className={`state-filter-container ${!stateFilterExpanded ? 'filter-collapsed' : ''}`}>
        <div className="state-filter-header">
          <div className="filter-title-container" onClick={toggleStateFilter}>
            <span className="filter-toggle-arrow">
              {stateFilterExpanded ? '▼' : '▶'}
            </span>
            <h3 className="filters-title">
              Filter by States:
              {!stateFilterExpanded && selectedStates.length > 0 && (
                <span className="filter-count-badge">{selectedStates.length}</span>
              )}
            </h3>
          </div>
          <div className="state-filter-actions">
            {selectedStates.length > 0 && (
              <button 
                onClick={clearStateSelection}
                className="filter-button filter-button-clear-all"
              >
                Clear States
              </button>
            )}
          </div>
        </div>
        
        <div className={`collapsible-content ${stateFilterExpanded ? 'expanded' : 'collapsed'}`}>
          {stateFilterExpanded && (
            <>
              <div className="state-dropdown-container">
                {/* Remove the dropdown header that had click handler */}
                
                {/* Always show the state selection interface when section is expanded */}
                <div className="state-selection-interface">
                  <div className="state-search-container">
                    <input
                      type="text"
                      className="state-search-input"
                      placeholder="Search states..."
                      value={stateSearchTerm}
                      onChange={(e) => setStateSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="state-dropdown-actions">
                    <button 
                      className="state-action-button"
                      onClick={(e) => selectAllStates()}
                    >
                      Select All
                    </button>
                    <button 
                      className="state-action-button"
                      onClick={(e) => clearStateSelection()}
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="state-options-container">
                    {getFilteredStates().map(state => (
                      <div 
                        key={state} 
                        className={`state-option ${selectedStates.includes(state) ? 'selected' : ''}`}
                        onClick={() => toggleStateSelection(state)}
                      >
                        <span className="state-checkbox">
                          {selectedStates.includes(state) ? '✓' : ''}
                        </span>
                        <span className="state-name">{state}</span>
                      </div>
                    ))}
                    
                    {getFilteredStates().length === 0 && (
                      <div className="no-states-found">
                        No states match your search
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* National Companies Checkbox */}
              <div className="national-option-container">
                <label className="national-option-label">
                  <input
                    type="checkbox"
                    className="national-checkbox"
                    checked={includeNational}
                    onChange={() => setIncludeNational(!includeNational)}
                  />
                  <span className="national-label-text">Include companies operating nationally</span>
                </label>
              </div>
              
              {selectedStates.length > 0 && (
                <div className="selected-states-container">
                  {selectedStates.map(state => (
                    <div key={state} className="selected-state-tag">
                      {state}
                      <button 
                        className="remove-state-button"
                        onClick={() => toggleStateSelection(state)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Filter Controls */}
      <div className={`matrix-filters ${!categoryFilterExpanded ? 'filter-collapsed' : ''}`}>
        <div className="filters-header">
          <div className="filter-title-container" onClick={toggleCategoryFilter}>
            <span className="filter-toggle-arrow">
              {categoryFilterExpanded ? '▼' : '▶'}
            </span>
            <h3 className="filters-title">
              Filter Categories:
              {!categoryFilterExpanded && activeFilters.length > 0 && (
                <span className="filter-count-badge">{activeFilters.length}</span>
              )}
            </h3>
          </div>
          <div className="filters-actions">
            <button 
              onClick={selectAll}
              className="filter-button filter-button-select-all"
            >
              Select All
            </button>
            <button 
              onClick={clearAll}
              className="filter-button filter-button-clear-all"
            >
              Clear All
            </button>
          </div>
        </div>
        
        <div className={`collapsible-content ${categoryFilterExpanded ? 'expanded' : 'collapsed'}`}>
          {categoryFilterExpanded && (
        <div className="filter-buttons">
          {allCategories.map(category => (
            <button
              key={category}
              onClick={() => toggleFilter(category)}
              className={`filter-category-button ${
                activeFilters.includes(category) ? 'filter-active' : 'filter-inactive'
              }`}
            >
              {category}
              {activeFilters.includes(category) ? ' ✓' : ''}
            </button>
          ))}
            </div>
          )}
        </div>
      </div>
      
      {/* View Toggle */}
      <div className="view-toggle">
        <button 
          className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => toggleView('grid')}
        >
          Grid View
        </button>
        <button 
          className={`view-button ${viewMode === 'table' ? 'active' : ''}`}
          onClick={() => toggleView('table')}
        >
          Table View
        </button>
      </div>
      
      {/* Content Area */}
      <div className="view-content">
      {/* No categories selected message */}
      {Object.keys(filteredData).length === 0 ? (
        <div className="matrix-empty">
            {searchTerm ? (
              <div className="no-search-results">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <p>No results found for "<strong>{searchTerm}</strong>"</p>
                <button className="clear-search-button" onClick={clearSearch}>
                  Clear Search
                </button>
              </div>
            ) : (
          <p>No categories selected. Please select at least one category above.</p>
            )}
        </div>
      ) : (
        <>
          {/* Grid View with Expandable Details */}
          {viewMode === 'grid' && (
              <div className="matrix-grid" style={{ 
                gridTemplateColumns: LAYOUT_CONFIG.columnCount === 1 ? "1fr" : "repeat(2, 1fr)" 
              }}>
                {allCategories
                  .filter(category => filteredData[category]) // Only include categories that exist in filtered data
                  .map(category => (
                <div key={category} className="matrix-category-container">
                  <div className="matrix-category-title">
                    <span className="category-title-text">{category}</span>
                  </div>
                  <div className="matrix-category">
                    <div className="companies-grid">
                        {filteredData[category].map((company, index) => (
                        <React.Fragment key={company._id}>
                          <div 
                            className="company-item"
                            onClick={(e) => {
                              e.preventDefault(); // Prevent default behavior
                              openCompanyModal(company);
                            }}
                          >
                            <div className="logo-container">
                              <img 
                                src={company.logoUrl} 
                                alt={`${company.name} logo`} 
                                className="company-logo"
                              />
                              {company.verified && (
                                <div className="verified-badge">
                                  <span className="verified-badge-icon">✓</span> VERIFIED
                                </div>
                              )}
                              <div className="company-name-tooltip">
                                {company.name}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                      
                      {/* Remove the separate expandable details section at the end */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Table View with Sortable Columns and Modal */}
          {viewMode === 'table' && (
            <div className="matrix-table-container">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th className="th-logo">Logo</th>
                    <th 
                      className={`th-sortable ${sortConfig.key === 'name' ? 
                        (sortConfig.direction === 'ascending' ? 'sort-ascending' : 'sort-descending') : ''}`}
                      onClick={() => requestSort('name')}
                    >
                      Company
                    </th>
                    <th 
                      className={`th-sortable ${sortConfig.key === 'category' ? 
                        (sortConfig.direction === 'ascending' ? 'sort-ascending' : 'sort-descending') : ''}`}
                      onClick={() => requestSort('category')}
                    >
                      Category
                    </th>
                    <th 
                      className={`th-sortable ${sortConfig.key === 'verified' ? 
                        (sortConfig.direction === 'ascending' ? 'sort-ascending' : 'sort-descending') : ''}`}
                      onClick={() => requestSort('verified')}
                    >
                      Status
                    </th>
                    <th>Website</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAllCompanies.map((company) => (
                      <tr 
                        key={company._id} 
                        onClick={() => openCompanyModal(company)}
                        className="clickable-row"
                      >
                      <td className="table-logo-cell">
                        <img 
                          src={company.logoUrl} 
                          alt={`${company.name} logo`} 
                            className="table-logo"
                        />
                      </td>
                      <td>{company.name}</td>
                        <td>
                          {/* Show primary category */}
                          {company.category}
                          
                          {/* Show indicator if company belongs to multiple categories */}
                          {company.allCategories && company.allCategories.length > 1 && (
                            <span className="multiple-categories-badge" title={company.allCategories.join(', ')}>
                              +{company.allCategories.length - 1}
                            </span>
                          )}
                        </td>
                      <td>
                        {company.verified ? (
                          <span className="table-verified-badge">
                            <span className="verified-badge-icon">✓</span> VERIFIED
                          </span>
                        ) : (
                          <span className="table-unverified">—</span>
                        )}
                      </td>
                        <td onClick={(e) => e.stopPropagation()}>
                        <a 
                          href={company.websiteUrl || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <button className="website-button">
                            Visit Website
                          </button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      </div>
      
      {/* Company Modal for Both Grid and Table Views */}
      {selectedCompany && (
        <CompanyModal 
          company={selectedCompany} 
          onClose={closeCompanyModal} 
        />
      )}
    </div>
  );
};

export default MarketMatrix;
