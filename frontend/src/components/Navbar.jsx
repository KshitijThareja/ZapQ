'use client';

import styles from '../app/styles/Navbar.module.css';
import { useTheme } from '../app/context/ThemeContext';
import { BiSolidZap } from "react-icons/bi";
import { IoMdSunny, IoMdMoon } from "react-icons/io";

export default function Navbar({ executionTime, pageLoadTime }) {
  const { darkMode, toggleTheme } = useTheme();
  
  return (
    <div className={`${styles.navbar} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <BiSolidZap size={25} /> <h1>ZapQ</h1>
        </div>
      </div>
      
      <div className={styles.metricSection}>
        {executionTime && (
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Query Time:</span>
            <span className={styles.metricValue}>{executionTime} ms</span>
          </div>
        )}
        
        {pageLoadTime && (
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Page Load:</span>
            <span className={styles.metricValue}>{pageLoadTime} ms</span>
          </div>
        )}
      </div>
      
      <div className={styles.actions}>
        <button 
          className={styles.themeToggle}
          onClick={toggleTheme}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <IoMdSunny size={24} /> : <IoMdMoon size={24} />}
        </button>
      </div>
    </div>
  );
}