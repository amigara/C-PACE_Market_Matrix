import React, { useState, useEffect } from "react";
import "./marketMatrix.css";

// Sample data for testing in CodeSandbox
const SAMPLE_DATA = {
  "C-PACE Administrators": [
    {
      _id: "1",
      name: "GreenAdmin Co",
      logoUrl: "https://dummyimage.com/50x50/00aa00/ffffff&text=GA",
    },
    {
      _id: "2",
      name: "EcoProperty Managers",
      logoUrl: "https://dummyimage.com/50x50/22cc22/ffffff&text=EP",
    },
    {
      _id: "3",
      name: "CleanEnergy Admin",
      logoUrl: "https://dummyimage.com/50x50/44ee44/ffffff&text=CE",
    },
    {
      _id: "4",
      name: "SustainableOps Inc",
      logoUrl: "https://dummyimage.com/50x50/66ff66/ffffff&text=SO",
    },
  ],
  "Capital Providers": [
    {
      _id: "5",
      name: "GreenCapital Fund",
      logoUrl: "https://dummyimage.com/50x50/0000aa/ffffff&text=GC",
    },
    {
      _id: "6",
      name: "EcoInvest Group",
      logoUrl: "https://dummyimage.com/50x50/2222cc/ffffff&text=EI",
    },
    {
      _id: "7",
      name: "RenewFinance Partners",
      logoUrl: "https://dummyimage.com/50x50/4444ee/ffffff&text=RF",
    },
    {
      _id: "8",
      name: "CleanEnergy Capital",
      logoUrl: "https://dummyimage.com/50x50/6666ff/ffffff&text=CC",
    },
  ],
  "Law Firms": [
    {
      _id: "9",
      name: "GreenLaw Partners",
      logoUrl: "https://dummyimage.com/50x50/aa00aa/ffffff&text=GL",
    },
    {
      _id: "10",
      name: "EcoLegal Group",
      logoUrl: "https://dummyimage.com/50x50/cc22cc/ffffff&text=EL",
    },
  ],
  Consultants: [
    {
      _id: "11",
      name: "GreenConsult Co",
      logoUrl: "https://dummyimage.com/50x50/aa0000/ffffff&text=GC",
    },
    {
      _id: "12",
      name: "EcoStrategy Group",
      logoUrl: "https://dummyimage.com/50x50/cc2222/ffffff&text=ES",
    },
  ],
};

const MarketMatrix = () => {
  const [companiesData, setCompaniesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        // In CodeSandbox, use the sample data
        // In production, this would check for window.companiesData first
        const data = SAMPLE_DATA;

        // Set all categories and initialize active filters
        const categories = Object.keys(data);
        setAllCategories(categories);
        setActiveFilters(categories);

        setCompaniesData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching company data:", err);
        setError("Failed to load company data. Please try again later.");
        setLoading(false);
      }
    };

    fetchCompaniesData();
  }, []);

  // Handle filter button clicks
  const toggleFilter = (category) => {
    if (activeFilters.includes(category)) {
      // Remove the category if it's already active
      setActiveFilters(activeFilters.filter((cat) => cat !== category));
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

  // Filter the data based on active filters
  const getFilteredData = () => {
    if (!companiesData) return {};

    return Object.entries(companiesData)
      .filter(([category]) => activeFilters.includes(category))
      .reduce((obj, [category, companies]) => {
        obj[category] = companies;
        return obj;
      }, {});
  };

  if (loading)
    return <div className="matrix-loading">Loading market matrix...</div>;
  if (error) return <div className="matrix-error">{error}</div>;

  const filteredData = getFilteredData();

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
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => toggleFilter(category)}
              className={`filter-category-button ${
                activeFilters.includes(category)
                  ? "filter-active"
                  : "filter-inactive"
              }`}
            >
              {category}
              {activeFilters.includes(category) ? " ✓" : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix Grid */}
      {Object.keys(filteredData).length === 0 ? (
        <div className="matrix-empty">
          <p>
            No categories selected. Please select at least one category above.
          </p>
        </div>
      ) : (
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
    </div>
  );
};

export default MarketMatrix;
