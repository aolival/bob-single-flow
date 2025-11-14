/**
 * API Configuration
 * Centralized configuration for all API endpoints and settings
 */

// Environment-based configuration
const ENV = {
  DEV: 'development',
  QA: 'qa',
  PROD: 'production',
};

// Current environment (can be set via env variable)
const CURRENT_ENV = process.env.REACT_APP_ENV || ENV.QA;

// API endpoints by environment
const API_ENDPOINTS = {
  [ENV.QA]: {
    baseUrl: 'https://qa.servicing-api.cmgtest.com/docs',
    apiKey: 'dd87e724615b4d6988c58fe5b771876a',
  },
  [ENV.DEV]: {
    baseUrl: 'https://dev.servicing-api.cmgtest.com/docs', // Update with actual dev URL
    apiKey: 'YOUR_DEV_API_KEY', // Update with actual dev key
  },
  [ENV.PROD]: {
    baseUrl: 'https://servicing-api.cmg.com/docs', // Update with actual prod URL
    apiKey: 'YOUR_PROD_API_KEY', // Update with actual prod key
  },
};

// Get current environment config
export const getApiConfig = () => {
  return API_ENDPOINTS[CURRENT_ENV] || API_ENDPOINTS[ENV.QA];
};

// Test loan numbers for each environment
export const TEST_LOAN_NUMBERS = {
  [ENV.QA]: [
    'TEST0000081920',
    'TEST0000013271',
  ],
  [ENV.DEV]: [
    'TEST0000081920',
    'TEST0000013271',
  ],
  [ENV.PROD]: [], // No test data in production
};

// Bundle configuration
export const BUNDLE_CONFIG = {
  // These would ideally come from your dbo.Bundle table API
  bundles: [
    { id: 1000006, name: 'C2C - QC Bundle', isQC: true },
    { id: 1000007, name: 'Docs Back - QC Bundle', isQC: true },
    { id: 1000008, name: 'Funded - QC Bundle', isQC: true },
    { id: 1000009, name: 'Wells Fargo', isQC: false },
    { id: 1000010, name: 'Bank of America', isQC: false },
    // Add more bundles as needed
  ],
};

// Document type mappings
// Maps BytePro document types to EPS document type GUIDs
export const DOCUMENT_TYPE_MAPPINGS = {
  '1003': {
    code: '1003',
    name: '1003 Application',
    category: 'Application',
    guid: null, // Will be populated from API response
  },
  'CREDIT': {
    code: 'CREDIT',
    name: 'Credit Report',
    category: 'Credit',
    guid: null,
  },
  'APPRAISAL': {
    code: 'APPRAISAL',
    name: 'Appraisal',
    category: 'Property',
    guid: null,
  },
  'TITLE': {
    code: 'TITLE',
    name: 'Title Insurance',
    category: 'Title',
    guid: null,
  },
  'W2': {
    code: 'W2',
    name: 'W-2',
    category: 'Income',
    guid: null,
  },
  'PAYSTUB': {
    code: 'PAYSTUB',
    name: 'Pay Stubs',
    category: 'Income',
    guid: null,
  },
  'TAX_RETURN': {
    code: 'TAX_RETURN',
    name: 'Tax Returns',
    category: 'Income',
    guid: null,
  },
  'BANK_STMT': {
    code: 'BANK_STMT',
    name: 'Bank Statements',
    category: 'Assets',
    guid: null,
  },
  'CLOSING_DISC': {
    code: 'CLOSING_DISC',
    name: 'Closing Disclosure',
    category: 'Closing',
    guid: null,
  },
  'PROMISSORY_NOTE': {
    code: 'PROMISSORY_NOTE',
    name: 'Promissory Note',
    category: 'Closing',
    guid: null,
  },
};

// API request timeout (milliseconds)
export const API_TIMEOUT = 30000; // 30 seconds

// API retry configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryOn: [408, 429, 500, 502, 503, 504], // HTTP status codes to retry
};

// Feature flags
export const FEATURE_FLAGS = {
  useRealApi: true, // Set to false to use mock data
  enableBulkOperations: true,
  enableDocumentUpload: false, // Enable when ready for upload functionality
  enableDocumentMerge: false, // Enable when ready for merge functionality
  showApiDebugInfo: true, // Show API response data in console
};

export default {
  getApiConfig,
  TEST_LOAN_NUMBERS,
  BUNDLE_CONFIG,
  DOCUMENT_TYPE_MAPPINGS,
  API_TIMEOUT,
  RETRY_CONFIG,
  FEATURE_FLAGS,
  CURRENT_ENV,
};
