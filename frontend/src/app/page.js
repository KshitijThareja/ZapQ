'use client';

import { useState, useEffect } from 'react';
import QueryEditor from '../components/QueryEditor';
import ResultsTable from '../components/ResultsTable';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ThemeProvider from './context/ThemeContext';
import { predefinedQueries } from '../data/predefinedQueries';
import { processQuery } from './utils/queryProcessor';
import { measurePerformance } from './utils/performance';
import styles from './page.module.css';

export default function Home() {
  const [currentQuery, setCurrentQuery] = useState(predefinedQueries[0].query);
  const [queryResults, setQueryResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);
  const [savedQueries, setSavedQueries] = useState([]);
  const [layout, setLayout] = useState({ editorHeight: 30 }); 
  const [pageLoadTime, setPageLoadTime] = useState(null);

  useEffect(() => {
    // Measure initial page load time
    const loadTime = measurePerformance();
    setPageLoadTime(loadTime);
    
    // Execute default query on load
    executeQuery(currentQuery);
    
    // Initialize saved queries from localStorage if available
    const saved = localStorage.getItem('savedQueries');
    if (saved) {
      setSavedQueries(JSON.parse(saved));
    }
  }, []);

  const executeQuery = async (query) => {
    setIsLoading(true);
    
    // Start timing
    const startTime = performance.now();
    
    try {
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Process the query (this is mocked, as per requirements)
      const results = processQuery(query);
      
      // Calculate execution time
      const endTime = performance.now();
      const timeTaken = (endTime - startTime).toFixed(2);
      
      setQueryResults(results);
      setExecutionTime(timeTaken);
      
      // Add to history if not a duplicate
      if (!queryHistory.includes(query)) {
        setQueryHistory(prev => [query, ...prev.slice(0, 9)]); // Keep last 10 queries
      }
    } catch (error) {
      console.error("Error executing query:", error);
      // In a real app, we would handle errors more gracefully
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (newQuery) => {
    setCurrentQuery(newQuery);
  };

  const handlePredefinedQuerySelect = (query) => {
    setCurrentQuery(query);
    executeQuery(query);
  };

  const saveQuery = (name) => {
    const newSavedQuery = { name, query: currentQuery };
    const updated = [...savedQueries, newSavedQuery];
    setSavedQueries(updated);
    localStorage.setItem('savedQueries', JSON.stringify(updated));
  };

  const handleLayoutChange = (editorHeight) => {
    setLayout({ editorHeight });
  };

  return (
    <ThemeProvider>
      <div className={styles.container}>
        <Navbar 
          executionTime={executionTime} 
          pageLoadTime={pageLoadTime}
        />
        
        <div className={styles.mainContent}>
          <Sidebar 
            predefinedQueries={predefinedQueries}
            queryHistory={queryHistory}
            savedQueries={savedQueries}
            onQuerySelect={handlePredefinedQuerySelect}
            onSaveQuery={saveQuery}
          />
          
          <div className={styles.queryContainer}>
            <div 
              className={styles.queryEditor} 
              style={{ height: `${layout.editorHeight}vh` }}
            >
              <QueryEditor 
                query={currentQuery}
                onQueryChange={handleQueryChange}
                onExecuteQuery={() => executeQuery(currentQuery)}
                isExecuting={isLoading}
              />
              <div className={styles.resizeHandle} 
                onMouseDown={(e) => {
                  const startY = e.clientY;
                  const startHeight = layout.editorHeight;
                  
                  const handleMouseMove = (moveEvent) => {
                    const deltaY = moveEvent.clientY - startY;
                    const newHeight = startHeight + (deltaY * 0.1);
                    if (newHeight > 10 && newHeight < 70) {
                      handleLayoutChange(newHeight);
                    }
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
            </div>
            
            <div className={styles.resultsContainer}>
              <ResultsTable 
                results={queryResults} 
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}