/**
 * Test script for EPS Document API
 * Run this to verify API connectivity and see real data structure
 */

import {
  testConnection,
  getDocumentsByLoan,
  getLoanDocumentStatus
} from './epsDocumentApi.js';

const TEST_LOAN_NUMBERS = [
  'TEST0000081920',
  'TEST0000013271'
];

/**
 * Test basic API connectivity
 */
export const runConnectionTest = async () => {
  console.log('=== EPS API Connection Test ===\n');

  for (const loanNumber of TEST_LOAN_NUMBERS) {
    console.log(`Testing loan: ${loanNumber}`);
    try {
      const response = await getDocumentsByLoan(loanNumber);
      console.log(`✅ Success! Found ${response?.documents?.length || 0} documents`);

      if (response?.documents?.length > 0) {
        console.log('\nSample Document Structure:');
        console.log(JSON.stringify(response.documents[0], null, 2));
      }

      console.log('\n---\n');
    } catch (error) {
      console.error(`❌ Failed for ${loanNumber}:`, error.message);
      console.log('\n---\n');
    }
  }
};

/**
 * Test document status calculation
 */
export const runStatusTest = async () => {
  console.log('=== Document Status Test ===\n');

  // Mock required documents for testing
  const requiredDocuments = [
    { documentType: '1003 Application', documentTypeCode: '1003', category: 'Application' },
    { documentType: 'Credit Report', documentTypeCode: 'CREDIT', category: 'Credit' },
    { documentType: 'Appraisal', documentTypeCode: 'APPRAISAL', category: 'Property' },
    { documentType: 'Title Insurance', documentTypeCode: 'TITLE', category: 'Title' },
    { documentType: 'W-2', documentTypeCode: 'W2', category: 'Income' },
  ];

  for (const loanNumber of TEST_LOAN_NUMBERS) {
    console.log(`\nChecking status for loan: ${loanNumber}`);
    try {
      const status = await getLoanDocumentStatus(loanNumber, requiredDocuments);

      console.log(`Total Required: ${status.totalRequired}`);
      console.log(`Found: ${status.foundCount}`);
      console.log(`Missing: ${status.missingCount}`);

      console.log('\nDocument Breakdown:');
      status.documentStatus.forEach(doc => {
        console.log(`  - ${doc.documentType}: ${doc.status} (${doc.foundCount} files)`);
      });

      console.log('\n---\n');
    } catch (error) {
      console.error(`❌ Failed for ${loanNumber}:`, error.message);
      console.log('\n---\n');
    }
  }
};

/**
 * Run all tests
 */
export const runAllTests = async () => {
  console.log('\n🚀 Starting EPS API Tests...\n');

  await runConnectionTest();
  await runStatusTest();

  console.log('✅ All tests complete!\n');
};

// If running directly in browser console or Node
if (typeof window !== 'undefined') {
  window.testEpsApi = {
    runConnectionTest,
    runStatusTest,
    runAllTests,
  };
  console.log('💡 EPS API Test functions available via: window.testEpsApi');
}
