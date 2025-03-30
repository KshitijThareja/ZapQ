export function measurePerformance() {
  if (typeof window === 'undefined') return null;
  
  const navigation = window.performance.timing;
  const pageLoadTime = navigation.domContentLoadedEventEnd - navigation.navigationStart;
  
  return pageLoadTime;
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
  const executionTime = measurements[0].duration.toFixed(2);
  
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
  
  const navigation = window.performance.timing;
  const metrics = {
    totalLoadTime: navigation.loadEventEnd - navigation.navigationStart,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
    firstPaint: navigation.responseEnd - navigation.navigationStart,
    dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcpConnection: navigation.connectEnd - navigation.connectStart,
    serverResponse: navigation.responseStart - navigation.requestStart,
    contentDownload: navigation.responseEnd - navigation.responseStart,
    domProcessing: navigation.domComplete - navigation.domLoading,
  };
  
  return metrics;
}