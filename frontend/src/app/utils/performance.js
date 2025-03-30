export function measurePerformance() {
    // In a real app, we'd use the Navigation Timing API
    // For simplicity, we'll simulate a measurement
    const loadTime = Math.floor(Math.random() * 300) + 100; // Between 100ms and 400ms
    return loadTime;
  }