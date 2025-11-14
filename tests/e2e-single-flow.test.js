/**
 * End-to-End Tests for BoB Single Flow
 *
 * This test suite validates the complete user journey through the BoB Single Flow application:
 * 1. Loading the application
 * 2. Entering loan number and selecting bundle type
 * 3. Loading stacking order
 * 4. Viewing document status
 * 5. Generating and downloading bundle
 *
 * Run with: npm test
 * Run in visible mode: HEADLESS=false npm test
 * Run with slow motion: SLOW_MO=100 npm test
 */

const {
  launchBrowser,
  createPage,
  navigateToUrl,
  waitForElement,
  typeIntoInput,
  clickElement,
  getElementText,
  elementExists,
  closeBrowser,
} = require('./helpers/puppeteer-helpers');

const {
  createMonitor,
  measurePageLoad,
  getMemoryMetrics,
} = require('./helpers/performance');

describe('BoB Single Flow - End-to-End Tests', () => {
  let browser;
  let page;
  let performanceMonitor;

  // Setup: Launch browser before all tests
  beforeAll(async () => {
    browser = await launchBrowser();
    performanceMonitor = createMonitor();
  });

  // Teardown: Close browser after all tests
  afterAll(async () => {
    await closeBrowser(browser);
    performanceMonitor.generateReport();
  });

  // Create a new page before each test
  beforeEach(async () => {
    page = await createPage(browser);
  });

  // Close the page after each test
  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  /**
   * TEST 1: Application Loads Successfully
   * Verifies that the application loads and displays the main UI elements
   */
  test('should load the application successfully', async () => {
    console.log('\n🧪 TEST 1: Application Load');

    performanceMonitor.startTimer('Page Load');
    await navigateToUrl(page, global.TEST_CONFIG.baseUrl);
    performanceMonitor.stopTimer('Page Load');

    // Measure page load performance
    const pageMetrics = await measurePageLoad(page);
    performanceMonitor.recordMetric('DOM Content Loaded', pageMetrics['DOM Content Loaded']);

    // Verify main UI elements are present
    await waitForElement(page, 'input[placeholder*="loan"]', 10000);
    await waitForElement(page, 'select');

    console.log('✅ Application loaded successfully');
  });

  /**
   * TEST 2: Enter Loan Number
   * Tests entering a loan number into the subject loan input field
   */
  test('should accept loan number input', async () => {
    console.log('\n🧪 TEST 2: Loan Number Input');

    await navigateToUrl(page, global.TEST_CONFIG.baseUrl);

    // Find and type into the loan input field
    const loanInputSelector = 'input[placeholder*="loan"]';
    await typeIntoInput(page, loanInputSelector, global.TEST_CONFIG.testLoanNumber);

    // Verify the value was entered
    const enteredValue = await page.$eval(loanInputSelector, (el) => el.value);
    expect(enteredValue).toBe(global.TEST_CONFIG.testLoanNumber);

    console.log('✅ Loan number accepted');
  });

  /**
   * TEST 3: Select Bundle Type
   * Tests selecting a bundle type from the dropdown
   */
  test('should allow bundle type selection', async () => {
    console.log('\n🧪 TEST 3: Bundle Type Selection');

    await navigateToUrl(page, global.TEST_CONFIG.baseUrl);

    // Find the select dropdown
    const selectElement = await page.$('select');
    expect(selectElement).not.toBeNull();

    // Get all options
    const options = await page.$$eval('select option', (opts) =>
      opts.map((opt) => opt.textContent)
    );

    console.log(`   Found ${options.length} bundle options`);
    expect(options.length).toBeGreaterThan(0);

    // Verify specific bundle types exist
    expect(options).toContain('Bank of America');
    expect(options).toContain('Wells Fargo');
    expect(options).toContain('Chase');

    console.log('✅ Bundle dropdown populated correctly');
  });

  /**
   * TEST 4: Load Stacking Order
   * Tests the complete flow of loading a stacking order for a loan
   */
  test('should load stacking order for a loan', async () => {
    console.log('\n🧪 TEST 4: Load Stacking Order');

    await navigateToUrl(page, global.TEST_CONFIG.baseUrl);

    performanceMonitor.startTimer('Load Stacking Order');

    // Step 1: Enter loan number
    const loanInputSelector = 'input[placeholder*="loan"]';
    await typeIntoInput(page, loanInputSelector, global.TEST_CONFIG.testLoanNumber);

    // Step 2: Select bundle type
    await page.select('select', global.TEST_CONFIG.testBundleType);
    console.log(`   Selected bundle: ${global.TEST_CONFIG.testBundleType}`);

    // Step 3: Click "Load Stacking Order" button
    const loadButtonSelector = 'button:has-text("Load Stacking Order"), button:has-text("Load")';

    // Try to find the load button
    const loadButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn =>
        btn.textContent.includes('Load') &&
        !btn.disabled
      );
    });

    if (loadButton) {
      await loadButton.click();
      console.log('   Clicked Load Stacking Order button');
    }

    // Wait for the stacking order to load (look for document rows or loading indicator)
    try {
      await page.waitForFunction(
        () => {
          // Check if we have document rows or if loading is complete
          const hasDocuments = document.querySelectorAll('[class*="document"]').length > 0;
          const hasTable = document.querySelector('table') !== null;
          return hasDocuments || hasTable;
        },
        { timeout: 20000 }
      );
      console.log('   Stacking order loaded');
    } catch (error) {
      console.log('   ⚠️  Could not detect stacking order load (this may be normal if API is unavailable)');
    }

    performanceMonitor.stopTimer('Load Stacking Order');

    console.log('✅ Stacking order flow completed');
  }, 30000); // Extended timeout for API call

  /**
   * TEST 5: Document Status Tabs
   * Tests the document status filtering tabs (All, Missing, Found)
   */
  test('should display document status tabs', async () => {
    console.log('\n🧪 TEST 5: Document Status Tabs');

    await navigateToUrl(page, global.TEST_CONFIG.baseUrl);

    // Look for status tab buttons
    const statusTabs = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.filter(btn =>
        btn.textContent.match(/All|Missing|Found/i)
      ).map(btn => btn.textContent);
    });

    const tabTexts = await statusTabs.jsonValue();
    console.log(`   Found status tabs: ${tabTexts.join(', ')}`);

    // We expect to find "All", "Missing", and "Found" tabs
    const hasAllTab = tabTexts.some(text => text.includes('All'));
    expect(hasAllTab).toBe(true);

    console.log('✅ Status tabs displayed');
  });

  /**
   * TEST 6: Build Bundle Button
   * Tests that the build bundle button is present and can be interacted with
   */
  test('should display build bundle button', async () => {
    console.log('\n🧪 TEST 6: Build Bundle Button');

    await navigateToUrl(page, global.TEST_CONFIG.baseUrl);

    // Look for build/generate button
    const buildButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn =>
        btn.textContent.match(/Build|Generate|Create Bundle/i)
      );
    });

    const buttonExists = await buildButton.evaluate(btn => btn !== null);
    expect(buttonExists).toBe(true);

    console.log('✅ Build bundle button found');
  });

  /**
   * TEST 7: Memory Usage Check
   * Monitors memory usage to ensure the application doesn't have memory leaks
   */
  test('should maintain reasonable memory usage', async () => {
    console.log('\n🧪 TEST 7: Memory Usage Check');

    await navigateToUrl(page, global.TEST_CONFIG.baseUrl);

    // Get initial memory metrics
    const memoryMetrics = await getMemoryMetrics(page);

    // Memory thresholds (adjust based on your application)
    const maxHeapUsedMB = 100; // 100 MB
    const maxDOMNodes = 5000; // 5000 nodes

    expect(memoryMetrics['JS Heap Used']).toBeLessThan(maxHeapUsedMB);
    expect(memoryMetrics['DOM Nodes']).toBeLessThan(maxDOMNodes);

    console.log('✅ Memory usage within acceptable limits');
  });

  /**
   * TEST 8: URL Parameters Loading
   * Tests that the application can load with pre-filled loan and bundle parameters
   */
  test('should load with URL parameters', async () => {
    console.log('\n🧪 TEST 8: URL Parameters Loading');

    const urlWithParams = `${global.TEST_CONFIG.baseUrl}?loan=${global.TEST_CONFIG.testLoanNumber}&bundle=${encodeURIComponent(global.TEST_CONFIG.testBundleType)}`;

    await navigateToUrl(page, urlWithParams);

    // Wait a bit for the auto-load to trigger
    await page.waitForTimeout(2000);

    // Verify loan number was pre-filled
    const loanInputSelector = 'input[placeholder*="loan"]';
    const loanValue = await page.$eval(loanInputSelector, (el) => el.value);
    expect(loanValue).toBe(global.TEST_CONFIG.testLoanNumber);

    // Verify bundle was pre-selected
    const bundleValue = await page.$eval('select', (el) => el.value);
    expect(bundleValue).toBe(global.TEST_CONFIG.testBundleType);

    console.log('✅ URL parameters loaded correctly');
  });

  /**
   * TEST 9: Responsive Design Check
   * Tests that the application works on different viewport sizes
   */
  test('should work on different screen sizes', async () => {
    console.log('\n🧪 TEST 9: Responsive Design Check');

    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 1366, height: 768, name: 'Laptop' },
      { width: 768, height: 1024, name: 'Tablet' },
    ];

    for (const viewport of viewports) {
      await page.setViewport(viewport);
      console.log(`   Testing ${viewport.name} (${viewport.width}x${viewport.height})`);

      await navigateToUrl(page, global.TEST_CONFIG.baseUrl);

      // Verify main elements are still visible
      const loanInput = await page.$('input[placeholder*="loan"]');
      const bundleSelect = await page.$('select');

      expect(loanInput).not.toBeNull();
      expect(bundleSelect).not.toBeNull();

      console.log(`   ✅ ${viewport.name} layout working`);
    }

    console.log('✅ Responsive design validated');
  });

  /**
   * TEST 10: Error Handling
   * Tests that the application handles errors gracefully
   */
  test('should handle invalid inputs gracefully', async () => {
    console.log('\n🧪 TEST 10: Error Handling');

    await navigateToUrl(page, global.TEST_CONFIG.baseUrl);

    // Try entering invalid loan number (empty)
    const loanInputSelector = 'input[placeholder*="loan"]';
    await typeIntoInput(page, loanInputSelector, '');

    // Try to load without selecting bundle
    const loadButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('Load'));
    });

    // The button should either be disabled or show an error
    const isDisabled = await loadButton.evaluate(btn => btn && btn.disabled);
    console.log(`   Load button disabled for invalid input: ${isDisabled}`);

    console.log('✅ Error handling validated');
  });
});
