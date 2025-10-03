import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import AdvancedDashboard from './components/AdvancedDashboard';

export default function App() {
  const [data, setData] = useState([]); // Uploaded raw data
  const [filteredData, setFilteredData] = useState([]); // Filtered data for charts/export

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h1>People Data Viz</h1>
      
      <Dashboard 
        data={data} 
        setData={setData} 
        setFilteredData={setFilteredData} 
      />

      <hr />

      <AdvancedDashboard data={filteredData} />
    </div>
  );
}
