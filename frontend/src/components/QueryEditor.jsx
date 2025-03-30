'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '../app/styles/QueryEditor.module.css';
import { useTheme } from '../app/context/ThemeContext';

function highlightSQL(text) {
  const keywords = ['SELECT', 'AS', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TABLE', 'VIEW', 'INDEX', 'PROCEDURE', 'FUNCTION'];
  
  let highlightedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  highlightedText = highlightedText.replace(/\n/g, '<br>');  
  highlightedText = ' ' + highlightedText + ' ';
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\s${keyword}\\s`, 'gi');
    highlightedText = highlightedText.replace(regex, match => {
      return match.replace(new RegExp(keyword, 'i'), 
        `<span class="${styles.keyword}">${match.trim()}</span>`);
    });
  });
  
  highlightedText = highlightedText.trim();
  
  return highlightedText;
}

export default function QueryEditor({ query, onQueryChange, onExecuteQuery, isExecuting }) {
  const editorRef = useRef(null);
  const highlightLayerRef = useRef(null);
  const { darkMode } = useTheme();
  const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });
  
  useEffect(() => {
    if (highlightLayerRef.current) {
      highlightLayerRef.current.innerHTML = highlightSQL(query);
      
      if (editorRef.current) {
        highlightLayerRef.current.scrollTop = editorRef.current.scrollTop;
        highlightLayerRef.current.scrollLeft = editorRef.current.scrollLeft;
      }
    }
  }, [query]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (editorRef.current && highlightLayerRef.current) {
        highlightLayerRef.current.scrollTop = editorRef.current.scrollTop;
        highlightLayerRef.current.scrollLeft = editorRef.current.scrollLeft;
      }
    };
    
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('scroll', handleScroll);
      return () => editor.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onExecuteQuery();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onExecuteQuery]);
  
  const handleSelectionChange = (e) => {
    setCursorPosition({
      start: e.target.selectionStart,
      end: e.target.selectionEnd
    });
  };
  
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
      
      <div className={styles.editorWrapper}>
        <div 
          ref={highlightLayerRef}
          className={styles.highlightLayer}
          aria-hidden="true"
        />
        <textarea
          ref={editorRef}
          className={styles.queryTextarea}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onSelect={handleSelectionChange}
          onScroll={() => {
            if (highlightLayerRef.current && editorRef.current) {
              highlightLayerRef.current.scrollTop = editorRef.current.scrollTop;
              highlightLayerRef.current.scrollLeft = editorRef.current.scrollLeft;
            }
          }}
          placeholder="Type your SQL query here..."
          spellCheck="false"
        />
      </div>
      
      <div className={styles.statusBar}>
        <span>
          {query.length} chars | {query.split('\n').length} lines | Position: {cursorPosition.start}
        </span>
        <span className={styles.keyboardHint}>
          Press Ctrl+Enter to execute
        </span>
      </div>
    </div>
  );
}