/**
 * Standalone Performance Monitoring Script for BoB Single Flow
 *
 * This script measures and reports detailed performance metrics for the application.
 * It can be run independently to benchmark the application's performance.
 *
 * Usage:
 *   node tests/performance-monitor.js
 *   node tests/performance-monitor.js --url=http://localhost:5173
 *   node tests/performance-monitor.js --iterations=5
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  url: process.env.TEST_URL || 'http://localhost:5173',
  iterations: parseInt(process.env.ITERATIONS) || 3,
  headless: process.env.HEADLESS !== 'false',
  outputFile: 'tests/performance-report.json',
};

// Parse command line arguments
process.argv.forEach((arg) => {
  if (arg.startsWith('--url=')) {
    config.url = arg.split('=')[1];
  }
  if (arg.startsWith('--iterations=')) {
    config.iterations = parseInt(arg.split('=')[1]);
  }
});

/**
 * Main performance monitoring function
 */
async function monitorPerformance() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 BoB Single Flow - Performance Monitoring Script');
  console.log('='.repeat(70));
  console.log(`   URL: ${config.url}`);
  console.log(`   Iterations: ${config.iterations}`);
  console.log(`   Headless: ${config.headless}`);
  console.log('='.repeat(70) + '\n');

  const browser = await puppeteer.launch({
    headless: config.headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const results = {
    timestamp: new Date().toISOString(),
    url: config.url,
    iterations: config.iterations,
    runs: [],
    averages: {},
  };

  try {
    for (let i = 0; i < config.iterations; i++) {
      console.log(`\n📊 Running iteration ${i + 1}/${config.iterations}...`);

      const run = await performSingleRun(browser, i + 1);
      results.runs.push(run);

      console.log('✅ Iteration complete\n');
    }

    // Calculate averages
    results.averages = calculateAverages(results.runs);

    // Display results
    displayResults(results);

    // Save to file
    saveResults(results);

  } catch (error) {
    console.error('❌ Performance monitoring failed:', error);
  } finally {
    await browser.close();
  }
}

/**
 * Perform a single performance measurement run
 */
async function performSingleRun(browser, runNumber) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const run = {
    runNumber,
    timestamp: new Date().toISOString(),
    metrics: {},
  };

  try {
    // Measure 1: Initial Page Load
    console.log('   ⏱️  Measuring initial page load...');
    const startLoad = Date.now();
    await page.goto(config.url, { waitUntil: 'networkidle2' });
    run.metrics.pageLoadTime = Date.now() - startLoad;
    console.log(`   ✓ Page load: ${run.metrics.pageLoadTime}ms`);

    // Measure 2: Navigation Timing API Metrics
    const performanceTiming = await page.evaluate(() => {
      const timing = window.performance.timing;
      return {
        dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
        tcpConnection: timing.connectEnd - timing.connectStart,
        requestTime: timing.responseStart - timing.requestStart,
        responseTime: timing.responseEnd - timing.responseStart,
        domProcessing: timing.domComplete - timing.domLoading,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        fullPageLoad: timing.loadEventEnd - timing.navigationStart,
      };
    });

    Object.assign(run.metrics, performanceTiming);

    // Measure 3: First Paint Metrics
    const paintMetrics = await page.evaluate(() => {
      const paints = performance.getEntriesByType('paint');
      const metrics = {};
      paints.forEach((paint) => {
        metrics[paint.name] = Math.round(paint.startTime);
      });
      return metrics;
    });

    run.metrics.firstPaint = paintMetrics['first-paint'] || 0;
    run.metrics.firstContentfulPaint = paintMetrics['first-contentful-paint'] || 0;

    console.log(`   ✓ First paint: ${run.metrics.firstPaint}ms`);
    console.log(`   ✓ First contentful paint: ${run.metrics.firstContentfulPaint}ms`);

    // Measure 4: Memory Usage
    const memoryMetrics = await page.metrics();
    run.metrics.jsHeapUsedMB = Math.round(memoryMetrics.JSHeapUsedSize / 1024 / 1024);
    run.metrics.jsHeapTotalMB = Math.round(memoryMetrics.JSHeapTotalSize / 1024 / 1024);
    run.metrics.domNodes = memoryMetrics.Nodes;
    run.metrics.eventListeners = memoryMetrics.JSEventListeners;

    console.log(`   ✓ JS Heap Used: ${run.metrics.jsHeapUsedMB} MB`);
    console.log(`   ✓ DOM Nodes: ${run.metrics.domNodes}`);

    // Measure 5: Interaction Responsiveness (Input field)
    console.log('   ⏱️  Measuring interaction responsiveness...');

    const inputSelector = 'input[placeholder*="loan"]';
    await page.waitForSelector(inputSelector);

    const startInteraction = Date.now();
    await page.type(inputSelector, '12345678');
    run.metrics.inputResponseTime = Date.now() - startInteraction;

    console.log(`   ✓ Input response: ${run.metrics.inputResponseTime}ms`);

    // Measure 6: Dropdown Interaction
    const selectStart = Date.now();
    await page.select('select', 'Bank of America');
    run.metrics.dropdownResponseTime = Date.now() - selectStart;

    console.log(`   ✓ Dropdown response: ${run.metrics.dropdownResponseTime}ms`);

    // Measure 7: Resource Count
    const resourceMetrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return {
        totalResources: resources.length,
        scripts: resources.filter(r => r.initiatorType === 'script').length,
        stylesheets: resources.filter(r => r.initiatorType === 'link').length,
        images: resources.filter(r => r.initiatorType === 'img').length,
        xhr: resources.filter(r => r.initiatorType === 'xmlhttprequest' || r.initiatorType === 'fetch').length,
      };
    });

    Object.assign(run.metrics, resourceMetrics);

    console.log(`   ✓ Total resources loaded: ${run.metrics.totalResources}`);

  } catch (error) {
    console.error(`   ❌ Error in run ${runNumber}:`, error.message);
    run.error = error.message;
  } finally {
    await page.close();
  }

  return run;
}

/**
 * Calculate average metrics across all runs
 */
function calculateAverages(runs) {
  const averages = {};
  const metricKeys = Object.keys(runs[0].metrics);

  metricKeys.forEach((key) => {
    const values = runs.map(run => run.metrics[key]).filter(v => typeof v === 'number');

    if (values.length > 0) {
      const sum = values.reduce((a, b) => a + b, 0);
      averages[key] = Math.round(sum / values.length);
    }
  });

  return averages;
}

/**
 * Display results in a formatted table
 */
function displayResults(results) {
  console.log('\n' + '='.repeat(70));
  console.log('📊 PERFORMANCE REPORT - AVERAGE METRICS');
  console.log('='.repeat(70));

  const metrics = results.averages;

  console.log('\n🌐 Page Load Metrics:');
  console.log(`   Page Load Time:              ${metrics.pageLoadTime}ms`);
  console.log(`   Full Page Load:              ${metrics.fullPageLoad}ms`);
  console.log(`   DOM Content Loaded:          ${metrics.domContentLoaded}ms`);
  console.log(`   First Paint:                 ${metrics.firstPaint}ms`);
  console.log(`   First Contentful Paint:      ${metrics.firstContentfulPaint}ms`);

  console.log('\n⚡ Network Metrics:');
  console.log(`   DNS Lookup:                  ${metrics.dnsLookup}ms`);
  console.log(`   TCP Connection:              ${metrics.tcpConnection}ms`);
  console.log(`   Request Time:                ${metrics.requestTime}ms`);
  console.log(`   Response Time:               ${metrics.responseTime}ms`);
  console.log(`   DOM Processing:              ${metrics.domProcessing}ms`);

  console.log('\n🖱️  Interaction Metrics:');
  console.log(`   Input Response Time:         ${metrics.inputResponseTime}ms`);
  console.log(`   Dropdown Response Time:      ${metrics.dropdownResponseTime}ms`);

  console.log('\n💾 Memory Metrics:');
  console.log(`   JS Heap Used:                ${metrics.jsHeapUsedMB} MB`);
  console.log(`   JS Heap Total:               ${metrics.jsHeapTotalMB} MB`);
  console.log(`   DOM Nodes:                   ${metrics.domNodes}`);
  console.log(`   Event Listeners:             ${metrics.eventListeners}`);

  console.log('\n📦 Resource Metrics:');
  console.log(`   Total Resources:             ${metrics.totalResources}`);
  console.log(`   Scripts:                     ${metrics.scripts}`);
  console.log(`   Stylesheets:                 ${metrics.stylesheets}`);
  console.log(`   Images:                      ${metrics.images}`);
  console.log(`   XHR/Fetch:                   ${metrics.xhr}`);

  console.log('\n' + '='.repeat(70));

  // Performance assessment
  console.log('\n🎯 Performance Assessment:');
  assessPerformance(metrics);

  console.log('='.repeat(70) + '\n');
}

/**
 * Assess performance and provide recommendations
 */
function assessPerformance(metrics) {
  const assessments = [];

  // Page Load Assessment
  if (metrics.pageLoadTime < 1000) {
    assessments.push('✅ Excellent page load time');
  } else if (metrics.pageLoadTime < 2000) {
    assessments.push('✅ Good page load time');
  } else if (metrics.pageLoadTime < 3000) {
    assessments.push('⚠️  Page load time could be improved');
  } else {
    assessments.push('❌ Page load time needs optimization');
  }

  // First Contentful Paint Assessment
  if (metrics.firstContentfulPaint < 1000) {
    assessments.push('✅ Excellent first contentful paint');
  } else if (metrics.firstContentfulPaint < 2000) {
    assessments.push('✅ Good first contentful paint');
  } else {
    assessments.push('⚠️  First contentful paint could be faster');
  }

  // Interaction Responsiveness
  if (metrics.inputResponseTime < 50) {
    assessments.push('✅ Excellent interaction responsiveness');
  } else if (metrics.inputResponseTime < 100) {
    assessments.push('✅ Good interaction responsiveness');
  } else {
    assessments.push('⚠️  Interaction responsiveness could be improved');
  }

  // Memory Usage
  if (metrics.jsHeapUsedMB < 50) {
    assessments.push('✅ Excellent memory usage');
  } else if (metrics.jsHeapUsedMB < 100) {
    assessments.push('✅ Good memory usage');
  } else {
    assessments.push('⚠️  High memory usage detected');
  }

  // Resource Count
  if (metrics.totalResources < 50) {
    assessments.push('✅ Low resource count');
  } else if (metrics.totalResources < 100) {
    assessments.push('✅ Moderate resource count');
  } else {
    assessments.push('⚠️  High resource count - consider bundling/optimization');
  }

  assessments.forEach(assessment => console.log(`   ${assessment}`));
}

/**
 * Save results to JSON file
 */
function saveResults(results) {
  const outputPath = path.resolve(config.outputFile);

  try {
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Results saved to: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Failed to save results: ${error.message}`);
  }
}

// Run the performance monitoring
monitorPerformance().catch(console.error);
