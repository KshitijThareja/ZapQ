export function measurePerformance() {
  if (typeof window === 'undefined') return null;
  
  const navEntry = performance.getEntriesByType('navigation')[0];
  if (!navEntry) return null;
  
  const pageLoadTime = navEntry.domContentLoadedEventEnd - navEntry.startTime;
  
  return Math.floor(pageLoadTime);
}

export function measureQueryExecution(callback) {
  performance.mark('query-execution-start');
  
  const result = callback();
  
  performance.mark('query-execution-end');
  performance.measure(
    'query-execution', 
    'query-execution-start', 
    'query-execution-end'
  );
  
  const measurements = performance.getEntriesByName('query-execution');
  const executionTime = measurements[0]?.duration.toFixed(2) || 0;
  
  performance.clearMarks('query-execution-start');
  performance.clearMarks('query-execution-end');
  performance.clearMeasures('query-execution');
  
  return {
    result,
    executionTime
  };
}

export function collectPerformanceMetrics() {
  if (typeof window === 'undefined') return {};
  
  const navEntry = performance.getEntriesByType('navigation')[0];
  
  if (!navEntry) return {};
  
  const metrics = {
    totalLoadTime: navEntry.loadEventEnd - navEntry.startTime,
    domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.startTime,
    firstPaint: navEntry.responseEnd - navEntry.startTime,
    dnsLookup: navEntry.domainLookupEnd - navEntry.domainLookupStart,
    tcpConnection: navEntry.connectEnd - navEntry.connectStart,
    serverResponse: navEntry.responseStart - navEntry.requestStart,
    contentDownload: navEntry.responseEnd - navEntry.responseStart,
    domProcessing: navEntry.domComplete - navEntry.domLoading,
  };
  
  const paintMetrics = performance.getEntriesByType('paint');
  const firstPaint = paintMetrics.find(entry => entry.name === 'first-paint');
  const firstContentfulPaint = paintMetrics.find(entry => entry.name === 'first-contentful-paint');
  
  if (firstPaint) {
    metrics.firstPaint = firstPaint.startTime;
  }
  
  if (firstContentfulPaint) {
    metrics.firstContentfulPaint = firstContentfulPaint.startTime;
  }
  
  return metrics;
}