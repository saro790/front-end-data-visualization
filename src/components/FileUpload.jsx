import React, { useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../styles/dashboard.css'; // உங்கள் CSS file import

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [chartData, setChartData] = useState([]); // Uploaded file data for chart

  const submit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMsg('Please choose a file');
      return;
    }

    const fd = new FormData();
    fd.append('file', file);

    try {
      // Upload file to backend
      const res = await axios.post(
        'https://back-end-data-visualization.onrender.com/api/upload-pdf/',
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setMsg('Uploaded successfully!');

      if (res.data && Array.isArray(res.data.chart_data)) {
        setChartData(res.data.chart_data);
      }

    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="upload-card">
      <h2 className="dashboard-header">Upload PDF / File & Visualize</h2>
      <form onSubmit={submit} className="file-upload-form">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input"
        />
        <button type="submit" className="dashboard-btn">Upload & Visualize</button>
      </form>

      {msg && <p className="upload-msg">{msg}</p>}

      {chartData.length > 0 && (
        <div className="charts-grid">
          <div className="card">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#0ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
