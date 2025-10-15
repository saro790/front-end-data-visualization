import React, { useState, useMemo, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer
} from "recharts";
import "../styles/Dashboard.css";

const COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171"];

function parseCSV(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 1) return [];
  const header = lines[0].split(",").map(h => h.trim().toLowerCase());
  return lines.slice(1).map(line => {
    const cols = line.split(",");
    const obj = {};
    header.forEach((h,i)=> obj[h]=cols[i]||"");
    return {
      name: obj.name||"Unknown",
      type: (obj.type||"student").toLowerCase(),
      date: obj.date || new Date().toISOString().slice(0,10),
      value: Number(obj.value||0)
    };
  });
}

export default function Dashboard({ data, setData, setFilteredData }) {
  const [selectedTypes, setSelectedTypes] = useState(["student","staff","employee"]);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);

  // Filtered Data
  const filtered = useMemo(() => data.filter(d => selectedTypes.includes(d.type)), [data, selectedTypes]);

  // Update filteredData for AdvancedDashboard export
  useEffect(() => {
    setFilteredData(filtered);
  }, [filtered, setFilteredData]);

  // Charts
  const pieData = useMemo(() => {
    const map = {};
    filtered.forEach(d => map[d.type] = (map[d.type]||0)+1);
    return Object.entries(map).map(([name,value])=>({name,value}));
  }, [filtered]);

  const lineData = useMemo(() => {
    const map = {};
    filtered.forEach(d => map[d.date] = (map[d.date]||0)+1);
    return Object.keys(map).sort().map(date=>({date,count:map[date]}));
  }, [filtered]);

  const barData = pieData;
  const radarData = pieData.map(d => ({subject:d.name,A:d.value}));

  // Filter toggle
  const toggleType = (t) => setSelectedTypes(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev,t]);
  const resetFilters = () => setSelectedTypes(["student","staff","employee"]);

  // File Upload
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    setStatus("parsing"); setProgress(0);
    try {
      let parsed = [];
      const text = await file.text();
      parsed = file.name.endsWith(".json") ? JSON.parse(text) : parseCSV(text);

      for(let i=1;i<=5;i++){
        await new Promise(r=>setTimeout(r,100));
        setProgress(i*20);
      }

      setData(prev => [...parsed, ...prev]);
      setStatus("done"); setProgress(100);
    } catch(err){
      console.error(err);
      setStatus("error"); setProgress(0);
    }
  };

  return (
    <div className="dashboard-container">
      <header><h1>Upload CSV/JSON & Visualize</h1></header>

      <div className="card upload-card">
        <input type="file" accept=".csv,.json" onChange={handleFile} />
        <div className="progress-bar"><div style={{width:`${progress}%`}}></div></div>
        <p>Status: {status}</p>
      </div>  <br/>

      <div className="filters">
        {["student","staff","employee"].map(t=>(
          <button key={t} onClick={()=>toggleType(t)} className={selectedTypes.includes(t)?"active":""}>{t}</button>
        ))}
        <button onClick={resetFilters}>Reset</button>
      </div><br/>

      <div className="cards-summary">
        <div>Total: {filtered.length}</div><br/>
        <div>Students: {filtered.filter(x=>x.type==="student").length}</div><br/>
        <div>Staff: {filtered.filter(x=>x.type==="staff").length}</div><br/>
        <div>Employees: {filtered.filter(x=>x.type==="employee").length}</div><br/>
      </div>

      <div className="charts-grid">
        <div className="card">
          <h4>Trend by Date</h4>
          <div style={{height:300}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="date"/>
                <YAxis/>
                <ReTooltip/>
                <Legend/>
                <Line type="monotone" dataKey="count" stroke="#60A5FA" strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h4>By Category (Pie)</h4>
          <div style={{height:300}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {pieData.map((entry,index)=><Cell key={index} fill={COLORS[index%COLORS.length]}/>)}
                </Pie>
                <ReTooltip/>
                <Legend/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h4>By Category (Bar)</h4>
          <div style={{height:300}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <ReTooltip/>
                <Legend/>
                <Bar dataKey="value" fill="#34D399"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h4>By Category (Radar)</h4>
          <div style={{height:300}}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid/>
                <PolarAngleAxis dataKey="subject"/>
                <PolarRadiusAxis/>
                <Radar name="Count" dataKey="A" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.5}/>
                <ReTooltip/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
