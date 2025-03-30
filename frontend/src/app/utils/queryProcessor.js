import { predefinedQueries, customerData } from "@/data/predefinedQueries";

export function processQuery(query) {
    const normalizedQuery = query.trim().replace(/\s+/g, ' ').toLowerCase();
    
    const matchedQuery = predefinedQueries.find(pq => 
      pq.query.toLowerCase().replace(/\s+/g, ' ') === normalizedQuery
    );
    
    if (matchedQuery) {
      return matchedQuery.results;
    }
    
    if (normalizedQuery.includes('select') && normalizedQuery.includes('from customers')) {
      if (normalizedQuery.includes('where')) {
        return customerData.slice(0, 20);
      } else {
        return customerData;
      }
    }
    
    return customerData.slice(0, 30);
  }