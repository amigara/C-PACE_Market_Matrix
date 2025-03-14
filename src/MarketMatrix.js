import React, { useState, useEffect } from "react";
import "./marketMatrix.css";

// Sample data for testing in CodeSandbox
const SAMPLE_DATA = {
  "C-PACE Administrators": [
    { _id: "1", name: "GreenAdmin Co", logoUrl: "https://dummyimage.com/50x50/00aa00/ffffff&text=GA", verified: true },
    { _id: "2", name: "EcoProperty Managers", logoUrl: "https://dummyimage.com/50x50/22cc22/ffffff&text=EP", verified: false },
    { _id: "3", name: "CleanEnergy Admin", logoUrl: "https://dummyimage.com/50x50/44ee44/ffffff&text=CE", verified: true },
  ],
  "Capital Providers": [
    { _id: "5", name: "GreenCapital Fund", logoUrl: "https://dummyimage.com/50x50/0000aa/ffffff&text=GC", verified: true },
    { _id: "6", name: "EcoInvest Group", logoUrl: "https://dummyimage.com/50x50/2222cc/ffffff&text=EI", verified: false },
  ],
  "Law Firms": [
    { _id: "9", name: "GreenLaw Partners", logoUrl: "https://dummyimage.com/50x50/aa00aa/ffffff&text=GL", verified: false },
  ]
};

const MarketMatrix = () => {
  const [companiesData, setCompaniesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  
  // State for table sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'verified', // Default sort by verification status (verified first)
    direction: 'descending'
  });

  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        // In CodeSandbox, use the sample data
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

  // Handle filter button clicks
  const toggleFilter = (category) => {
    if (activeFilters.includes(category)) {
      // Remove the category if it's already active
      setActiveFilters(activeFilters.filter(cat => cat !== category));
    } else {
      // Add the category if it's not active
      setActiveFilters([...activeFilters, category]);
    }
  };
  
  // Select all categories
  const selectAll = () => {
    setActiveFilters([...allCategories]);
  };
  
  // Clear all categories
  const clearAll = () => {
    setActiveFilters([]);
  };

  // Toggle view mode
  const toggleView = (mode) => {
    setViewMode(mode);
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
      
      {/* No categories selected message */}
      {Object.keys(filteredData).length === 0 ? (
        <div className="matrix-empty">
          <p>No categories selected. Please select at least one category above.</p>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="matrix-grid">
              {Object.entries(filteredData).map(([category, companies]) => (
                <div key={category} className="matrix-category-container">
                  <div className="matrix-category-title">
                    <span className="category-title-text">{category}</span>
                  </div>
                  <div className="matrix-category">
                    <div className="companies-grid">
                      {companies.map((company) => (
                        <a 
                          key={company._id} 
                          href={company.websiteUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="company-item"
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
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Table View with Improved Sortable Columns */}
          {viewMode === 'table' && (
            <div className="matrix-table-container">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th className="th-logo">Logo</th>
                    <th 
                      className={`th-sortable ${sortConfig.key === 'name' ? 'sort-active' : ''}`}
                      onClick={() => requestSort('name')}
                      data-sort-direction={sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                    >
                      Company
                    </th>
                    <th 
                      className={`th-sortable ${sortConfig.key === 'category' ? 'sort-active' : ''}`}
                      onClick={() => requestSort('category')}
                      data-sort-direction={sortConfig.key === 'category' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                    >
                      Category
                    </th>
                    <th 
                      className={`th-sortable ${sortConfig.key === 'verified' ? 'sort-active' : ''}`}
                      onClick={() => requestSort('verified')}
                      data-sort-direction={sortConfig.key === 'verified' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
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
                          className="table-logo"
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
