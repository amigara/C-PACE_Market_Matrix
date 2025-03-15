// Netlify function to fetch company data from Airtable
const fetch = require('node-fetch');

// Table names in your Airtable base
const TABLES = {
  administrators: "C-PACE Administrators",
  capitalProviders: "Capital Providers",
  lawFirms: "Law Firms",
  consultants: "Consultants",
  softwareProviders: "Software Providers",
  engineeringFirms: "Engineering Firms",
  contractors: "Contractors",
  propertyOwners: "Property Owners"
};

// Field mappings from Airtable fields to app fields
const FIELD_MAPPINGS = {
  name: "Name",
  logoUrl: "LogoURL",
  verified: "Verified",
  states: "States",
  contactInfo: "ContactInfo",
  websiteUrl: "WebsiteURL"
};

// Helper function to fetch data from a specific Airtable table
async function fetchFromAirtable(tableName) {
  // Try both environment variable naming conventions
  const baseId = process.env.AIRTABLE_BASE_ID || process.env.REACT_APP_AIRTABLE_BASE_ID;
  const token = process.env.AIRTABLE_PAT || process.env.REACT_APP_AIRTABLE_PAT;
  
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
  
  try {
    console.log(`Attempting to fetch from table: ${tableName}`);
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
      console.error(`Failed to fetch from table "${tableName}": ${response.status} - ${errorText}`);
      
      // Return null for this table instead of throwing
      return null;
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.records ? data.records.length : 0} records from ${tableName}`);
    return data.records.map(record => transformAirtableRecord(record, tableName));
  } catch (error) {
    console.error(`Error fetching from Airtable (${tableName}):`, error);
    // Return null for this table instead of throwing
    return null;
  }
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
    category: category // Add the category to each record
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
    
    // Fetch data from all tables in parallel
    const tableNames = Object.values(TABLES);
    const results = await Promise.all(
      tableNames.map(tableName => fetchFromAirtable(tableName))
    );
    
    // Count successful and failed tables
    const successfulTables = results.filter(result => result !== null).length;
    const failedTables = results.filter(result => result === null).length;
    
    console.log(`Fetch summary: ${successfulTables} tables succeeded, ${failedTables} tables failed`);
    
    // Create an object with categories as keys and arrays of companies as values
    // Only include tables that returned data successfully
    const data = {};
    let hasAnyData = false;
    
    tableNames.forEach((tableName, index) => {
      if (results[index] !== null) {
        data[tableName] = results[index];
        hasAnyData = true;
      }
    });
    
    if (!hasAnyData) {
      throw new Error('Could not fetch data from any Airtable tables. Please check your table names and permissions.');
    }

    console.log(`Successfully fetched data from ${successfulTables} out of ${tableNames.length} tables`);
    
    // Add a warning message if some tables failed
    const response = {
      data: data
    };
    
    if (failedTables > 0) {
      response.warning = `${failedTables} out of ${tableNames.length} tables could not be accessed. This may be due to incorrect table names or insufficient permissions.`;
      response.availableTables = Object.keys(data);
    }

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