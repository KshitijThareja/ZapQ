import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DataVisualization = () => {
  const [chartType, setChartType] = useState('bar');
  
  // Sample data for visualizations based on our customer dataset
  const countryData = useMemo(() => [
    { name: 'USA', value: 34 },
    { name: 'Germany', value: 21 },
    { name: 'UK', value: 18 },
    { name: 'France', value: 15 },
    { name: 'Canada', value: 12 },
    { name: 'Spain', value: 10 },
    { name: 'Italy', value: 9 },
    { name: 'Japan', value: 8 },
    { name: 'China', value: 7 },
    { name: 'Australia', value: 6 }
  ], []);
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Customer Distribution</h2>
        <div className="space-x-2">
          <button 
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 text-sm border rounded-md ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'border-gray-300'}`}
          >
            Bar Chart
          </button>
          <button 
            onClick={() => setChartType('pie')}
            className={`px-3 py-1 text-sm border rounded-md ${chartType === 'pie' ? 'bg-blue-500 text-white' : 'border-gray-300'}`}
          >
            Pie Chart
          </button>
        </div>
      </div>
      
      <div className="h-64">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={countryData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#1a73e8" name="Customers" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={countryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {countryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DataVisualization;