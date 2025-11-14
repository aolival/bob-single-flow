/**
 * Performance Monitoring Utilities for BoB Single Flow
 *
 * This module provides tools to measure and track performance metrics
 * during end-to-end testing, including page load times, API response times,
 * and custom timing markers.
 */

/**
 * Performance metrics storage
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.startTimes = {};
  }

  /**
   * Start timing an operation
   * @param {string} label - Label for the operation
   */
  startTimer(label) {
    this.startTimes[label] = Date.now();
    console.log(`⏱️  Started timer: ${label}`);
  }

  /**
   * Stop timing an operation and record the duration
   * @param {string} label - Label for the operation
   * @returns {number} Duration in milliseconds
   */
  stopTimer(label) {
    if (!this.startTimes[label]) {
      console.log(`⚠️  Warning: Timer "${label}" was not started`);
      return 0;
    }

    const duration = Date.now() - this.startTimes[label];
    this.metrics[label] = duration;
    delete this.startTimes[label];

    console.log(`⏱️  Stopped timer: ${label} - Duration: ${duration}ms`);
    return duration;
  }

  /**
   * Record a metric value
   * @param {string} label - Label for the metric
   * @param {number} value - Metric value
   */
  recordMetric(label, value) {
    this.metrics[label] = value;
    console.log(`📊 Recorded metric: ${label} = ${value}`);
  }

  /**
   * Get all recorded metrics
   * @returns {object} All metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Get a specific metric
   * @param {string} label - Label for the metric
   * @returns {number|undefined} Metric value
   */
  getMetric(label) {
    return this.metrics[label];
  }

  /**
   * Generate a performance report
   * @returns {string} Formatted performance report
   */
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 PERFORMANCE REPORT');
    console.log('='.repeat(60));

    const sortedMetrics = Object.entries(this.metrics).sort((a, b) => b[1] - a[1]);

    sortedMetrics.forEach(([label, value]) => {
      const formattedValue = typeof value === 'number' ? `${value}ms` : value;
      console.log(`   ${label.padEnd(40)} ${formattedValue.toString().padStart(10)}`);
    });

    console.log('='.repeat(60) + '\n');

    return this.metrics;
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = {};
    this.startTimes = {};
    console.log('🧹 Cleared all metrics');
  }
}

/**
 * Measure page load performance metrics
 * @param {Page} page - Puppeteer page instance
 * @returns {Promise<object>} Performance timing metrics
 */
async function measurePageLoad(page) {
  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );

  const metrics = {
    'DNS Lookup': performanceTiming.domainLookupEnd - performanceTiming.domainLookupStart,
    'TCP Connection': performanceTiming.connectEnd - performanceTiming.connectStart,
    'Request Time': performanceTiming.responseStart - performanceTiming.requestStart,
    'Response Time': performanceTiming.responseEnd - performanceTiming.responseStart,
    'DOM Processing': performanceTiming.domComplete - performanceTiming.domLoading,
    'DOM Content Loaded': performanceTiming.domContentLoadedEventEnd - performanceTiming.navigationStart,
    'Page Load Time': performanceTiming.loadEventEnd - performanceTiming.navigationStart,
  };

  console.log('\n📊 Page Load Metrics:');
  Object.entries(metrics).forEach(([key, value]) => {
    console.log(`   ${key.padEnd(30)} ${value}ms`);
  });

  return metrics;
}

/**
 * Measure API response time
 * @param {Page} page - Puppeteer page instance
 * @param {Function} action - Action that triggers API call
 * @param {string} apiPattern - Pattern to match API URL
 * @returns {Promise<number>} Response time in milliseconds
 */
async function measureApiResponse(page, action, apiPattern) {
  let responseTime = 0;

  // Set up request interception
  await page.setRequestInterception(true);

  const requestHandler = (request) => {
    if (request.url().includes(apiPattern)) {
      request.startTime = Date.now();
    }
    request.continue();
  };

  const responseHandler = (response) => {
    const request = response.request();
    if (request.url().includes(apiPattern) && request.startTime) {
      responseTime = Date.now() - request.startTime;
      console.log(`🌐 API Response Time (${apiPattern}): ${responseTime}ms`);
    }
  };

  page.on('request', requestHandler);
  page.on('response', responseHandler);

  // Execute the action that triggers the API call
  await action();

  // Clean up
  page.off('request', requestHandler);
  page.off('response', responseHandler);
  await page.setRequestInterception(false);

  return responseTime;
}

/**
 * Get memory usage metrics
 * @param {Page} page - Puppeteer page instance
 * @returns {Promise<object>} Memory metrics
 */
async function getMemoryMetrics(page) {
  const metrics = await page.metrics();

  const memoryMetrics = {
    'JS Heap Used': Math.round(metrics.JSHeapUsedSize / 1024 / 1024),
    'JS Heap Total': Math.round(metrics.JSHeapTotalSize / 1024 / 1024),
    'DOM Nodes': metrics.Nodes,
    'Event Listeners': metrics.JSEventListeners,
  };

  console.log('\n💾 Memory Metrics:');
  console.log(`   JS Heap Used: ${memoryMetrics['JS Heap Used']} MB`);
  console.log(`   JS Heap Total: ${memoryMetrics['JS Heap Total']} MB`);
  console.log(`   DOM Nodes: ${memoryMetrics['DOM Nodes']}`);
  console.log(`   Event Listeners: ${memoryMetrics['Event Listeners']}`);

  return memoryMetrics;
}

/**
 * Measure rendering performance
 * @param {Page} page - Puppeteer page instance
 * @returns {Promise<object>} Rendering metrics
 */
async function measureRenderPerformance(page) {
  const paintMetrics = await page.evaluate(() => {
    const entries = performance.getEntriesByType('paint');
    const metrics = {};

    entries.forEach((entry) => {
      metrics[entry.name] = Math.round(entry.startTime);
    });

    return metrics;
  });

  console.log('\n🎨 Rendering Metrics:');
  Object.entries(paintMetrics).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}ms`);
  });

  return paintMetrics;
}

/**
 * Create a performance monitoring session
 * @returns {PerformanceMonitor} New performance monitor instance
 */
function createMonitor() {
  return new PerformanceMonitor();
}

/**
 * Assert that a performance metric meets a threshold
 * @param {number} value - Metric value
 * @param {number} threshold - Maximum acceptable value
 * @param {string} label - Metric label
 * @throws {Error} If metric exceeds threshold
 */
function assertPerformance(value, threshold, label) {
  if (value > threshold) {
    throw new Error(
      `❌ Performance assertion failed: ${label} (${value}ms) exceeds threshold (${threshold}ms)`
    );
  }
  console.log(`✅ Performance assertion passed: ${label} (${value}ms) is within threshold (${threshold}ms)`);
}

module.exports = {
  PerformanceMonitor,
  createMonitor,
  measurePageLoad,
  measureApiResponse,
  getMemoryMetrics,
  measureRenderPerformance,
  assertPerformance,
};
