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
      throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.records ? data.records.length : 0} records from ${tableName}`);
    return data.records.map(record => transformAirtableRecord(record, tableName));
  } catch (error) {
    console.error(`Error fetching from Airtable (${tableName}):`, error);
    throw error;
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
    
    // Fetch data from all tables in parallel
    const promises = Object.values(TABLES).map(tableName => 
      fetchFromAirtable(tableName)
    );
    
    const results = await Promise.all(promises);
    
    // Create an object with categories as keys and arrays of companies as values
    const data = Object.keys(TABLES).reduce((acc, key, index) => {
      acc[TABLES[key]] = results[index];
      return acc;
    }, {});

    console.log('Successfully fetched all data from Airtable');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error fetching data from Airtable:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch data from Airtable',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
}; 