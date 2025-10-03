import React from 'react';
import * as XLSX from 'xlsx';

export default function AdvancedDashboard({ data }) {
  const exportToExcel = () => {
    if (!data || data.length === 0) return alert("No data to export");

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FilteredData');
    XLSX.writeFile(workbook, 'FilteredData.xlsx');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Export Filtered Data</h2>
      <button className="advanced-export-btn" onClick={exportToExcel}>
        Export Excel
      </button>
    </div>
  );
}
