import React, { useState, useEffect } from "react";
import "./marketMatrix.css";

const MarketMatrix = () => {
  // Existing state variables
  const [companiesData, setCompaniesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  
  // New state for view toggle
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Rest of your existing code...
  
  // Toggle view handler
  const toggleView = (mode) => {
    setViewMode(mode);
  };

  if (loading) return <div className="matrix-loading">Loading market matrix...</div>;
  if (error) return <div className="matrix-error">{error}</div>;

  const filteredData = getFilteredData();
  
  // Get all companies across categories for table view
  const allCompanies = Object.entries(filteredData).reduce((acc, [category, companies]) => {
    return [...acc, ...companies.map(company => ({ ...company, category }))];
  }, []);

  return (
    <div className="market-matrix-container">
      <h2 className="matrix-title">C-PACE Market Matrix</h2>
      
      {/* Filter Controls - same as before */}
      <div className="matrix-filters">
        {/* Your existing filter buttons */}
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
      
      {/* Conditional View Rendering */}
      {viewMode === 'grid' ? (
        /* Your existing grid code */
        <div className="matrix-grid">
          {/* ... */}
        </div>
      ) : (
        /* Table View */
        <div className="matrix-table-container">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Company</th>
                <th>Category</th>
                <th>Website</th>
              </tr>
            </thead>
            <tbody>
              {allCompanies.map((company) => (
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
                    <a 
                      href={company.websiteUrl || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MarketMatrix;
