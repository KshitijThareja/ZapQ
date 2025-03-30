export const customerData = [
  {
    customerID: 'ALFKI',
    companyName: 'Alfreds Futterkiste',
    contactName: 'Maria Anders',
    contactTitle: 'Sales Representative',
    address: 'Obere Str. 57',
    city: 'Berlin',
    region: null,
    postalCode: '12209',
    country: 'Germany',
    phone: '030-0074321',
    fax: '030-0076545',
    // Added metrics for visualization
    totalOrders: 6,
    totalSpend: 3746.70,
    averageOrderValue: 624.45,
    lastOrderDate: '2024-12-15',
    daysSinceLastOrder: 105,
    customerSince: '2022-05-18',
    loyaltyScore: 87
  },
  {
    customerID: 'ANATR',
    companyName: 'Ana Trujillo Emparedados y helados',
    contactName: 'Ana Trujillo',
    contactTitle: 'Owner',
    address: 'Avda. de la Constitución 2222',
    city: 'México D.F.',
    region: null,
    postalCode: '05021',
    country: 'Mexico',
    phone: '(5) 555-4729',
    fax: '(5) 555-3745',
    // Added metrics
    totalOrders: 4,
    totalSpend: 1488.80,
    averageOrderValue: 372.20,
    lastOrderDate: '2025-01-20',
    daysSinceLastOrder: 69,
    customerSince: '2023-07-11',
    loyaltyScore: 72
  },
];

// Generate a bigger dataset with meaningful numeric metrics
for (let i = 1; i <= 100; i++) {
  const countries = ['USA', 'UK', 'Canada', 'France', 'Germany', 'Spain', 'Italy', 'Japan', 'China', 'Australia'];
  const regions = ['North', 'South', 'East', 'West', 'Central', null];
  const titles = ['Owner', 'Sales Manager', 'Marketing Director', 'CEO', 'CTO', 'Purchasing Representative'];
  
  // Generate random dates in the past for customer acquisition
  const today = new Date();
  const randomDaysAgo = Math.floor(Math.random() * 1095); // Up to 3 years ago
  const randomStart = new Date(today);
  randomStart.setDate(today.getDate() - randomDaysAgo);
  
  // Generate last order date (more recent than start date)
  const lastOrderDaysAgo = Math.floor(Math.random() * randomDaysAgo);
  const lastOrderDate = new Date(today);
  lastOrderDate.setDate(today.getDate() - lastOrderDaysAgo);
  
  // More realistic order counts based on customer tenure
  const tenureInMonths = Math.floor(randomDaysAgo / 30);
  const ordersPerMonth = Math.random() * 0.8 + 0.2; // 0.2 to 1 orders per month
  const totalOrders = Math.max(1, Math.floor(tenureInMonths * ordersPerMonth));
  
  // Generate spend metrics that correlate
  const averageOrderValue = Math.floor(Math.random() * 900) + 100; // $100 to $1000
  const totalSpend = +(averageOrderValue * totalOrders).toFixed(2);
  
  // Loyalty score calculation based on frequency and spend
  const spendFactor = Math.min(1, totalSpend / 10000); // Max at $10k
  const frequencyFactor = Math.min(1, totalOrders / 24); // Max at 24 orders
  const recencyFactor = Math.min(1, 1 - (lastOrderDaysAgo / 365)); // Higher for recent orders
  const loyaltyScore = Math.floor((spendFactor * 0.4 + frequencyFactor * 0.4 + recencyFactor * 0.2) * 100);
  
  customerData.push({
    customerID: `CUST${i.toString().padStart(3, '0')}`,
    companyName: `Company ${i}`,
    contactName: `Contact ${i}`,
    contactTitle: titles[Math.floor(Math.random() * titles.length)],
    address: `Address line ${i}`,
    city: `City ${i}`,
    region: regions[Math.floor(Math.random() * regions.length)],
    postalCode: `${Math.floor(10000 + Math.random() * 90000)}`,
    country: countries[Math.floor(Math.random() * countries.length)],
    phone: `(${Math.floor(100 + Math.random() * 900)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
    fax: Math.random() > 0.3 ? `(${Math.floor(100 + Math.random() * 900)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}` : null,
    // Added metrics
    totalOrders: totalOrders,
    totalSpend: totalSpend,
    averageOrderValue: +(totalSpend / totalOrders).toFixed(2),
    lastOrderDate: lastOrderDate.toISOString().split('T')[0],
    daysSinceLastOrder: lastOrderDaysAgo,
    customerSince: randomStart.toISOString().split('T')[0],
    loyaltyScore: loyaltyScore
  });
}

// Define visualization metadata for the columns
export const columnMetadata = {
  customerID: { type: 'id', visualizable: false, description: 'Unique customer identifier' },
  companyName: { type: 'category', visualizable: true, description: 'Customer company name', recommendedForAxis: true },
  contactName: { type: 'text', visualizable: false, description: 'Contact person name' },
  contactTitle: { type: 'category', visualizable: true, description: 'Contact person role', recommendedForAxis: true },
  address: { type: 'text', visualizable: false, description: 'Street address' },
  city: { type: 'category', visualizable: true, description: 'City', recommendedForAxis: true },
  region: { type: 'category', visualizable: true, description: 'Region', recommendedForAxis: true },
  postalCode: { type: 'text', visualizable: false, description: 'Postal code' },
  country: { type: 'category', visualizable: true, description: 'Country', recommendedForAxis: true },
  phone: { type: 'text', visualizable: false, description: 'Phone number' },
  fax: { type: 'text', visualizable: false, description: 'Fax number' },
  totalOrders: { type: 'numeric', visualizable: true, description: 'Total number of orders placed', recommendedForValue: true },
  totalSpend: { type: 'currency', visualizable: true, description: 'Total amount spent (USD)', recommendedForValue: true },
  averageOrderValue: { type: 'currency', visualizable: true, description: 'Average order value (USD)', recommendedForValue: true },
  lastOrderDate: { type: 'date', visualizable: false, description: 'Date of last order' },
  daysSinceLastOrder: { type: 'numeric', visualizable: true, description: 'Days since last order', recommendedForValue: true },
  customerSince: { type: 'date', visualizable: false, description: 'Customer since date' },
  loyaltyScore: { type: 'numeric', visualizable: true, description: 'Customer loyalty score (0-100)', recommendedForValue: true }
};

// Define a set of predefined queries with visualization-friendly results
export const predefinedQueries = [
  {
    name: 'All Customers',
    description: 'Display all customer records',
    query: 'SELECT * FROM Customers',
    results: customerData,
    recommendedVisualization: {
      type: 'none',
      message: 'Too many columns for effective visualization. Try a more specific query.'
    }
  },
  {
    name: 'Customers by Country',
    description: 'Group customers by country',
    query: 'SELECT country, COUNT(*) as customer_count, AVG(totalSpend) as avg_spend, AVG(loyaltyScore) as avg_loyalty FROM Customers GROUP BY country ORDER BY customer_count DESC',
    results: (() => {
      // Group by country with aggregates
      const countryStats = {};
      customerData.forEach(customer => {
        if (!countryStats[customer.country]) {
          countryStats[customer.country] = {
            country: customer.country,
            customer_count: 0,
            total_spend: 0,
            loyalty_scores: []
          };
        }
        countryStats[customer.country].customer_count++;
        countryStats[customer.country].total_spend += customer.totalSpend;
        countryStats[customer.country].loyalty_scores.push(customer.loyaltyScore);
      });
      
      return Object.values(countryStats).map(stats => ({
        country: stats.country,
        customer_count: stats.customer_count,
        avg_spend: +(stats.total_spend / stats.customer_count).toFixed(2),
        avg_loyalty: +(stats.loyalty_scores.reduce((a, b) => a + b, 0) / stats.loyalty_scores.length).toFixed(1)
      })).sort((a, b) => b.customer_count - a.customer_count);
    })(),
    recommendedVisualization: {
      type: 'bar',
      categoryAxis: 'country',
      valueColumns: ['customer_count', 'avg_spend', 'avg_loyalty']
    }
  },
  {
    name: 'Customer Spending Analysis',
    description: 'Analyze customer spending patterns',
    query: 'SELECT companyName, totalOrders, totalSpend, averageOrderValue, loyaltyScore FROM Customers ORDER BY totalSpend DESC LIMIT 20',
    results: (() => {
      return [...customerData]
        .sort((a, b) => b.totalSpend - a.totalSpend)
        .slice(0, 20)
        .map(({ companyName, totalOrders, totalSpend, averageOrderValue, loyaltyScore }) => ({
          companyName, totalOrders, totalSpend, averageOrderValue, loyaltyScore
        }));
    })(),
    recommendedVisualization: {
      type: 'bar',
      categoryAxis: 'companyName',
      valueColumns: ['totalSpend']
    }
  },
  {
    name: 'Customer Loyalty Distribution',
    description: 'Distribution of customer loyalty scores',
    query: 'SELECT FLOOR(loyaltyScore/10)*10 as loyalty_bracket, COUNT(*) as customer_count FROM Customers GROUP BY loyalty_bracket ORDER BY loyalty_bracket',
    results: (() => {
      const brackets = {};
      for (let i = 0; i <= 90; i += 10) {
        brackets[i] = 0;
      }
      
      customerData.forEach(customer => {
        const bracket = Math.floor(customer.loyaltyScore / 10) * 10;
        brackets[bracket]++;
      });
      
      return Object.entries(brackets).map(([bracket, count]) => ({
        loyalty_bracket: `${bracket}-${+bracket+9}`,
        customer_count: count
      }));
    })(),
    recommendedVisualization: {
      type: 'bar',
      categoryAxis: 'loyalty_bracket',
      valueColumns: ['customer_count']
    }
  },
  {
    name: 'Order Recency Analysis',
    description: 'Analyze how recently customers have ordered',
    query: 'SELECT FLOOR(daysSinceLastOrder/30) as months_since_order, COUNT(*) as customer_count FROM Customers GROUP BY months_since_order ORDER BY months_since_order',
    results: (() => {
      const recencyBrackets = {};
      
      customerData.forEach(customer => {
        const monthsSinceOrder = Math.floor(customer.daysSinceLastOrder / 30);
        if (!recencyBrackets[monthsSinceOrder]) {
          recencyBrackets[monthsSinceOrder] = 0;
        }
        recencyBrackets[monthsSinceOrder]++;
      });
      
      return Object.entries(recencyBrackets)
        .map(([months, count]) => ({
          months_since_order: +months,
          customer_count: count
        }))
        .sort((a, b) => a.months_since_order - b.months_since_order);
    })(),
    recommendedVisualization: {
      type: 'line',
      categoryAxis: 'months_since_order',
      valueColumns: ['customer_count']
    }
  },
  {
    name: 'Customer Value by Region',
    description: 'Compare total spend and order counts by region',
    query: 'SELECT region, COUNT(*) as customer_count, SUM(totalSpend) as total_spend, AVG(totalOrders) as avg_orders FROM Customers WHERE region IS NOT NULL GROUP BY region',
    results: (() => {
      const regionStats = {};
      
      customerData.filter(c => c.region).forEach(customer => {
        if (!regionStats[customer.region]) {
          regionStats[customer.region] = {
            region: customer.region,
            customer_count: 0,
            total_spend: 0,
            order_count: 0
          };
        }
        regionStats[customer.region].customer_count++;
        regionStats[customer.region].total_spend += customer.totalSpend;
        regionStats[customer.region].order_count += customer.totalOrders;
      });
      
      return Object.values(regionStats).map(stats => ({
        region: stats.region,
        customer_count: stats.customer_count,
        total_spend: +stats.total_spend.toFixed(2),
        avg_orders: +(stats.order_count / stats.customer_count).toFixed(1)
      }));
    })(),
    recommendedVisualization: {
      type: 'bar',
      categoryAxis: 'region',
      valueColumns: ['total_spend', 'avg_orders']
    }
  },
  {
    name: 'Average Order Value by Country',
    description: 'Compare average order values across countries',
    query: 'SELECT country, AVG(averageOrderValue) as avg_order_value, COUNT(*) as customer_count FROM Customers GROUP BY country ORDER BY avg_order_value DESC',
    results: (() => {
      const countryAOV = {};
      
      customerData.forEach(customer => {
        if (!countryAOV[customer.country]) {
          countryAOV[customer.country] = {
            country: customer.country,
            order_values: [],
            customer_count: 0
          };
        }
        countryAOV[customer.country].order_values.push(customer.averageOrderValue);
        countryAOV[customer.country].customer_count++;
      });
      
      return Object.values(countryAOV).map(stats => ({
        country: stats.country,
        avg_order_value: +(stats.order_values.reduce((a, b) => a + b, 0) / stats.order_values.length).toFixed(2),
        customer_count: stats.customer_count
      })).sort((a, b) => b.avg_order_value - a.avg_order_value);
    })(),
    recommendedVisualization: {
      type: 'bar',
      categoryAxis: 'country',
      valueColumns: ['avg_order_value']
    }
  }
];

// Utility function to get recommended visualization settings for a dataset
export function getRecommendedVisualization(data) {
  if (!data || data.length === 0) {
    return {
      type: 'none',
      message: 'No data available for visualization'
    };
  }
  
  const columns = Object.keys(data[0]);
  
  // 1. Identify potential category columns (strings with low cardinality)
  const columnCounts = {};
  columns.forEach(col => {
    columnCounts[col] = new Set();
  });
  
  // Count unique values in each column
  data.forEach(row => {
    columns.forEach(col => {
      if (row[col] !== null && row[col] !== undefined) {
        columnCounts[col].add(row[col]);
      }
    });
  });
  
  // Find columns with reasonably low cardinality (good for x-axis)
  const categoryCandidates = columns.filter(col => {
    const uniqueCount = columnCounts[col].size;
    const dataType = typeof data[0][col];
    return (
      (dataType === 'string' && uniqueCount <= Math.min(20, data.length / 2)) ||
      (col.includes('_bucket') || col.includes('_bracket') || col.includes('_group'))
    );
  });
  
  // 2. Identify numeric columns (good for y-axis)
  const numericColumns = columns.filter(col => {
    return typeof data[0][col] === 'number' && 
           !['id', 'code', 'zip', 'year'].some(term => col.toLowerCase().includes(term));
  });
  
  // 3. Make recommendations
  if (categoryCandidates.length === 0 || numericColumns.length === 0) {
    return {
      type: 'none',
      message: 'No suitable columns found for visualization'
    };
  }
  
  // Pick best category column (prioritize those with metadata recommendations)
  let bestCategoryColumn = categoryCandidates[0];
  for (const col of categoryCandidates) {
    if (columnMetadata[col]?.recommendedForAxis) {
      bestCategoryColumn = col;
      break;
    }
  }
  
  // Pick top numeric columns
  const topNumericColumns = numericColumns
    .filter(col => (columnMetadata[col]?.recommendedForValue) || true)
    .slice(0, 3);
  
  // Choose chart type based on data characteristics
  let chartType = 'bar'; // Default
  
  // Time series detection (columns with 'date', 'month', 'year', etc.)
  const timeSeriesPattern = /date|month|year|period|quarter|week|day|time/i;
  if (bestCategoryColumn.match(timeSeriesPattern) || 
      (data.length > 5 && categoryCandidates.length === 1 && numericColumns.length === 1)) {
    chartType = 'line';
  }
  
  // Single numeric column with percentages or parts of a whole
  if (numericColumns.length === 1 && 
      (bestCategoryColumn.includes('type') || 
       bestCategoryColumn.includes('category'))) {
    chartType = 'pie';
  }
  
  return {
    type: chartType,
    categoryAxis: bestCategoryColumn,
    valueColumns: topNumericColumns,
    message: `Showing ${chartType} chart with ${bestCategoryColumn} on x-axis and ${topNumericColumns.join(', ')} as values`
  };
}