import { predefinedQueries, customerData } from "@/data/predefinedQueries";

export function processQuery(query) {
    // This is a mock implementation as per the requirements
    // We don't actually process the SQL, but return predefined results
    
    // Normalize the query by removing extra whitespace
    const normalizedQuery = query.trim().replace(/\s+/g, ' ').toLowerCase();
    
    // Try to match the query with our predefined ones
    const matchedQuery = predefinedQueries.find(pq => 
      pq.query.toLowerCase().replace(/\s+/g, ' ') === normalizedQuery
    );
    
    if (matchedQuery) {
      return matchedQuery.results;
    }
    
    // If no exact match, try to determine the type of query and generate appropriate results
    if (normalizedQuery.includes('select') && normalizedQuery.includes('from customers')) {
      // Basic query against customers table
      if (normalizedQuery.includes('where')) {
        // Some kind of filtering - return a subset
        return customerData.slice(0, 20);
      } else {
        // No filtering - return all customers
        return customerData;
      }
    }
    
    // For any other query, return a sample set of data
    return customerData.slice(0, 30);
  }