/**
 * Category Configuration File
 * 
 * This file defines the order in which categories appear in the C-PACE Market Matrix.
 * To change the order, simply rearrange the items in the array.
 * 
 * You can also add new categories or remove existing ones as needed.
 * Any categories not listed here will appear at the end in alphabetical order.
 */

// Layout configuration
const LAYOUT_CONFIG = {
  // Set to 1 for single column layout, 2 for two-column layout
  columnCount: 2
};

// Category order configuration
const CATEGORY_ORDER = [
  "C-PACE Administrators",
  "Law Firms",
  "Capital Providers",
  "Program Consultants",
  "Technical Service Providers",
  "Contractors",
  "Property Owners",
  "Mortgage Holders"
];

export { CATEGORY_ORDER, LAYOUT_CONFIG };
export default CATEGORY_ORDER; 