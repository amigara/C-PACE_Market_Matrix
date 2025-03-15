/**
 * Category Configuration File
 * 
 * This file defines the order and layout of categories in the C-PACE Market Matrix.
 * 
 * For each category, you can specify:
 * - name: The category name (required)
 * - fullWidth: Whether this category should take up the full width (true) or share space (false)
 * 
 * Categories with fullWidth: true will span the entire row, while others will be arranged in pairs.
 * Any categories not listed here will appear at the end in alphabetical order with default width.
 */

// Layout configuration
const LAYOUT_CONFIG = {
  // Default column count for the overall layout (used as fallback)
  defaultColumnCount: 2
};

// Category configuration with order and width settings
const CATEGORIES_CONFIG = [
  { name: "C-PACE Administrators", fullWidth: false },
  { name: "Law Firms", fullWidth: false },
  { name: "Capital Providers", fullWidth: true },
  { name: "Program Consultants", fullWidth: false },
  { name: "Technical Service Providers", fullWidth: false },
  { name: "Contractors", fullWidth: false },
  { name: "Property Owners", fullWidth: false },
  { name: "Mortgage Holders", fullWidth: false }
];

// Extract just the category names for backward compatibility
const CATEGORY_ORDER = CATEGORIES_CONFIG.map(category => category.name);

export { CATEGORIES_CONFIG, CATEGORY_ORDER, LAYOUT_CONFIG };
export default CATEGORY_ORDER; 