import React, { useState, useEffect } from "react";
import "./marketMatrix.css";
import CompanyModal from "./CompanyModal"; // Keep for grid view

// Expanded sample data for testing the Market Matrix with randomized logo colors
const SAMPLE_DATA = {
  "C-PACE Administrators": [
    { 
      _id: "admin1", 
      name: "GreenAdmin Co", 
      logoUrl: "https://dummyimage.com/50x50/3498db/ffffff&text=GA", 
      verified: true, 
      states: ["California", "New York", "Florida", "Texas"],
      contactInfo: "info@greenadmin.co"
    },
    { 
      _id: "admin2", 
      name: "EcoProperty Managers", 
      logoUrl: "https://dummyimage.com/50x50/e74c3c/ffffff&text=EP", 
      verified: false,
      states: ["Colorado", "Washington", "Oregon"]
    },
    { 
      _id: "admin3", 
      name: "CleanEnergy Admin", 
      logoUrl: "https://dummyimage.com/50x50/9b59b6/ffffff&text=CE", 
      verified: true,
      states: ["Massachusetts", "Connecticut", "Rhode Island", "New Hampshire"],
      contactInfo: "contact@cleanenergy.org"
    },
    { 
      _id: "admin4", 
      name: "SustainableOps Inc", 
      logoUrl: "https://dummyimage.com/50x50/f1c40f/000000&text=SO", 
      verified: false,
      states: ["California", "Oregon"]
    },
    { 
      _id: "admin5", 
      name: "Pacific Admin Group", 
      logoUrl: "https://dummyimage.com/50x50/2ecc71/ffffff&text=PA", 
      verified: true,
      states: ["California", "Hawaii", "Alaska"],
      contactInfo: "info@pacificadmin.com"
    },
    { 
      _id: "admin6", 
      name: "Eastern Admin LLC", 
      logoUrl: "https://dummyimage.com/50x50/1abc9c/ffffff&text=EA", 
      verified: false,
      states: ["New York", "New Jersey", "Pennsylvania", "Delaware"]
    },
    { 
      _id: "admin7", 
      name: "Midwest PACE Admin", 
      logoUrl: "https://dummyimage.com/50x50/d35400/ffffff&text=MP", 
      verified: true,
      states: ["Illinois", "Wisconsin", "Michigan", "Indiana", "Ohio"],
      contactInfo: "hello@midwestpace.org"
    }
  ],
  "Capital Providers": [
    { 
      _id: "capital1", 
      name: "GreenCapital Fund", 
      logoUrl: "https://dummyimage.com/50x50/27ae60/ffffff&text=GC", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "invest@greencapital.com"
    },
    { 
      _id: "capital2", 
      name: "GreenCapital Fund", 
      logoUrl: "https://dummyimage.com/50x50/27ae60/ffffff&text=GC", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "invest@greencapital.com"
    },
    { 
      _id: "capital3", 
      name: "GreenCapital Fund", 
      logoUrl: "https://dummyimage.com/50x50/27ae60/ffffff&text=GC", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "invest@greencapital.com"
    },
    { 
      _id: "capital4", 
      name: "GreenCapital Fund", 
      logoUrl: "https://dummyimage.com/50x50/27ae60/ffffff&text=GC", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "invest@greencapital.com"
    },
    { 
      _id: "capital5", 
      name: "GreenCapital Fund", 
      logoUrl: "https://dummyimage.com/50x50/27ae60/ffffff&text=GC", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "invest@greencapital.com"
    },
    { 
      _id: "capital6", 
      name: "GreenCapital Fund", 
      logoUrl: "https://dummyimage.com/50x50/27ae60/ffffff&text=GC", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "invest@greencapital.com"
    },
    { 
      _id: "capital7", 
      name: "GreenCapital Fund", 
      logoUrl: "https://dummyimage.com/50x50/27ae60/ffffff&text=GC", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "invest@greencapital.com"
    },
    { 
      _id: "capital8", 
      name: "GreenCapital Fund", 
      logoUrl: "https://dummyimage.com/50x50/27ae60/ffffff&text=GC", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "invest@greencapital.com"
    },
    { 
      _id: "capital9", 
      name: "GreenCapital Fund", 
      logoUrl: "https://dummyimage.com/50x50/27ae60/ffffff&text=GC", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "invest@greencapital.com"
    },
    { 
      _id: "capital10", 
      name: "GreenCapital Fund", 
      logoUrl: "https://dummyimage.com/50x50/27ae60/ffffff&text=GC", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "invest@greencapital.com"
    },
    { 
      _id: "capital11", 
      name: "EcoInvest Group", 
      logoUrl: "https://dummyimage.com/50x50/8e44ad/ffffff&text=EI", 
      verified: false,
      states: ["New York", "New Jersey", "Pennsylvania"]
    },
    { 
      _id: "capital12", 
      name: "RenewFinance Partners", 
      logoUrl: "https://dummyimage.com/50x50/c0392b/ffffff&text=RF", 
      verified: true,
      states: ["California", "Nevada", "Arizona", "New Mexico"],
      contactInfo: "info@renewfinance.com"
    },
    { 
      _id: "capital13", 
      name: "CleanEnergy Capital", 
      logoUrl: "https://dummyimage.com/50x50/f39c12/000000&text=CC", 
      verified: false,
      states: ["Texas", "Oklahoma", "Louisiana"]
    },
    { 
      _id: "capital14", 
      name: "Sustainable Funding", 
      logoUrl: "https://dummyimage.com/50x50/16a085/ffffff&text=SF", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "funding@sustainablefunding.org"
    },
    { 
      _id: "capital15", 
      name: "Pacific Investment Group", 
      logoUrl: "https://dummyimage.com/50x50/2980b9/ffffff&text=PI", 
      verified: false,
      states: ["California", "Oregon", "Washington", "Alaska", "Hawaii"]
    },
    { 
      _id: "capital16", 
      name: "Eastern Funding LLC", 
      logoUrl: "https://dummyimage.com/50x50/e67e22/ffffff&text=EF", 
      verified: true,
      states: ["All Northeast States"],
      contactInfo: "contact@easternfunding.com"
    },
    { 
      _id: "capital17", 
      name: "Midwest PACE Capital", 
      logoUrl: "https://dummyimage.com/50x50/95a5a6/ffffff&text=MP", 
      verified: false,
      states: ["Illinois", "Wisconsin", "Michigan", "Indiana", "Ohio"]
    },
    { 
      _id: "capital18", 
      name: "Southern Financing Co", 
      logoUrl: "https://dummyimage.com/50x50/34495e/ffffff&text=SF", 
      verified: true,
      states: ["Florida", "Georgia", "Alabama", "Mississippi", "South Carolina"],
      contactInfo: "invest@southernfinancing.com"
    }
  ],
  "Law Firms": [
    { 
      _id: "law1", 
      name: "GreenLaw Partners", 
      logoUrl: "https://dummyimage.com/50x50/7f8c8d/ffffff&text=GL", 
      verified: true,
      states: ["California", "Nevada", "Arizona"],
      contactInfo: "info@greenlawpartners.com"
    },
    { 
      _id: "law2", 
      name: "EcoLegal Group", 
      logoUrl: "https://dummyimage.com/50x50/3498db/ffffff&text=EL", 
      verified: false,
      states: ["New York", "New Jersey", "Connecticut"]
    },
    { 
      _id: "law3", 
      name: "PACE Law Associates", 
      logoUrl: "https://dummyimage.com/50x50/e74c3c/ffffff&text=PL", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "contact@pacelawassociates.com"
    }
  ],
  "Consultants": [
    { 
      _id: "consult1", 
      name: "GreenConsult Co", 
      logoUrl: "https://dummyimage.com/50x50/9b59b6/ffffff&text=GC", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "info@greenconsult.co"
    },
    { 
      _id: "consult2", 
      name: "EcoStrategy Group", 
      logoUrl: "https://dummyimage.com/50x50/f1c40f/000000&text=ES", 
      verified: false,
      states: ["California", "Oregon", "Washington"]
    },
    { 
      _id: "consult3", 
      name: "PACE Advisory Services", 
      logoUrl: "https://dummyimage.com/50x50/2ecc71/ffffff&text=PA", 
      verified: true,
      states: ["Texas", "Oklahoma", "New Mexico", "Arizona"],
      contactInfo: "hello@paceadvisory.com"
    },
    { 
      _id: "consult4", 
      name: "Sustainable Solutions", 
      logoUrl: "https://dummyimage.com/50x50/1abc9c/ffffff&text=SS", 
      verified: false,
      states: ["Florida", "Georgia", "Alabama"]
    },
    { 
      _id: "consult5", 
      name: "Energy Efficiency Experts", 
      logoUrl: "https://dummyimage.com/50x50/d35400/ffffff&text=EE", 
      verified: true,
      states: ["New York", "Massachusetts", "Connecticut"],
      contactInfo: "experts@energyefficiency.org"
    }
  ],
  "Software Providers": [
    { 
      _id: "software1", 
      name: "GreenTech Systems", 
      logoUrl: "https://dummyimage.com/50x50/27ae60/ffffff&text=GT", 
      verified: true,
      states: ["All 50 States"],
      contactInfo: "sales@greentechsystems.com"
    },
    { 
      _id: "software2", 
      name: "EcoPlatform", 
      logoUrl: "https://dummyimage.com/50x50/8e44ad/ffffff&text=EP", 
      verified: false,
      states: ["All 50 States"]
    }
  ],
  "Engineering Firms": [
    { 
      _id: "eng1", 
      name: "GreenEnergy Engineers", 
      logoUrl: "https://dummyimage.com/50x50/c0392b/ffffff&text=GE", 
      verified: true,
      states: ["California", "Nevada", "Oregon", "Washington"],
      contactInfo: "projects@greenenergy.com"
    },
    { 
      _id: "eng2", 
      name: "EcoBuilding Design", 
      logoUrl: "https://dummyimage.com/50x50/f39c12/000000&text=EB", 
      verified: false,
      states: ["New York", "New Jersey", "Connecticut"]
    },
    { 
      _id: "eng3", 
      name: "Sustainable Structures", 
      logoUrl: "https://dummyimage.com/50x50/16a085/ffffff&text=SS", 
      verified: true,
      states: ["Texas", "Oklahoma", "Louisiana"],
      contactInfo: "build@sustainablestructures.com"
    },
    { 
      _id: "eng4", 
      name: "Renewable Systems Inc", 
      logoUrl: "https://dummyimage.com/50x50/2980b9/ffffff&text=RS", 
      verified: false,
      states: ["Florida", "Georgia", "South Carolina"]
    }
  ],
  "Contractors": [
    { 
      _id: "contract1", 
      name: "GreenBuilders Co", 
      logoUrl: "https://dummyimage.com/50x50/e67e22/ffffff&text=GB", 
      verified: true,
      states: ["California", "Nevada", "Arizona"],
      contactInfo: "build@greenbuilders.co"
    },
    { 
      _id: "contract2", 
      name: "EcoConstruction Group", 
      logoUrl: "https://dummyimage.com/50x50/95a5a6/ffffff&text=EC", 
      verified: false,
      states: ["Oregon", "Washington", "Idaho"]
    },
    { 
      _id: "contract3", 
      name: "PACE Installers", 
      logoUrl: "https://dummyimage.com/50x50/34495e/ffffff&text=PI", 
      verified: true,
      states: ["New York", "New Jersey", "Pennsylvania"],
      contactInfo: "installs@paceinstallers.com"
    }
  ],
  "Property Owners": [
    { 
      _id: "owner1", 
      name: "GreenProperties LLC", 
      logoUrl: "https://dummyimage.com/50x50/7f8c8d/ffffff&text=GP", 
      verified: true,
      states: ["California", "Arizona", "Nevada"],
      contactInfo: "leasing@greenproperties.com"
    },
    { 
      _id: "owner2", 
      name: "EcoEstates Group", 
      logoUrl: "https://dummyimage.com/50x50/3498db/ffffff&text=EE", 
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
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryOrder, setCategoryOrder] = useState([]); // Added state for category order

  // Add this function to handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset expanded/selected states when searching
    setExpandedCompany(null);
    setSelectedCompany(null);
  };
  
  // State for table sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'verified', // Default sort by verification status (verified first)
    direction: 'descending'
  });
  
  // State for expanded company in grid view
  const [expandedCompany, setExpandedCompany] = useState(null);
  
  // State for selected company in table view (now stores ID rather than company object)
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        // Check for Webflow data first
        if (window.Webflow && window.Webflow.categoryData && window.Webflow.companiesData) {
          // Process data from Webflow CMS
          processWebflowData(window.Webflow.categoryData, window.Webflow.companiesData);
        } 
        // Fall back to regular companiesData if available
        else if (window.companiesData) {
          processData(window.companiesData);
        } 
        // Use sample data for development
        else {
          processData(SAMPLE_DATA);
        }
      } catch (err) {
        console.error("Error fetching company data:", err);
        setError("Failed to load company data. Please try again later.");
        setLoading(false);
      }
    };

    // Process Webflow CMS data
    const processWebflowData = (categoryData, companiesData) => {
      // Sort categories by display order
      const sortedCategories = [...categoryData].sort((a, b) => 
        (a.displayOrder || 999) - (b.displayOrder || 999)
      );
      
      // Store the ordered category names
      const orderedCategoryNames = sortedCategories.map(category => category.name);
      setCategoryOrder(orderedCategoryNames);
      
      // Group companies by category
      const groupedCompanies = {};
      
      // Initialize empty arrays for each category
      orderedCategoryNames.forEach(categoryName => {
        groupedCompanies[categoryName] = [];
      });
      
      // Populate the categories with companies
      companiesData.forEach(company => {
        if (company.category && groupedCompanies[company.category]) {
          groupedCompanies[company.category].push(company);
        }
      });
      
      setCompaniesData(groupedCompanies);
      setAllCategories(orderedCategoryNames);
      setActiveFilters(orderedCategoryNames);
      setLoading(false);
    };

    // Process regular data
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
        
        // Get categories
        const categories = [...new Set(data.map(item => item.category))];
        setCategoryOrder(categories);
        setAllCategories(categories);
        setActiveFilters(categories);
      } else {
        // If data is already grouped by category
        setCompaniesData(data);
        
        // Get categories
        const categories = Object.keys(data);
        setCategoryOrder(categories);
        setAllCategories(categories);
        setActiveFilters(categories);
      }
      
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
                    
                    {/* 
                      Place expandable details after every item, but only show for active item
                      This fixes the layout issue with rows having 1 item
                    */}
                    <div 
                      className={`company-details-wrapper ${expandedCompany === company._id ? 'expanded' : ''}`}
                    >
                      {expandedCompany === company._id && (
                        <div className="company-details">
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
                              src={company.logoUrl} 
                              alt={`${company.name} logo`}
                              className="company-details-logo" 
                            />
                            <div className="company-details-info">
                              <h3 className="company-details-name">
                                {company.name}
                                {company.verified && (
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
                              {company.states && company.states.length > 0 ? (
                                <div className="company-states-list">
                                  {company.states.map((state, i) => (
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
                              href={company.websiteUrl || "#"} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="company-website-button"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Visit Website
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        );
      })}
  </div>
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
