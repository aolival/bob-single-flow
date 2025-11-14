/**
 * Jest Setup File for BoB Single Flow E2E Tests
 *
 * This file runs before all tests and sets up the test environment.
 * It configures global timeouts and any shared test utilities.
 */

// Increase default timeout for all tests (Puppeteer operations can be slow)
jest.setTimeout(60000);

// Global test configuration
global.TEST_CONFIG = {
  // Base URL for the application (update this when running tests)
  baseUrl: process.env.TEST_URL || 'http://localhost:5173',

  // Puppeteer launch options
  puppeteerOptions: {
    headless: process.env.HEADLESS !== 'false', // Run headless by default, set HEADLESS=false to see browser
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0, // Slow down by N ms
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security', // Allow cross-origin requests for API testing
    ],
    devtools: process.env.DEVTOOLS === 'true', // Open DevTools
  },

  // Test data
  testLoanNumber: '12345678',
  testBundleType: 'Bank of America',

  // API configuration
  apiKey: 'dd87e724615b4d6988c58fe5b771876a',
  apiBaseUrl: 'https://qa.servicing-api.cmgtest.com/docs',
};

// Log test configuration on startup
console.log('\n🚀 Test Configuration:');
console.log(`   Base URL: ${global.TEST_CONFIG.baseUrl}`);
console.log(`   Headless: ${global.TEST_CONFIG.puppeteerOptions.headless}`);
console.log(`   Slow Motion: ${global.TEST_CONFIG.puppeteerOptions.slowMo}ms`);
console.log('');
