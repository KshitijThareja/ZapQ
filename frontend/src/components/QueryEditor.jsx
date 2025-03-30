'use client';

import { useEffect, useRef } from 'react';
import styles from '../app/styles/QueryEditor.module.css';
import { useTheme } from '../app/context/ThemeContext';

// Simple syntax highlighting function
function highlightSQL(text) {
  // This is a very basic implementation
  // In a real app, you'd use a library like CodeMirror or Monaco Editor
  const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TABLE', 'VIEW', 'INDEX', 'PROCEDURE', 'FUNCTION'];
  
  let highlightedText = text;
  
  // Replace keywords with highlighted spans
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    highlightedText = highlightedText.replace(regex, `<span class="${styles.keyword}">${keyword}</span>`);
  });
  
  return highlightedText;
}

export default function QueryEditor({ query, onQueryChange, onExecuteQuery, isExecuting }) {
  const editorRef = useRef(null);
  const { darkMode } = useTheme();
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Execute query on Ctrl+Enter or Cmd+Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onExecuteQuery();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onExecuteQuery]);
  
  return (
    <div className={`${styles.editorContainer} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.toolbar}>
        <span className={styles.title}>SQL Query Editor</span>
        <div className={styles.toolbarButtons}>
          <button 
            className={styles.executeButton}
            onClick={onExecuteQuery}
            disabled={isExecuting}
          >
            {isExecuting ? 'Running...' : 'Execute (Ctrl+Enter)'}
          </button>
          <button 
            className={styles.clearButton}
            onClick={() => onQueryChange('')}
          >
            Clear
          </button>
        </div>
      </div>
      
      <textarea
        ref={editorRef}
        className={styles.queryTextarea}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Type your SQL query here..."
        spellCheck="false"
      />
      
      <div className={styles.statusBar}>
        <span>
          {query.length} chars | {query.split('\n').length} lines
        </span>
        <span className={styles.keyboardHint}>
          Press Ctrl+Enter to execute
        </span>
      </div>
    </div>
  );
}
