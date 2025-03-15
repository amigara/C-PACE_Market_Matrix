import React, { useState, useEffect } from "react";
import "./marketMatrix.css";
import CompanyModal from "./CompanyModal"; // Keep for table view

const MarketMatrix = () => {
  const [companiesData, setCompaniesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [warnings, setWarnings] = useState(null); // Keep for logging purposes, but don't display
  
  // State for table sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'verified', // Default sort by verification status (verified first)
    direction: 'descending'
  });
  
  // State for expanded company in grid view
  const [expandedCompany, setExpandedCompany] = useState(null);
  
  // State for modal in table view
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
  };
  
  // Select all categories
  const selectAll = () => {
    setActiveFilters([...allCategories]);
    setExpandedCompany(null);
  };
  
  // Clear all categories
  const clearAll = () => {
    setActiveFilters([]);
    setExpandedCompany(null);
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
  
  // Open company modal in table view
  const openCompanyModal = (company) => {
    setSelectedCompany(company);
  };
  
  // Close company modal
  const closeCompanyModal = () => {
    setSelectedCompany(null);
  };

  // Filter the data based on active filters and sort by verification status
  const getFilteredData = () => {
    if (!companiesData) return {};
    
    return Object.entries(companiesData)
      .filter(([category]) => activeFilters.includes(category))
      .reduce((obj, [category, companies]) => {
        // Sort companies to put verified ones first
        const sortedCompanies = [...companies].sort((a, b) => {
          // If a is verified and b is not, a comes first
          if (a.verified && !b.verified) return -1;
          // If b is verified and a is not, b comes first
          if (!a.verified && b.verified) return 1;
          // Otherwise maintain original order
          return 0;
        });
        
        obj[category] = sortedCompanies;
        return obj;
      }, {});
  };

  // Function for sorting table columns
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

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
      
      {/* Filter Controls */}
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
            <p>No categories selected. Please select at least one category above.</p>
          </div>
        ) : (
          <>
            {/* Grid View with Expandable Details */}
            {viewMode === 'grid' && (
              <div className="matrix-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                {Object.entries(filteredData).map(([category, companies]) => (
                  <div key={category} className="matrix-category-container">
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
                            
                            {/* Expandable company details - add after every 5th item or at end of row */}
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
                                            <div className="company-details-category">
                                              {/* Show primary category */}
                                              {category}
                                              
                                              {/* Show all categories if company belongs to multiple */}
                                              {c.allCategories && c.allCategories.length > 1 && (
                                                <div className="company-all-categories">
                                                  <span className="all-categories-label">All categories: </span>
                                                  <div className="categories-tags">
                                                    {c.allCategories.map((cat, i) => (
                                                      <span key={i} className="category-tag">{cat}</span>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
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
                                          
                                          <div className="company-details-section">
                                            <h4 className="company-details-section-title">Contact Information</h4>
                                            {c.contactInfo ? (
                                              <p>{c.contactInfo}</p>
                                            ) : (
                                              <p className="company-details-empty">No contact information available</p>
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
                      <tr key={company._id}>
                        <td className="table-logo-cell">
                          <img 
                            src={company.logoUrl} 
                            alt={`${company.name} logo`} 
                            className="table-logo clickable"
                            onClick={() => openCompanyModal(company)}
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Company Modal for Table View */}
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
