import React, { useState, useEffect, useRef } from "react";
import "./marketMatrix.css";

// Masonry layout component
const MasonryGrid = ({ children }) => {
  const gridRef = useRef(null);
  const [columns, setColumns] = useState(3); // Default column count
  
  useEffect(() => {
    // Function to determine column count based on viewport width
    const updateColumns = () => {
      if (window.innerWidth >= 1200) {
        setColumns(3); // 3 columns for large screens
      } else if (window.innerWidth >= 768) {
        setColumns(2); // 2 columns for medium screens
      } else {
        setColumns(1); // 1 column for small screens
      }
    };
    
    // Initial column setup
    updateColumns();
    
    // Add resize listener to adjust columns on viewport changes
    window.addEventListener('resize', updateColumns);
    
    return () => {
      window.removeEventListener('resize', updateColumns);
    };
  }, []);

  // Create arrays for each column
  const createMasonryLayout = () => {
    const columnItems = Array.from({ length: columns }, () => []);
    const childrenArray = React.Children.toArray(children);
    
    // Distribute items across columns using height-optimized approach
    childrenArray.forEach((child, index) => {
      // Simple distribution - find the shortest column
      const shortestColumnIndex = columnItems
        .map(column => column.reduce((height, item) => height + (item.props.estimatedHeight || 100), 0))
        .reduce((shortestIndex, height, index, heights) => 
          height < heights[shortestIndex] ? index : shortestIndex, 0);
      
      columnItems[shortestColumnIndex].push(
        React.cloneElement(child, { key: `masonry-item-${index}` })
      );
    });
    
    return columnItems;
  };
  
  const columnItems = createMasonryLayout();
  
  return (
    <div className="masonry-grid" ref={gridRef}>
      {columnItems.map((column, columnIndex) => (
        <div key={`masonry-column-${columnIndex}`} className="masonry-column">
          {column}
        </div>
      ))}
    </div>
  );
};

// Modified MarketMatrix component
const MarketMatrix = () => {
  const [companiesData, setCompaniesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for table sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'verified', // Default sort by verification status
    direction: 'descending'
  });
  
  // State for expanded company in grid view
  const [expandedCompany, setExpandedCompany] = useState(null);
  
  // State for selected company in table view
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  // Sample data import and other logic from original component
  // For brevity, assuming SAMPLE_DATA is imported or defined elsewhere
  
  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset expanded/selected states when searching
    setExpandedCompany(null);
    setSelectedCompany(null);
  };
  
  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        // In production, this would check for window.companiesData first
        if (window.companiesData) {
          processData(window.companiesData);
        } else {
          // Use sample data for development
          const data = SAMPLE_DATA;
          processData(data);
        }
      } catch (err) {
        console.error("Error fetching company data:", err);
        setError("Failed to load company data. Please try again later.");
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
      const categories = Array.isArray(data) 
        ? [...new Set(data.map(item => item.category))]
        : Object.keys(data);
      
      setAllCategories(categories);
      setActiveFilters(categories);
      setLoading(false);
    };

    fetchCompaniesData();
  }, []);

  // When changing view mode, reset expanded/selected states
  useEffect(() => {
    setExpandedCompany(null);
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
    
    // Reset expanded company when filters change
    setExpandedCompany(null);
    setSelectedCompany(null);
  };
  
  // Select all categories
  const selectAll = () => {
    setActiveFilters([...allCategories]);
    setExpandedCompany(null);
    setSelectedCompany(null);
  };
  
  // Clear all categories
  const clearAll = () => {
    setActiveFilters([]);
    setExpandedCompany(null);
    setSelectedCompany(null);
  };
  
  // Toggle view mode
  const toggleView = (mode) => {
    setViewMode(mode);
  };
  
  // Toggle expanded company in grid view
  const toggleExpandedCompany = (companyId, e) => {
    e.preventDefault(); // Prevent default link behavior
    if (expandedCompany === companyId) {
      setExpandedCompany(null);
    } else {
      setExpandedCompany(companyId);
    }
  };
  
  // Get filtered data with search functionality
  const getFilteredData = () => {
    if (!companiesData) return {};
    
    // First filter by active categories
    const categoriesFiltered = Object.entries(companiesData)
      .filter(([category]) => activeFilters.includes(category))
      .reduce((obj, [category, companies]) => {
        obj[category] = companies;
        return obj;
      }, {});
    
    // If no search term, just sort by verification status
    if (!searchTerm.trim()) {
      return Object.entries(categoriesFiltered)
        .reduce((obj, [category, companies]) => {
          // Sort companies to put verified ones first
          const sortedCompanies = [...companies].sort((a, b) => {
            if (a.verified && !b.verified) return -1;
            if (!a.verified && b.verified) return 1;
            return 0;
          });
          
          obj[category] = sortedCompanies;
          return obj;
        }, {});
    }
    
    // If there is a search term, filter companies by name
    const searchResults = {};
    const searchTermLower = searchTerm.toLowerCase().trim();
    
    Object.entries(categoriesFiltered).forEach(([category, companies]) => {
      const filteredCompanies = companies.filter(company => 
        company.name.toLowerCase().includes(searchTermLower)
      );
      
      // Only include categories that have matching companies
      if (filteredCompanies.length > 0) {
        // Sort companies to put verified ones first
        const sortedCompanies = [...filteredCompanies].sort((a, b) => {
          if (a.verified && !b.verified) return -1;
          if (!a.verified && b.verified) return 1;
          return 0;
        });
        
        searchResults[category] = sortedCompanies;
      }
    });
    
    return searchResults;
  };
  
  // Function for sorting table columns
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Calculate estimated height for masonry layout
  const estimateCategoryHeight = (companies) => {
    // Base height for the category container
    const baseHeight = 120;
    // Estimate number of rows based on company count (assuming 5 per row)
    const numRows = Math.ceil(companies.length / 5);
    // Height per row of company logos
    const rowHeight = 70;
    // Calculate total estimated height
    return baseHeight + (numRows * rowHeight);
  };

  if (loading) return <div className="matrix-loading">Loading market matrix...</div>;
  if (error) return <div className="matrix-error">{error}</div>;

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
    // If sorting by name or category but they're equal, fallback to verified status
    return a.verified === b.verified ? 0 : a.verified ? -1 : 1;
  });

  return (
    <div className="market-matrix-container">
      <h2 className="matrix-title">C-PACE Market Matrix</h2>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button 
              className="search-clear-button"
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {/* Filter Categories Section */}
      <div className="matrix-filters">
        <div className="filters-header">
          <h3 className="filters-title">Filter Categories:</h3>
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
      </div>
      
      {/* View Options Section */}
      <div className="matrix-filters">
        <div className="filters-header">
          <h3 className="filters-title">View Options:</h3>
        </div>
        
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
      </div>
      
      {/* No results message */}
      {searchTerm.trim() !== '' && Object.keys(filteredData).length === 0 ? (
        <div className="matrix-empty">
          <p>No companies match your search for "{searchTerm}". Try a different search term.</p>
        </div>
      ) : Object.keys(filteredData).length === 0 ? (
        <div className="matrix-empty">
          <p>No categories selected. Please select at least one category above.</p>
        </div>
      ) : (
        <>
          {/* Grid View with Masonry Layout */}
          {viewMode === 'grid' && (
            <MasonryGrid>
              {Object.entries(filteredData).map(([category, companies]) => {
                // Estimate the height for better masonry distribution
                const estimatedHeight = estimateCategoryHeight(companies);
                
                return (
                  <div 
                    key={category} 
                    className={`matrix-category-container ${
                      expandedCompany && companies.some(c => c._id === expandedCompany) ? 'expanded' : ''
                    }`}
                    estimatedHeight={estimatedHeight}
                  >
                    <div className="matrix-category-title">
                      <span className="category-title-text">{category}</span>
                    </div>
                    <div className="matrix-category">
                      <div className="companies-grid">
                        {companies.map((company, index) => (
                          <React.Fragment key={company._id}>
                            <div 
                              className={`company-item ${expandedCompany === company._id ? 'active' : ''}`}
                              onClick={(e) => toggleExpandedCompany(company._id, e)}
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
                            
                            {/* Expandable company details - after every 5th item or at end of row */}
                            {(index + 1) % 5 === 0 || index === companies.length - 1 ? (
                              <div 
                                className={`company-details-wrapper ${
                                  expandedCompany === company._id || 
                                  (expandedCompany && companies.slice(Math.floor(index / 5) * 5, index + 1).some(c => c._id === expandedCompany))
                                    ? 'expanded' 
                                    : ''
                                }`}
                              >
                                {expandedCompany && companies.slice(Math.max(0, Math.floor(index / 5) * 5), index + 1).map(c => {
                                  if (c._id === expandedCompany) {
                                    return (
                                      <div key={c._id} className="company-details">
                                        <button 
                                          className="company-details-close" 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setExpandedCompany(null);
                                          }}
                                        >
                                          ×
                                        </button>
                                        
                                        <div className="company-details-header">
                                          <img 
                                            src={c.logoUrl} 
                                            alt={`${c.name} logo`}
                                            className="company-details-logo" 
                                          />
                                          <div className="company-details-info">
                                            <h3 className="company-details-name">
                                              {c.name}
                                              {c.verified && (
                                                <span className="table-verified-badge" style={{marginLeft: '8px', verticalAlign: 'middle'}}>
                                                  <span className="verified-badge-icon">✓</span> VERIFIED
                                                </span>
                                              )}
                                            </h3>
                                            <div className="company-details-category">{category}</div>
                                          </div>
                                        </div>
                                        
                                        <div className="company-details-sections">
                                          <div className="company-details-section">
                                            <h4 className="company-details-section-title">States of Operation</h4>
                                            {c.states && c.states.length > 0 ? (
                                              <div className="company-states-list">
                                                {c.states.map((state, i) => (
                                                  <span key={i} className="company-state-tag">{state}</span>
                                                ))}
                                              </div>
                                            ) : (
                                              <p className="company-details-empty">No state information available</p>
                                            )}
                                          </div>
                                        </div>
                                        
                                        <div className="company-details-actions">
                                          <a 
                                            href={c.websiteUrl || "#"} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="company-website-button"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            Visit Website
                                          </a>
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            ) : null}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </MasonryGrid>
          )}
          
          {/* Table View with Expandable Rows */}
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
                    <React.Fragment key={company._id}>
                      <tr className={selectedCompany === company._id ? 'row-expanded' : ''}>
                        <td className="table-logo-cell">
                          <img 
                            src={company.logoUrl} 
                            alt={`${company.name} logo`} 
                            className="table-logo clickable"
                            onClick={() => {
                              if (selectedCompany === company._id) {
                                setSelectedCompany(null);
                              } else {
                                setSelectedCompany(company._id);
                              }
                            }}
                          />
                        </td>
                        <td>{company.name}</td>
                        <td>{company.category}</td>
                        <td>
                          {company.verified ? (
                            <span className="table-verified-badge">
                              <span className="verified-badge-icon">✓</span> VERIFIED
                            </span>
                          ) : (
                            <span className="table-unverified">—</span>
                          )}
                        </td>
                        <td>
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
                      
                      {/* Expandable row for company details */}
                      {selectedCompany === company._id && (
                        <tr className="expanded-details-row">
                          <td colSpan="5">
                            <div className="table-company-details">
                              <div className="table-company-details-sections">
                                <div className="table-company-details-section">
                                  <h4 className="table-details-section-title">States of Operation</h4>
                                  {company.states && company.states.length > 0 ? (
                                    <div className="table-company-states-list">
                                      {company.states.map((state, i) => (
                                        <span key={i} className="table-company-state-tag">{state}</span>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="table-details-empty">No state information available</p>
                                  )}
                                </div>
                              </div>
                              
                              <button 
                                className="table-details-close" 
                                onClick={() => setSelectedCompany(null)}
                              >
                                ×
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MarketMatrix;
