import React, { useEffect, useRef } from "react";

// Company Modal Component
const CompanyModal = ({ company, onClose }) => {
  const modalRef = useRef();
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    
    // Prevent body scrolling while modal is open
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);
  
  // Handle Escape key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleEscKey);
    
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  if (!company) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" ref={modalRef}>
        <button className="modal-close-button" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <div className="modal-logo-container">
            <img 
              src={company.logoUrl} 
              alt={`${company.name} logo`}
              className="modal-logo" 
            />
            {company.verified && (
              <div className="modal-verified-badge">
                <span className="verified-badge-icon">✓</span> VERIFIED
              </div>
            )}
          </div>
          <h2 className="modal-title">{company.name}</h2>
        </div>
        
        <div className="modal-content">
          <div className="modal-info-section">
            <h3 className="modal-section-title">Category</h3>
            <p>{company.category}</p>
          </div>
          
          <div className="modal-info-section">
            <h3 className="modal-section-title">States of Operation</h3>
            <div className="modal-states-list">
              {company.states ? (
                company.states.map((state, index) => (
                  <span key={index} className="modal-state-tag">{state}</span>
                ))
              ) : (
                <p className="modal-info-empty">No state information available</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <a 
            href={company.websiteUrl || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="modal-website-button"
          >
            Visit Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;
