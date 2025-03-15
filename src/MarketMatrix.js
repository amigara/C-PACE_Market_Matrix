import React, { useState, useEffect } from "react";
import "./marketMatrix.css";
import CompanyModal from "./CompanyModal"; // Keep for table view

// Expanded sample data for testing the Market Matrix
const SAMPLE_DATA = {
  "C-PACE Administrators": [
    { 
      _id: "admin1", 
      name: "GreenAdmin Co", 
      logoUrl: "https://dummyimage.com/50x50/00aa00/ffffff&text=GA", 
      verified: true, 
      states: ["California", "New York", "Florida", "Texas"],
      contactInfo: "info@greenadmin.co"
    },
    { 
      _id: "admin2", 
      name: "EcoProperty Managers", 
      logoUrl: "https://dummyimage.com/50x50/22cc22/ffffff&text=EP", 
      verified: false,
      states: ["Colorado", "Washington", "Oregon"]
    },
    { 
      _id: "admin3", 
      name: "CleanEnergy Admin", 
      logoUrl: "https://dummyimage.com/50x50/44ee44/ffffff&text=CE", 
      verified: true,
      states: ["Massachusetts", "Connecticut", "Rhode Island", "New Hampshire"],
      contactInfo: "contact@cleanenergy.org"
    },
    { 
      _id: "admin4", 
      name: "SustainableOps Inc", 
      logoUrl: "https://dummyimage.com/50x50/66ff66/ffffff&text=SO", 
      verified: false,
      states: ["California", "Oregon"]
    },
    { 
      _id: "admin5", 
      name: "Pacific Admin Group", 
      logoUrl: "https://dummyimage.com/50x50/88ff88/ffffff&text=PA", 
      verified: true,
      states: ["California", "Hawaii", "Alaska"],
      contactInfo: "info@pacificadmin.com"
    },
    { 
      _id: "admin6", 
      name: "Eastern Admin LLC", 
      logoUrl: "https://dummyimage.com/50x50/aaffaa/ffffff&text=EA", 
      verified: false,
      states: ["New York", "New Jersey", "Pennsylvania", "Delaware"]
    },
    { 
      _id: "admin7", 
      name: "Midwest PACE Admin", 
      logoUrl: "https://dummyimage.com/50x50/ccffcc/ffffff&text=MP", 
      verified: true,
      states: ["Illinois", "Wisconsin", "Michigan", "Indiana", "Ohio"],
      contactInfo: "hello@midwestpace.org"
    }
  ],
  "Capital Providers": [
    { 
      _id: "capital1", 
      name: "GreenCapital Fund", 
      logoUrl: "https://dummyimage.com/50x50/0000aa/ffffff&text=GC", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "invest@greencapital.com"
    },
    { 
      _id: "capital2", 
      name: "EcoInvest Group", 
      logoUrl: "https://dummyimage.com/50x50/2222cc/ffffff&text=EI", 
      verified: false,
      states: ["New York", "New Jersey", "Pennsylvania"]
    },
    { 
      _id: "capital3", 
      name: "RenewFinance Partners", 
      logoUrl: "https://dummyimage.com/50x50/4444ee/ffffff&text=RF", 
      verified: true,
      states: ["California", "Nevada", "Arizona", "New Mexico"],
      contactInfo: "info@renewfinance.com"
    },
    { 
      _id: "capital4", 
      name: "CleanEnergy Capital", 
      logoUrl: "https://dummyimage.com/50x50/6666ff/ffffff&text=CC", 
      verified: false,
      states: ["Texas", "Oklahoma", "Louisiana"]
    },
    { 
      _id: "capital5", 
      name: "Sustainable Funding", 
      logoUrl: "https://dummyimage.com/50x50/8888ff/ffffff&text=SF", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "funding@sustainablefunding.org"
    },
    { 
      _id: "capital6", 
      name: "Pacific Investment Group", 
      logoUrl: "https://dummyimage.com/50x50/aaaaff/ffffff&text=PI", 
      verified: false,
      states: ["California", "Oregon", "Washington", "Alaska", "Hawaii"]
    },
    { 
      _id: "capital7", 
      name: "Eastern Funding LLC", 
      logoUrl: "https://dummyimage.com/50x50/ccccff/ffffff&text=EF", 
      verified: true,
      states: ["All Northeast States"],
      contactInfo: "contact@easternfunding.com"
    },
    { 
      _id: "capital8", 
      name: "Midwest PACE Capital", 
      logoUrl: "https://dummyimage.com/50x50/ddddff/ffffff&text=MP", 
      verified: false,
      states: ["Illinois", "Wisconsin", "Michigan", "Indiana", "Ohio"]
    },
    { 
      _id: "capital9", 
      name: "Southern Financing Co", 
      logoUrl: "https://dummyimage.com/50x50/eeeeff/ffffff&text=SF", 
      verified: true,
      states: ["Florida", "Georgia", "Alabama", "Mississippi", "South Carolina"],
      contactInfo: "invest@southernfinancing.com"
    }
  ],
  "Law Firms": [
    { 
      _id: "law1", 
      name: "GreenLaw Partners", 
      logoUrl: "https://dummyimage.com/50x50/aa00aa/ffffff&text=GL", 
      verified: true,
      states: ["California", "Nevada", "Arizona"],
      contactInfo: "info@greenlawpartners.com"
    },
    { 
      _id: "law2", 
      name: "EcoLegal Group", 
      logoUrl: "https://dummyimage.com/50x50/cc22cc/ffffff&text=EL", 
      verified: false,
      states: ["New York", "New Jersey", "Connecticut"]
    },
    { 
      _id: "law3", 
      name: "PACE Law Associates", 
      logoUrl: "https://dummyimage.com/50x50/ee44ee/ffffff&text=PL", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "contact@pacelawassociates.com"
    }
  ],
  "Consultants": [
    { 
      _id: "consult1", 
      name: "GreenConsult Co", 
      logoUrl: "https://dummyimage.com/50x50/aa0000/ffffff&text=GC", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "info@greenconsult.co"
    },
    { 
      _id: "consult2", 
      name: "EcoStrategy Group", 
      logoUrl: "https://dummyimage.com/50x50/cc2222/ffffff&text=ES", 
      verified: false,
      states: ["California", "Oregon", "Washington"]
    },
    { 
      _id: "consult3", 
      name: "PACE Advisory Services", 
      logoUrl: "https://dummyimage.com/50x50/ee4444/ffffff&text=PA", 
      verified: true,
      states: ["Texas", "Oklahoma", "New Mexico", "Arizona"],
      contactInfo: "hello@paceadvisory.com"
    },
    { 
      _id: "consult4", 
      name: "Sustainable Solutions", 
      logoUrl: "https://dummyimage.com/50x50/ff6666/ffffff&text=SS", 
      verified: false,
      states: ["Florida", "Georgia", "Alabama"]
    },
    { 
      _id: "consult5", 
      name: "Energy Efficiency Experts", 
      logoUrl: "https://dummyimage.com/50x50/ff8888/ffffff&text=EE", 
      verified: true,
      states: ["New York", "Massachusetts", "Connecticut"],
      contactInfo: "experts@energyefficiency.org"
    }
  ],
  "Software Providers": [
    { 
      _id: "software1", 
      name: "GreenTech Systems", 
      logoUrl: "https://dummyimage.com/50x50/00aaaa/ffffff&text=GT", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "sales@greentechsystems.com"
    },
    { 
      _id: "software2", 
      name: "EcoPlatform", 
      logoUrl: "https://dummyimage.com/50x50/22cccc/ffffff&text=EP", 
      verified: false,
      states: ["All 50 States"]
    }
  ],
  "Engineering Firms": [
    { 
      _id: "eng1", 
      name: "GreenEnergy Engineers", 
      logoUrl: "https://dummyimage.com/50x50/aaaa00/ffffff&text=GE", 
      verified: true,
      states: ["California", "Nevada", "Oregon", "Washington"],
      contactInfo: "projects@greenenergy.com"
    },
    { 
      _id: "eng2", 
      name: "EcoBuilding Design", 
      logoUrl: "https://dummyimage.com/50x50/cccc22/ffffff&text=EB", 
      verified: false,
      states: ["New York", "New Jersey", "Connecticut"]
    },
    { 
      _id: "eng3", 
      name: "Sustainable Structures", 
      logoUrl: "https://dummyimage.com/50x50/eeee44/ffffff&text=SS", 
      verified: true,
      states: ["Texas", "Oklahoma", "Louisiana"],
      contactInfo: "build@sustainablestructures.com"
    },
    { 
      _id: "eng4", 
      name: "Renewable Systems Inc", 
      logoUrl: "https://dummyimage.com/50x50/ffff66/ffffff&text=RS", 
      verified: false,
      states: ["Florida", "Georgia", "South Carolina"]
    }
  ],
  "Contractors": [
    { 
      _id: "contract1", 
      name: "GreenBuilders Co", 
      logoUrl: "https://dummyimage.com/50x50/00aaff/ffffff&text=GB", 
      verified: true,
      states: ["California", "Nevada", "Arizona"],
      contactInfo: "build@greenbuilders.co"
    },
    { 
      _id: "contract2", 
      name: "EcoConstruction Group", 
      logoUrl: "https://dummyimage.com/50x50/22ccff/ffffff&text=EC", 
      verified: false,
      states: ["Oregon", "Washington", "Idaho"]
    },
    { 
      _id: "contract3", 
      name: "PACE Installers", 
      logoUrl: "https://dummyimage.com/50x50/44eeff/ffffff&text=PI", 
      verified: true,
      states: ["New York", "New Jersey", "Pennsylvania"],
      contactInfo: "installs@paceinstallers.com"
    }
  ],
  "Property Owners": [
    { 
      _id: "owner1", 
      name: "GreenProperties LLC", 
      logoUrl: "https://dummyimage.com/50x50/ffaa00/ffffff&text=GP", 
      verified: true,
      states: ["California", "Arizona", "Nevada"],
      contactInfo: "leasing@greenproperties.com"
    },
    { 
      _id: "owner2", 
      name: "EcoEstates Group", 
      logoUrl: "https://dummyimage.com/50x50/ffcc22/ffffff&text=EE", 
      verified: false,
      states: ["New York", "Connecticut", "Massachusetts"]
    }
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
  
  // State for expanded company in grid view
  const [expandedCompany, setExpandedCompany] = useState(null);
  
  // State for modal in table view
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  // State for tracking data source
  const [dataSource, setDataSource] = useState('sample'); // 'netlify', 'window', or 'sample'

  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        // First try to fetch from Netlify function
        try {
          const response = await fetch('/api/getCompanies');
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          const data = await response.json();
          processData(data);
          setDataSource('netlify');
          console.log("Data loaded from Netlify function successfully");
        } catch (apiError) {
          console.warn("Failed to load data from Netlify function, falling back to alternatives:", apiError);
          
          // Check if it's an authentication error
          if (apiError.message && (
              apiError.message.includes("401") || 
              apiError.message.includes("403") ||
              apiError.message.includes("authentication") ||
              apiError.message.includes("unauthorized")
            )) {
            console.error("Authentication error. Please check your Airtable credentials in Netlify environment variables.");
          }
          
          // If API fails, check for window.companiesData
          if (window.companiesData) {
            processData(window.companiesData);
            setDataSource('window');
          } else {
            // Use sample data as last resort
            processData(SAMPLE_DATA);
            setDataSource('sample');
          }
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
      
      {/* Data Source Indicator */}
      <div className="data-source-indicator">
        {dataSource === 'netlify' ? (
          <span className="data-source airtable">Live data from Airtable (via Netlify)</span>
        ) : dataSource === 'window' ? (
          <span className="data-source window">Data from window.companiesData</span>
        ) : (
          <span className="data-source sample">
            Sample data 
            <span className="data-source-info">
              (Airtable connection not configured - check Netlify environment variables)
            </span>
          </span>
        )}
      </div>
      
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
