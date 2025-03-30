'use client';

import { useState } from 'react';
import styles from '../app/styles/ResultsTable.module.css';
import { useTheme } from '../app/context/ThemeContext';

export default function ResultsTable({ results, isLoading }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filters, setFilters] = useState({});
  const { darkMode } = useTheme();
  
  // If there are no results yet
  if (results.length === 0 && !isLoading) {
    return (
      <div className={`${styles.noResults} ${darkMode ? styles.dark : ''}`}>
        <p>No results to display. Run a query to see data here.</p>
      </div>
    );
  }
  
  // If loading
  if (isLoading) {
    return (
      <div className={`${styles.loading} ${darkMode ? styles.dark : ''}`}>
        <div className={styles.spinner}></div>
        <p>Executing query...</p>
      </div>
    );
  }
  
  // Get the column headers from the first row
  const columns = Object.keys(results[0] || {});
  
  // Apply sorting
  const sortedResults = [...results].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];
    
    if (valueA < valueB) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
  
  // Apply filtering
  const filteredResults = sortedResults.filter(row => {
    return Object.entries(filters).every(([column, filterValue]) => {
      if (!filterValue) return true;
      const cellValue = String(row[column]).toLowerCase();
      return cellValue.includes(filterValue.toLowerCase());
    });
  });
  
  // Apply pagination
  const totalPages = Math.ceil(filteredResults.length / rowsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const handleFilterChange = (column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  const exportToCsv = () => {
    // Generate CSV content
    const headers = columns.join(',');
    const rows = filteredResults.map(row => 
      columns.map(col => `"${row[col]}"`).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set link properties
    link.href = url;
    link.download = 'query_results.csv';
    link.style.display = 'none';
    
    // Add to DOM and click
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  return (
    <div className={`${styles.tableContainer} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.tableHeader}>
        <div className={styles.resultSummary}>
          Showing {paginatedResults.length} of {filteredResults.length} results
          {filteredResults.length !== results.length && ` (filtered from ${results.length} total)`}
        </div>
        
        <div className={styles.tableActions}>
          <select 
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className={styles.rowsPerPageSelect}
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>
          
          <button 
            className={styles.exportButton}
            onClick={exportToCsv}
          >
            Export CSV
          </button>
        </div>
      </div>
      
      <div className={styles.tableWrapper}>
        <table className={styles.resultsTable}>
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column} onClick={() => requestSort(column)}>
                  {column}
                  {sortConfig.key === column && (
                    <span className={styles.sortIndicator}>
                      {sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
            <tr className={styles.filterRow}>
              {columns.map(column => (
                <th key={`filter-${column}`}>
                  <input
                    type="text"
                    placeholder="Filter..."
                    value={filters[column] || ''}
                    onChange={(e) => handleFilterChange(column, e.target.value)}
                    className={styles.filterInput}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedResults.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map(column => (
                  <td key={`${rowIndex}-${column}`}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className={styles.paginationButton}
          >
            &laquo;
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className={styles.paginationButton}
          >
            &lt;
          </button>
          
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className={styles.paginationButton}
          >
            &gt;
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className={styles.paginationButton}
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
}