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
      fax: '030-0076545'
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
      fax: '(5) 555-3745'
    },
    // Generate more entries
    // In a real implementation, we would parse the CSV file
    // For brevity, I'm including just a sample
  ];
  
  // Generate a bigger dataset
  for (let i = 1; i <= 100; i++) {
    const countries = ['USA', 'UK', 'Canada', 'France', 'Germany', 'Spain', 'Italy', 'Japan', 'China', 'Australia'];
    const regions = ['North', 'South', 'East', 'West', 'Central', null];
    const titles = ['Owner', 'Sales Manager', 'Marketing Director', 'CEO', 'CTO', 'Purchasing Representative'];
    
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
      fax: Math.random() > 0.3 ? `(${Math.floor(100 + Math.random() * 900)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}` : null
    });
  }
  
  // Define a set of predefined queries
  export const predefinedQueries = [
    {
      name: 'All Customers',
      description: 'Display all customer records',
      query: 'SELECT * FROM Customers',
      results: customerData
    },
    {
      name: 'Customers by Country',
      description: 'Group customers by country',
      query: 'SELECT country, COUNT(*) as customer_count FROM Customers GROUP BY country ORDER BY customer_count DESC',
      results: (() => {
        // Generate country counts
        const countryCounts = {};
        customerData.forEach(customer => {
          if (countryCounts[customer.country]) {
            countryCounts[customer.country]++;
          } else {
            countryCounts[customer.country] = 1;
          }
        });
        
        return Object.entries(countryCounts).map(([country, count]) => ({
          country,
          customer_count: count
        })).sort((a, b) => b.customer_count - a.customer_count);
      })()
    },
    {
      name: 'Customers without Fax',
      description: 'Find customers who haven\'t provided a fax number',
      query: 'SELECT customerID, companyName, contactName, phone FROM Customers WHERE fax IS NULL',
      results: customerData.filter(customer => customer.fax === null)
        .map(({ customerID, companyName, contactName, phone }) => ({ 
          customerID, companyName, contactName, phone 
        }))
    },
    {
      name: 'Customer Contact Titles',
      description: 'Show distribution of contact titles',
      query: 'SELECT contactTitle, COUNT(*) as count FROM Customers GROUP BY contactTitle ORDER BY count DESC',
      results: (() => {
        const titleCounts = {};
      customerData.forEach(customer => {
        if (titleCounts[customer.contactTitle]) {
          titleCounts[customer.contactTitle]++;
        } else {
          titleCounts[customer.contactTitle] = 1;
        }
      });
      
      return Object.entries(titleCounts).map(([contactTitle, count]) => ({
        contactTitle,
        count
      })).sort((a, b) => b.count - a.count);
    })()
  },
  {
    name: 'German Customers',
    description: 'List all customers from Germany',
    query: 'SELECT customerID, companyName, city, phone FROM Customers WHERE country = \'Germany\'',
    results: customerData.filter(customer => customer.country === 'Germany')
      .map(({ customerID, companyName, city, phone }) => ({ 
        customerID, companyName, city, phone 
      }))
  },
  {
    name: 'Customers by Region',
    description: 'Count customers by region (non-null regions)',
    query: 'SELECT region, COUNT(*) as customer_count FROM Customers WHERE region IS NOT NULL GROUP BY region',
    results: (() => {
      const regionCounts = {};
      customerData.forEach(customer => {
        if (customer.region) {
          if (regionCounts[customer.region]) {
            regionCounts[customer.region]++;
          } else {
            regionCounts[customer.region] = 1;
          }
        }
      });
      
      return Object.entries(regionCounts).map(([region, count]) => ({
        region,
        customer_count: count
      }));
    })()
  }
];