/**
 * Puppeteer Helper Utilities for BoB Single Flow Tests
 *
 * This module provides reusable helper functions for common Puppeteer operations.
 * These helpers make tests more readable and maintainable.
 */

const puppeteer = require('puppeteer');

/**
 * Launch a new browser instance with configured options
 * @returns {Promise<Browser>} Puppeteer browser instance
 */
async function launchBrowser() {
  const browser = await puppeteer.launch(global.TEST_CONFIG.puppeteerOptions);
  console.log('✅ Browser launched successfully');
  return browser;
}

/**
 * Create a new page with common configuration
 * @param {Browser} browser - Puppeteer browser instance
 * @returns {Promise<Page>} Configured Puppeteer page
 */
async function createPage(browser) {
  const page = await browser.newPage();

  // Set viewport size
  await page.setViewport({ width: 1920, height: 1080 });

  // Enable request interception for debugging
  await page.setRequestInterception(false);

  // Log console messages from the browser
  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error') {
      console.log(`❌ Browser Console Error: ${msg.text()}`);
    } else if (type === 'warning') {
      console.log(`⚠️  Browser Console Warning: ${msg.text()}`);
    }
  });

  // Log page errors
  page.on('pageerror', (error) => {
    console.log(`❌ Page Error: ${error.message}`);
  });

  console.log('✅ Page created with viewport 1920x1080');
  return page;
}

/**
 * Navigate to a URL and wait for it to load
 * @param {Page} page - Puppeteer page instance
 * @param {string} url - URL to navigate to
 * @param {object} options - Navigation options
 */
async function navigateToUrl(page, url, options = {}) {
  const defaultOptions = {
    waitUntil: 'networkidle2', // Wait until network is idle
    timeout: 30000,
  };

  console.log(`🌐 Navigating to: ${url}`);
  await page.goto(url, { ...defaultOptions, ...options });
  console.log('✅ Navigation complete');
}

/**
 * Wait for an element to be visible on the page
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector for the element
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForElement(page, selector, timeout = 10000) {
  console.log(`⏳ Waiting for element: ${selector}`);
  await page.waitForSelector(selector, { visible: true, timeout });
  console.log(`✅ Element found: ${selector}`);
}

/**
 * Type text into an input field
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector for the input
 * @param {string} text - Text to type
 * @param {object} options - Typing options
 */
async function typeIntoInput(page, selector, text, options = {}) {
  await waitForElement(page, selector);
  await page.click(selector); // Focus the input
  await page.keyboard.down('Control');
  await page.keyboard.press('A');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace'); // Clear existing text
  await page.type(selector, text, { delay: options.delay || 50 });
  console.log(`⌨️  Typed "${text}" into ${selector}`);
}

/**
 * Click an element on the page
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector for the element
 */
async function clickElement(page, selector) {
  await waitForElement(page, selector);
  await page.click(selector);
  console.log(`🖱️  Clicked: ${selector}`);
}

/**
 * Select an option from a dropdown
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector for the select element
 * @param {string} value - Value to select
 */
async function selectDropdown(page, selector, value) {
  await waitForElement(page, selector);
  await page.select(selector, value);
  console.log(`📋 Selected "${value}" from ${selector}`);
}

/**
 * Get the text content of an element
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector for the element
 * @returns {Promise<string>} Text content of the element
 */
async function getElementText(page, selector) {
  await waitForElement(page, selector);
  const text = await page.$eval(selector, (el) => el.textContent);
  console.log(`📄 Got text from ${selector}: "${text}"`);
  return text.trim();
}

/**
 * Take a screenshot for debugging
 * @param {Page} page - Puppeteer page instance
 * @param {string} filename - Filename for the screenshot
 */
async function takeScreenshot(page, filename) {
  const path = `tests/screenshots/${filename}`;
  await page.screenshot({ path, fullPage: true });
  console.log(`📸 Screenshot saved: ${path}`);
}

/**
 * Wait for a specific amount of time
 * @param {number} ms - Milliseconds to wait
 */
async function wait(ms) {
  console.log(`⏳ Waiting ${ms}ms...`);
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if an element exists on the page
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector for the element
 * @returns {Promise<boolean>} True if element exists
 */
async function elementExists(page, selector) {
  const element = await page.$(selector);
  const exists = element !== null;
  console.log(`🔍 Element ${selector} ${exists ? 'exists' : 'does not exist'}`);
  return exists;
}

/**
 * Wait for navigation to complete
 * @param {Page} page - Puppeteer page instance
 * @param {Function} action - Action that triggers navigation
 */
async function waitForNavigation(page, action) {
  console.log('🔄 Waiting for navigation...');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    action(),
  ]);
  console.log('✅ Navigation complete');
}

/**
 * Get the value of an input field
 * @param {Page} page - Puppeteer page instance
 * @param {string} selector - CSS selector for the input
 * @returns {Promise<string>} Value of the input
 */
async function getInputValue(page, selector) {
  await waitForElement(page, selector);
  const value = await page.$eval(selector, (el) => el.value);
  console.log(`📄 Got value from ${selector}: "${value}"`);
  return value;
}

/**
 * Close browser gracefully
 * @param {Browser} browser - Puppeteer browser instance
 */
async function closeBrowser(browser) {
  if (browser) {
    await browser.close();
    console.log('✅ Browser closed');
  }
}

module.exports = {
  launchBrowser,
  createPage,
  navigateToUrl,
  waitForElement,
  typeIntoInput,
  clickElement,
  selectDropdown,
  getElementText,
  takeScreenshot,
  wait,
  elementExists,
  waitForNavigation,
  getInputValue,
  closeBrowser,
};
