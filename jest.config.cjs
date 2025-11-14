/**
 * Jest Configuration for BoB Single Flow E2E Tests
 *
 * This configuration sets up Jest to work with Puppeteer for end-to-end testing.
 * Uses CommonJS format because Jest requires it for configuration files.
 */

module.exports = {
  // Test environment setup
  testEnvironment: 'node',

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],

  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test timeout (Puppeteer tests can take longer)
  testTimeout: 60000,

  // Coverage configuration
  collectCoverageFrom: [
    'tests/**/*.js',
    '!tests/setup.js',
    '!tests/helpers/**'
  ],

  // Verbose output
  verbose: true,

  // Transform configuration (none needed for Puppeteer tests)
  transform: {},
};
