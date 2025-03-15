// Netlify function to fetch company data from Airtable
const fetch = require('node-fetch');

// Single table name in your Airtable base
const MAIN_TABLE = "Companies";

// Field mappings from Airtable fields to app fields
const FIELD_MAPPINGS = {
  name: "Name",
  logoUrl: "LogoURL",
  verified: "Verified",
  states: "States",
  contactInfo: "ContactInfo",
  websiteUrl: "WebsiteURL",
  categories: "Industry category" // New field for multiselect categories
};

// Helper function to fetch data from Airtable
async function fetchFromAirtable() {
  // Try both environment variable naming conventions
  const baseId = process.env.AIRTABLE_BASE_ID || process.env.REACT_APP_AIRTABLE_BASE_ID;
  const token = process.env.AIRTABLE_PAT || process.env.REACT_APP_AIRTABLE_PAT;
  
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(MAIN_TABLE)}`;
  
  try {
    console.log(`Attempting to fetch from table: ${MAIN_TABLE}`);
    console.log(`Using Base ID: ${baseId}`);
    console.log(`Authorization token starts with: ${token ? token.substring(0, 10) + '...' : 'undefined'}`);
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error text available');
      console.error(`Failed to fetch from table "${MAIN_TABLE}": ${response.status} - ${errorText}`);
      return null;
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.records ? data.records.length : 0} records from ${MAIN_TABLE}`);
    
    // Transform records and organize by category
    return processRecords(data.records);
  } catch (error) {
    console.error(`Error fetching from Airtable (${MAIN_TABLE}):`, error);
    return null;
  }
}

// Process records and organize by category
function processRecords(records) {
  // Initialize an object to store companies by category
  const companiesByCategory = {};
  
  // Process each record
  records.forEach(record => {
    // Get the categories from the multiselect field
    const categories = record.fields[FIELD_MAPPINGS.categories] || [];
    
    // If no categories are assigned, add to "Uncategorized"
    if (categories.length === 0) {
      if (!companiesByCategory["Uncategorized"]) {
        companiesByCategory["Uncategorized"] = [];
      }
      companiesByCategory["Uncategorized"].push(transformAirtableRecord(record, "Uncategorized"));
    } else {
      // Add the company to each of its categories
      categories.forEach(category => {
        if (!companiesByCategory[category]) {
          companiesByCategory[category] = [];
        }
        companiesByCategory[category].push(transformAirtableRecord(record, category));
      });
    }
  });
  
  return companiesByCategory;
}

// Transform Airtable record to our app's data format
function transformAirtableRecord(record, category) {
  return {
    _id: record.id,
    name: record.fields[FIELD_MAPPINGS.name] || "Unknown",
    logoUrl: record.fields[FIELD_MAPPINGS.logoUrl] || "https://dummyimage.com/50x50/cccccc/ffffff&text=NA",
    verified: record.fields[FIELD_MAPPINGS.verified] || false,
    states: record.fields[FIELD_MAPPINGS.states] || [],
    contactInfo: record.fields[FIELD_MAPPINGS.contactInfo] || null,
    websiteUrl: record.fields[FIELD_MAPPINGS.websiteUrl] || null,
    category: category, // The specific category this instance belongs to
    allCategories: record.fields[FIELD_MAPPINGS.categories] || [] // All categories the company belongs to
  };
}

// Main handler function for the Netlify function
exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    console.log('Starting Airtable data fetch');
    console.log('Environment check:');
    console.log(`- AIRTABLE_BASE_ID exists: ${Boolean(process.env.AIRTABLE_BASE_ID)}`);
    console.log(`- REACT_APP_AIRTABLE_BASE_ID exists: ${Boolean(process.env.REACT_APP_AIRTABLE_BASE_ID)}`);
    console.log(`- AIRTABLE_PAT exists: ${Boolean(process.env.AIRTABLE_PAT)}`);
    console.log(`- REACT_APP_AIRTABLE_PAT exists: ${Boolean(process.env.REACT_APP_AIRTABLE_PAT)}`);
    
    // Check if environment variables are set
    const baseId = process.env.AIRTABLE_BASE_ID || process.env.REACT_APP_AIRTABLE_BASE_ID;
    const token = process.env.AIRTABLE_PAT || process.env.REACT_APP_AIRTABLE_PAT;
    
    if (!baseId) {
      throw new Error('Airtable Base ID is not configured. Please check your environment variables.');
    }
    
    if (!token) {
      throw new Error('Airtable Personal Access Token is not configured. Please check your environment variables.');
    }
    
    // Fetch data from Airtable
    const data = await fetchFromAirtable();
    
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Could not fetch data from Airtable. Please check your table name and permissions.');
    }

    console.log(`Successfully fetched data with ${Object.keys(data).length} categories`);
    
    // Return the data
    const response = {
      data: data
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Error fetching data from Airtable:', error);
    
    // Provide more specific error messages based on the error
    let errorMessage = 'Failed to fetch data from Airtable';
    let statusCode = 500;
    
    if (error.message.includes('403')) {
      errorMessage = 'Authentication error: Your Airtable Personal Access Token does not have permission to access this base or lacks the required scopes.';
      statusCode = 403;
    } else if (error.message.includes('404')) {
      errorMessage = 'Not found: The Airtable base or table could not be found. Please check your Base ID and table names.';
      statusCode = 404;
    } else if (error.message.includes('401')) {
      errorMessage = 'Unauthorized: Your Airtable Personal Access Token is invalid or expired.';
      statusCode = 401;
    } else if (error.message.includes('429')) {
      errorMessage = 'Rate limit exceeded: Too many requests to Airtable API. Please try again later.';
      statusCode = 429;
    }
    
    return {
      statusCode,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
}; 