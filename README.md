# C-PACE Market Matrix

A React application that displays a directory of companies in the C-PACE (Commercial Property Assessed Clean Energy) market, organized by category.

## Airtable Integration

This application can be connected to an Airtable base to dynamically load company data. Follow these steps to set up the integration:

### 1. Create an Airtable Base

1. Sign up for an Airtable account at [airtable.com](https://airtable.com) if you don't have one already.
2. Create a new base with the following tables:
   - C-PACE Administrators
   - Capital Providers
   - Law Firms
   - Consultants
   - Software Providers
   - Engineering Firms
   - Contractors
   - Property Owners

3. For each table, add the following fields:
   - Name (Single line text)
   - LogoURL (URL)
   - Verified (Checkbox)
   - States (Multiple select)
   - ContactInfo (Single line text)
   - WebsiteURL (URL)

### 2. Create a Personal Access Token (PAT)

Airtable has deprecated API keys in favor of Personal Access Tokens for better security.

1. Go to your [Airtable account page](https://airtable.com/account)
2. Navigate to the "Developer Hub" section
3. Click on "Personal access tokens"
4. Click "Create new token"
5. Give your token a name (e.g., "C-PACE Market Matrix")
6. Set the appropriate scopes:
   - `data.records:read` for all bases you want to access
   - `schema.bases:read` for all bases you want to access
7. Set an expiration date (or choose "No expiration" for development)
8. Click "Create token"
9. Copy your token immediately (you won't be able to see it again)

### 3. Get Your Airtable Base ID

1. Go to the [Airtable API documentation](https://airtable.com/api)
2. Select your base
3. In the introduction section, you'll find your Base ID (it looks like `appXXXXXXXXXXXXXX`)

### 4. Configure the Application

There are two ways to configure the Airtable integration:

#### Option 1: Environment Variables (Recommended for Production)

Create a `.env` file in the root of the project with the following variables:

```
REACT_APP_AIRTABLE_PAT=your_personal_access_token_here
REACT_APP_AIRTABLE_BASE_ID=your_base_id_here
```

#### Option 2: Direct Configuration (For Development)

Edit the `src/config.js` file and replace the placeholder values:

```javascript
const config = {
  airtable: {
    personalAccessToken: process.env.REACT_APP_AIRTABLE_PAT || "YOUR_AIRTABLE_PERSONAL_ACCESS_TOKEN", // Replace with your PAT
    baseId: process.env.REACT_APP_AIRTABLE_BASE_ID || "YOUR_AIRTABLE_BASE_ID", // Replace with your Base ID
    // ...
  }
};
```

### 5. Field Mapping

If your Airtable field names differ from the default ones, you can update the field mappings in the `src/config.js` file:

```javascript
fields: {
  name: "YourNameField",
  logoUrl: "YourLogoField",
  verified: "YourVerifiedField",
  states: "YourStatesField",
  contactInfo: "YourContactField",
  websiteUrl: "YourWebsiteField"
}
```

## Deploying to Netlify

This application is configured to work with Netlify, using Netlify Functions to securely connect to Airtable.

### 1. Set Up Your Netlify Account

1. Sign up for a Netlify account at [netlify.com](https://netlify.com) if you don't have one already
2. Install the Netlify CLI: `npm install -g netlify-cli`
3. Login to Netlify: `netlify login`

### 2. Deploy to Netlify

#### Option 1: Deploy via GitHub

1. Push your code to a GitHub repository
2. Log in to your Netlify dashboard
3. Click "New site from Git"
4. Select GitHub and authorize Netlify
5. Select your repository
6. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
7. Click "Deploy site"

#### Option 2: Deploy via Netlify CLI

1. Run `netlify init` in your project directory
2. Follow the prompts to set up your site
3. Deploy with `netlify deploy --prod`

### 3. Set Environment Variables in Netlify

After deploying, you need to set up environment variables:

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** > **Build & deploy** > **Environment**
4. Add the following environment variables:
   - `AIRTABLE_PAT` (your Airtable Personal Access Token)
   - `AIRTABLE_BASE_ID` (your Airtable Base ID)

These variables are used by the Netlify Function to securely connect to Airtable.

### 4. Redeploy Your Site

After setting the environment variables:

1. Go to **Deploys** in your Netlify dashboard
2. Click "Trigger deploy" > "Deploy site"

This will rebuild your site with the new environment variables.

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root of your project based on the `.env.example` file:

```
# For React app during build
REACT_APP_AIRTABLE_PAT=your_personal_access_token_here
REACT_APP_AIRTABLE_BASE_ID=your_base_id_here

# For Netlify Functions
AIRTABLE_PAT=your_personal_access_token_here
AIRTABLE_BASE_ID=your_base_id_here
```

### 3. Run the Development Server

```bash
netlify dev
```

This will start both the React app and the Netlify Functions locally.

## Features

- Grid view and table view for company listings
- Filtering by company category
- Sorting in table view
- Expandable company details
- Verification badges for verified companies
- Responsive design for all screen sizes
- Secure Airtable integration via Netlify Functions

## Fallback Data

If the Airtable connection fails or is not configured, the application will fall back to sample data for demonstration purposes.
