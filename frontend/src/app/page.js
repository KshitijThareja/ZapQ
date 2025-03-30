'use client';

import { useState, useEffect } from 'react';
import QueryEditor from '../components/QueryEditor';
import ResultsTable from '../components/ResultsTable';
import DataVisualization from '../components/DataVisualization';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { predefinedQueries } from '../data/predefinedQueries';
import { processQuery } from './utils/queryProcessor';
import { measurePerformance, measureQueryExecution, collectPerformanceMetrics } from './utils/performance';
import { useTheme } from '../app/context/ThemeContext';
import styles from './page.module.css';

export default function Home() {
  const [currentQuery, setCurrentQuery] = useState(predefinedQueries[0].query);
  const [queryResults, setQueryResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);
  const [savedQueries, setSavedQueries] = useState([]);
  const [layout, setLayout] = useState({
    editorHeight: 30,
    showVisualization: true
  });
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('results');

  useEffect(() => {
    const loadTime = measurePerformance();
    const metrics = collectPerformanceMetrics();

    setPerformanceMetrics({
      pageLoadTime: loadTime,
      ...metrics
    });

    executeQuery(currentQuery);

    const saved = localStorage.getItem('savedQueries');
    if (saved) {
      setSavedQueries(JSON.parse(saved));
    }
  }, []);

  const executeQuery = async (query) => {
    setIsLoading(true);

    try {
      const { result, executionTime } = measureQueryExecution(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            const results = processQuery(query);
            resolve(results);
          }, 0);
        });
      });

      const results = await result;

      setQueryResults(results);
      setExecutionTime(executionTime);

      if (!queryHistory.includes(query)) {
        setQueryHistory(prev => [query, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error("Error executing query:", error);
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
    setLayout(prev => ({ ...prev, editorHeight }));
  };

  const toggleVisualization = () => {
    setLayout(prev => ({ ...prev, showVisualization: !prev.showVisualization }));
  };

  const { darkMode } = useTheme();

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      <Navbar
        executionTime={executionTime}
        performanceMetrics={performanceMetrics}
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
            <div className={`${styles.resultsTabs} ${darkMode ? styles.dark : ''}`}>
              <button
                className={`${styles.tabButton} ${darkMode ? styles.dark : ''}`}
                onClick={() => setActiveTab('results')}
              >
                Results Table
              </button>
              <button
                className={`${styles.tabButton} ${darkMode ? styles.dark : ''}`}
                onClick={() => setActiveTab('visualization')}
              >
                Visualization
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'results' && (
                <div className={styles.resultsWrapper}>
                  <ResultsTable
                    results={queryResults}
                    isLoading={isLoading}
                  />
                </div>
              )}

              {activeTab === 'visualization' && (
                <div className={styles.visualizationWrapper}>
                  <DataVisualization
                    data={queryResults}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}