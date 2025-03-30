'use client';

import { useState } from 'react';
import styles from '../app/styles/Sidebar.module.css';
import { useTheme } from '../app/context/ThemeContext';

export default function Sidebar({ 
  predefinedQueries, 
  queryHistory, 
  savedQueries, 
  onQuerySelect, 
  onSaveQuery 
}) {
  const [activeTab, setActiveTab] = useState('predefined');
  const [isExpanded, setIsExpanded] = useState(true);
  const [saveQueryName, setSaveQueryName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { darkMode } = useTheme();
  
  const handleSaveQuery = () => {
    if (saveQueryName.trim()) {
      onSaveQuery(saveQueryName);
      setSaveQueryName('');
      setIsSaving(false);
    }
  };
  
  if (!isExpanded) {
    return (
      <div 
        className={`${styles.collapsedSidebar} ${darkMode ? styles.dark : ''}`}
        onClick={() => setIsExpanded(true)}
      >
        <span>≡</span>
      </div>
    );
  }
  
  return (
    <div className={`${styles.sidebar} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.sidebarHeader}>
        <h2>Query Library</h2>
        <button 
          className={styles.collapseButton}
          onClick={() => setIsExpanded(false)}
        >
          &lt;
        </button>
      </div>
      
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'predefined' ? styles.active : ''}`}
          onClick={() => setActiveTab('predefined')}
        >
          Templates
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'history' ? styles.active : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'saved' ? styles.active : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved
        </button>
      </div>
      
      <div className={styles.tabContent}>
        {activeTab === 'predefined' && (
          <div className={styles.predefinedQueries}>
            {predefinedQueries.map((item, index) => (
              <div 
                key={index} 
                className={styles.queryItem}
                onClick={() => onQuerySelect(item.query)}
              >
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className={styles.queryHistory}>
            {queryHistory.length > 0 ? (
              queryHistory.map((query, index) => (
                <div 
                  key={index} 
                  className={styles.historyItem}
                  onClick={() => onQuerySelect(query)}
                >
                  <p>{query.length > 50 ? query.substring(0, 50) + '...' : query}</p>
                </div>
              ))
            ) : (
              <p className={styles.emptyMessage}>No query history yet</p>
            )}
          </div>
        )}
        
        {activeTab === 'saved' && (
          <div className={styles.savedQueries}>
            <div className={styles.saveActions}>
              {isSaving ? (
                <div className={styles.saveForm}>
                  <input
                    type="text"
                    placeholder="Query name"
                    value={saveQueryName}
                    onChange={(e) => setSaveQueryName(e.target.value)}
                    className={styles.saveInput}
                  />
                  <div className={styles.saveFormButtons}>
                    <button 
                      onClick={handleSaveQuery}
                      className={styles.saveButton}
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setIsSaving(false);
                        setSaveQueryName('');
                      }}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsSaving(true)}
                  className={styles.newSaveButton}
                >
                  Save Current Query
                </button>
              )}
            </div>
            
            {savedQueries.length > 0 ? (
              savedQueries.map((item, index) => (
                <div 
                  key={index} 
                  className={styles.savedItem}
                  onClick={() => onQuerySelect(item.query)}
                >
                  <h3>{item.name}</h3>
                  <p>{item.query.length > 40 ? item.query.substring(0, 40) + '...' : item.query}</p>
                </div>
              ))
            ) : (
              <p className={styles.emptyMessage}>No saved queries yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}