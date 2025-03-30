'use client';

import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import styles from '../app/styles/DataVisualization.module.css';
import { useTheme } from '../app/context/ThemeContext';
import { columnMetadata, getRecommendedVisualization } from '../data/predefinedQueries';

const CHART_TYPES = {
  BAR: 'bar',
  LINE: 'line',
  PIE: 'pie'
};

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f', 
  '#ffbb28', '#ff8042', '#a4de6c', '#d0ed57'
];

export default function DataVisualization({ data, isLoading }) {
  const [chartType, setChartType] = useState(CHART_TYPES.BAR);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [categoryColumn, setCategoryColumn] = useState('');
  const [availableColumns, setAvailableColumns] = useState([]);
  const [numericColumns, setNumericColumns] = useState([]);
  const [categoryColumns, setCategoryColumns] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const { darkMode } = useTheme();

  const identifyColumnTypes = (data) => {
    if (!data || data.length === 0) return { numeric: [], category: [] };

    const columns = Object.keys(data[0]);
    const uniqueValueCounts = {};
    
    columns.forEach(col => uniqueValueCounts[col] = new Set());
    data.forEach(row => {
      columns.forEach(col => {
        if (row[col] !== null && row[col] !== undefined) {
          uniqueValueCounts[col].add(row[col]);
        }
      });
    });
    
    const numeric = [];
    const category = [];
    
    columns.forEach(col => {
      const firstValue = data.find(row => row[col] !== null && row[col] !== undefined)?.[col];
      const uniqueCount = uniqueValueCounts[col].size;
      const uniqueRatio = uniqueCount / data.length;
      
      if (columnMetadata[col]) {
        if (['numeric', 'currency'].includes(columnMetadata[col].type)) {
          numeric.push(col);
        } else if (columnMetadata[col].type === 'category') {
          category.push(col);
        }
      } 
      else {
        if (typeof firstValue === 'number' && uniqueCount > 5) {
          numeric.push(col);
        }
        else if (
          (typeof firstValue === 'string' && uniqueRatio < 0.5 && uniqueCount <= 20) ||
          (typeof firstValue === 'number' && uniqueCount <= 10)
        ) {
          category.push(col);
        }
      }
    });
    
    return { numeric, category };
  };
  
  useEffect(() => {
    if (data && data.length > 0) {
      const recommendation = getRecommendedVisualization(data);
      setRecommendation(recommendation);
      
      if (recommendation.type !== 'none') {
        setChartType(recommendation.type);
        setCategoryColumn(recommendation.categoryAxis);
        setSelectedColumns(recommendation.valueColumns);
      }
    }
  }, [data]);
  
  useEffect(() => {
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      setAvailableColumns(columns);
      
      const { numeric, category } = identifyColumnTypes(data);
      setNumericColumns(numeric);
      setCategoryColumns(category);
      
      if (!categoryColumn && category.length > 0) {
        setCategoryColumn(category[0]);
      }
      
      if (selectedColumns.length === 0 && numeric.length > 0) {
        setSelectedColumns([numeric[0]]);
      }
    }
  }, [data]);
  
  useEffect(() => {
    if (!data || data.length === 0 || !categoryColumn || selectedColumns.length === 0) {
      setProcessedData([]);
      return;
    }
    
    let dataToProcess = [...data];
    if (dataToProcess.length > 20 && chartType !== CHART_TYPES.PIE) {
      if (selectedColumns.length > 0 && typeof data[0][selectedColumns[0]] === 'number') {
        dataToProcess.sort((a, b) => b[selectedColumns[0]] - a[selectedColumns[0]]);
      }
      dataToProcess = dataToProcess.slice(0, 20);
    }
    
    const transformed = dataToProcess.map(item => {
      const newItem = { name: item[categoryColumn] };
      selectedColumns.forEach(col => {
        newItem[col] = typeof item[col] === 'number' ? item[col] : 0;
      });
      return newItem;
    });
    
    setProcessedData(transformed);
  }, [data, categoryColumn, selectedColumns, chartType]);
  
  const handleColumnToggle = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };
  
  if (isLoading) {
    return (
      <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
        <div className={styles.loadingIndicator}>
          Loading visualization...
        </div>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
        <div className={styles.noData}>
          No data available for visualization. Run a query to see charts.
        </div>
      </div>
    );
  }
  
  const formatTooltipValue = (value) => {
    if (typeof value !== 'number') return value;
    
    const selectedColMetadata = columnMetadata[selectedColumns[0]];
    if (selectedColMetadata?.type === 'currency') {
      return `$${value.toFixed(2)}`;
    }
    
    if (selectedColMetadata?.type === 'percent') {
      return `${value.toFixed(1)}%`;
    }
    
    return value >= 1000 ? value.toLocaleString() : value;
  };
  
  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.header}>
        <h2>Data Visualization</h2>
        
        <div className={styles.controls}>
          <div className={styles.chartTypeSelector}>
            <label>Chart Type:</label>
            <select 
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className={styles.select}
            >
              <option value={CHART_TYPES.BAR}>Bar Chart</option>
              <option value={CHART_TYPES.LINE}>Line Chart</option>
              <option value={CHART_TYPES.PIE}>Pie Chart</option>
            </select>
          </div>
          
          <div className={styles.axisSelector}>
            <label>Category Axis:</label>
            <select 
              value={categoryColumn}
              onChange={(e) => setCategoryColumn(e.target.value)}
              className={styles.select}
            >
              {categoryColumns.map(column => (
                <option key={column} value={column}>
                  {columnMetadata[column]?.description || column}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {recommendation && (
        <div className={styles.recommendation}>
          <h3>Recommended Visualization</h3>
          <p>{recommendation.message}</p>
        </div>
      )}
      
      <div className={styles.columnSelector}>
        <h3>Select Data Columns</h3>
        {numericColumns.length === 0 ? (
          <div className={styles.warning}>
            No numeric columns detected. Charts require numeric data to visualize.
          </div>
        ) : (
          <div className={styles.columnOptions}>
            {numericColumns.map((column, index) => (
              <label key={column} className={styles.columnCheckbox}>
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(column)}
                  onChange={() => handleColumnToggle(column)}
                />
                <span 
                  className={styles.colorIndicator} 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                {columnMetadata[column]?.description || column}
              </label>
            ))}
          </div>
        )}
      </div>
      
      <div className={styles.chartContainer}>
        {processedData.length > 0 && selectedColumns.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            {chartType === CHART_TYPES.BAR && (
              <BarChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                {selectedColumns.map((column, index) => (
                  <Bar 
                    key={column} 
                    dataKey={column} 
                    name={columnMetadata[column]?.description || column}
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </BarChart>
            )}
            
            {chartType === CHART_TYPES.LINE && (
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                {selectedColumns.map((column, index) => (
                  <Line 
                    key={column} 
                    type="monotone"
                    dataKey={column}
                    name={columnMetadata[column]?.description || column}
                    stroke={COLORS[index % COLORS.length]}
                    />
                ))}
              </LineChart>
            )}
            {chartType === CHART_TYPES.PIE && (
              <PieChart>
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
                <Pie
                  data={processedData}
                  dataKey={selectedColumns[0]}
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {processedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className={styles.noData}>
            No data available for the selected columns.
          </div>
        )}
      </div>
    </div>
  );
}
