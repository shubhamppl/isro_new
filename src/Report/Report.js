import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, Scatter, ScatterChart, ZAxis, Radar, RadarChart,
  ComposedChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  FaSatellite, FaSignal, FaCheckCircle, FaExclamationTriangle,
  FaDownload, FaUpload, FaServer, FaGlobe, FaTemperatureHigh, FaSun
} from 'react-icons/fa';
import './Report.css';
 
const Report = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportTime] = useState(new Date().toLocaleString()); // Captures time once
  const [logoMenuOpen, setLogoMenuOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('day');
  const [selectedSatellite, setSelectedSatellite] = useState('communication');
 
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
   
    return () => {
      clearInterval(timer);
    };
  }, []);
 
  // Hardcoded data
  const performanceData = [
    { name: 'Sat-1', successful: 92, failed: 8 },
    { name: 'Sat-2', successful: 88, failed: 12 },
    { name: 'Sat-3', successful: 95, failed: 5 },
    { name: 'Sat-4', successful: 85, failed: 15 },
  ];
 
  const signalData = [
    { time: '00:00', snr: 85, bitErrorRate: 0.2, signalStrength: 90 },
    { time: '04:00', snr: 88, bitErrorRate: 0.15, signalStrength: 87 },
    { time: '08:00', snr: 92, bitErrorRate: 0.1, signalStrength: 93 },
    { time: '12:00', snr: 90, bitErrorRate: 0.18, signalStrength: 89 },
    { time: '16:00', snr: 95, bitErrorRate: 0.08, signalStrength: 92 },
    { time: '20:00', snr: 93, bitErrorRate: 0.12, signalStrength: 91 },
    { time: '23:59', snr: 89, bitErrorRate: 0.17, signalStrength: 88 }
  ];
 
  const usageData = [
    { name: 'Communication', value: 40 },
    { name: 'Navigation', value: 25 },
    { name: 'Earth Observation', value: 20 },
    { name: 'Research', value: 15 },
  ];
 
  const downlinkData = [
    { time: '00:00', Sat1: 120, Sat2: 105, Sat3: 95, Sat4: 110 },
    { time: '04:00', Sat1: 132, Sat2: 115, Sat3: 105, Sat4: 125 },
    { time: '08:00', Sat1: 125, Sat2: 125, Sat3: 110, Sat4: 118 },
    { time: '12:00', Sat1: 145, Sat2: 130, Sat3: 115, Sat4: 135 },
    { time: '16:00', Sat1: 150, Sat2: 135, Sat3: 120, Sat4: 140 },
    { time: '20:00', Sat1: 138, Sat2: 128, Sat3: 112, Sat4: 130 },
    { time: '23:59', Sat1: 128, Sat2: 118, Sat3: 100, Sat4: 120 },
  ];
 
  const antennaPerformanceData = [
    { name: 'Signal Quality', value: 90 },
    { name: 'Tracking Accuracy', value: 95 },
    { name: 'Interference Rejection', value: 85 },
    { name: 'Bandwidth', value: 80 },
    { name: 'Power Efficiency', value: 90 },
  ];
 
  const satelliteHealthData = [
    { name: 'Sat-1', battery: 85, temperature: 25, solar: 90, fuel: 65 },
    { name: 'Sat-2', battery: 80, temperature: 28, solar: 85, fuel: 55 },
    { name: 'Sat-3', battery: 95, temperature: 22, solar: 95, fuel: 75 },
    { name: 'Sat-4', battery: 75, temperature: 30, solar: 80, fuel: 40 },
  ];
 
  const equipmentStatusData = [
    { id: "E001", name: "Transponder A", status: "Online", uptime: 99.8, lastMaintenance: "2025-02-15" },
    { id: "E002", name: "Frequency Converter", status: "Online", uptime: 99.5, lastMaintenance: "2025-01-20" },
    { id: "E003", name: "Signal Analyzer", status: "Warning", uptime: 95.2, lastMaintenance: "2024-12-10" },
    { id: "E004", name: "Power Amplifier", status: "Online", uptime: 99.7, lastMaintenance: "2025-03-05" },
    { id: "E005", name: "Cooling System", status: "Offline", uptime: 85.3, lastMaintenance: "2025-01-30" },
  ];
 
  const alertsData = [
    { id: "A001", time: "08:45", satellite: "Sat-2", severity: "Warning", message: "Signal degradation detected" },
    { id: "A002", time: "11:20", satellite: "Sat-4", severity: "Critical", message: "Temperature exceeding normal range" },
    { id: "A003", time: "12:30", satellite: "Sat-1", severity: "Info", message: "Scheduled maintenance completed" },
    { id: "A004", time: "13:15", satellite: "Sat-3", severity: "Warning", message: "Battery level below 80%" },
  ];
 
  const latencyData = [
    { name: 'Satellite 1', latency: 240 },
    { name: 'Satellite 2', latency: 300 },
    { name: 'Satellite 3', latency: 190 },
    { name: 'Satellite 4', latency: 280 },
  ];
 
  const shiftDetailsData = [
    { id: "S001", operator: "John Doe",  shift: "Morning", status: "Active", hours: "06:00-14:00", tasks: 12 },
    { id: "S002", operator: "Jane Smith", shift: "Evening", status: "Active", hours: "14:00-22:00", tasks: 15 },
    { id: "S003", operator: "Mike Wilson", shift: "Night", status: "Completed", hours: "22:00-06:00", tasks: 10 },
    { id: "S004", operator: "Sarah Brown", shift: "Morning", status: "Pending", hours: "06:00-14:00", tasks: 8 },
    { id: "S005", operator: "Alex Johnson", shift: "Evening", status: "Active", hours: "14:00-22:00", tasks: 14 },
  ];
 
  const satellitePassData = [
    { id: "SAT001", aos: "08:30:00", los: "09:15:00", orbit: "LEO-1", passStatus: "Successful" },
    { id: "SAT002", aos: "10:45:00", los: "11:30:00", orbit: "LEO-2", passStatus: "Warning" },
    { id: "SAT003", aos: "12:15:00", los: "13:00:00", orbit: "MEO-1", passStatus: "Unsuccessful" },
    { id: "SAT004", aos: "14:30:00", los: "15:15:00", orbit: "LEO-3", passStatus: "Successful" },
    { id: "SAT005", aos: "16:45:00", los: "17:30:00", orbit: "LEO-1", passStatus: "Successful" },
  ];
 
  // Update the satellitePassesData to use Sat-1, Sat-2, etc.
  const satellitePassesData = [
    { name: 'Sat-1', successful: 25, warning: 8, unsuccessful: 4 },
    { name: 'Sat-2', successful: 32, warning: 12, unsuccessful: 6 },
    { name: 'Sat-3', successful: 18, warning: 5, unsuccessful: 3 },
    { name: 'Sat-4', successful: 28, warning: 10, unsuccessful: 5 },
  ];
 
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];
 
  const RECOVERY_COLORS = {
    g0Missed: '#FF6B6B',          // Soft red for missed
    g0Recovered: '#4ECDC4',       // Teal for recovered
    bl1Missed: '#FF9F89',         // Coral for BL-1 missed
    g2Recovered: '#45B7D1',       // Ocean blue for G2 recovered
    g0Incomplete: '#FFD93D',      // Warm yellow for incomplete
    g0Completed: '#95D5B2',       // Sage green for completed
    bl1Incomplete: '#FDB347',     // Orange for BL-1 incomplete
    g2Completed: '#98B6EC'        // Steel blue for G2 completed
  };
 
  const dataCaptureRedundancyData = [
    {
      satellite: 'Sat-1',
      missedAtG0: 6,
      capturedByBL1FromG0: 4,    // BL-1 recovered 4 of 6 missed by G0
      missedAtBL1: 2,
      capturedByG2FromBL1: 1,    // G2 recovered 1 of 2 missed by BL-1
      incompleteAtG0: 8,
      completedByBL1FromG0: 6,   // BL-1 completed 6 of 8 incomplete from G0
      incompleteAtBL1: 4,
      completedByG2FromBL1: 3    // G2 completed 3 of 4 incomplete from BL-1
    },
    {
      satellite: 'Sat-2',
      missedAtG0: 8,
      capturedByBL1FromG0: 6,
      missedAtBL1: 4,
      capturedByG2FromBL1: 3,
      incompleteAtG0: 10,
      completedByBL1FromG0: 7,
      incompleteAtBL1: 5,
      completedByG2FromBL1: 4
    },
    {
      satellite: 'Sat-3',
      missedAtG0: 3,
      capturedByBL1FromG0: 2,
      missedAtBL1: 2,
      capturedByG2FromBL1: 2,
      incompleteAtG0: 5,
      completedByBL1FromG0: 4,
      incompleteAtBL1: 3,
      completedByG2FromBL1: 2
    },
    {
      satellite: 'Sat-4',
      missedAtG0: 7,
      capturedByBL1FromG0: 5,
      missedAtBL1: 3,
      capturedByG2FromBL1: 2,
      incompleteAtG0: 9,
      completedByBL1FromG0: 7,
      incompleteAtBL1: 5,
      completedByG2FromBL1: 4
    }
  ];
 
  const timeInViewData = [
    {
      name: 'Sat-1',
      q1: 13,
      median: 15,
      q3: 17,
      min: 11,
      max: 19,
      outliers: [8, 21]
    },
    {
      name: 'Sat-2',
      q1: 14,
      median: 15,
      q3: 16,
      min: 12,
      max: 18,
      outliers: [9, 20]
    },
    {
      name: 'Sat-3',
      q1: 13.5,
      median: 15,
      q3: 16.5,
      min: 11.5,
      max: 18.5,
      outliers: [8.5, 20.5]
    },
    {
      name: 'Sat-4',
      q1: 14,
      median: 15,
      q3: 16,
      min: 12,
      max: 18,
      outliers: [9, 21]
    }
  ];
 
 
  const getStatusColor = (status) => {
    switch(status) {
      case 'Online': return '#00C49F';
      case 'Warning': return '#FFBB28';
      case 'Offline': return '#FF8042';
      default: return '#0088FE';
    }
  };
 
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return '#FF0000';
      case 'Warning': return '#FFBB28';
      case 'Info': return '#0088FE';
      default: return '#00C49F';
    }
  };
 
  const getPassStatusColor = (status) => {
    switch(status) {
      case 'Successful': return '#2E8B57';
      case 'Warning': return '#E6A700';
      case 'Unsuccessful': return '#D64545';
      default: return '#1E4B8E';
    }
  };
 
  const handleExportReport = () => {
    const reportData = {
      timestamp: currentTime.toISOString(),
      timeRange: selectedTimeRange,
      satelliteFilter: selectedSatellite,
      performanceMetrics: performanceData,
      signalMetrics: signalData,
      usageDistribution: usageData,
      downlinkData: downlinkData,
      antennaPerformance: antennaPerformanceData,
      satelliteHealth: satelliteHealthData,
      satellitePasses: satellitePassData,
      shiftDetails: shiftDetailsData,
      alerts: alertsData
    };
 
    // Create blob and download
    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `satellite-report-${currentTime.toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
 
  return (
    <div className="dashboard">
      <div className="header">
        <div className="header-left">
          <img src="logo.png" alt="Logo" className="logo" onClick={() => setLogoMenuOpen(!logoMenuOpen)} />
          {logoMenuOpen && (
            <div className="dropdown-menu1">
              <button onClick={() => navigate("/Local_view")}>Go to Local View</button>
             
            </div>
          )}
          <div className="button-group">
            <button className="button" onClick={() => navigate("/dashboard")}>Real-time Configuration</button>
            <button className="button" onClick={() => navigate("/Tracking")}>Simulation</button>
            <button className="button" onClick={() => navigate("/Simulation")}>Tracking</button>
            <button className="button active">Report</button>
            <button className="button" onClick={() => navigate("/LogsPage")}>Logs</button>
            <button className="button" onClick={() => navigate("/EditSatelliteSchedule")}>Schedule</button>
          </div>
        </div>
 
        <div className="title">Report</div>
       
        <div className="header-right">
        <span>{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}</span>
          <img src="/Image/user.jpg" alt="User" className="avatar" onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && (
            <div className="user-menu">
              <button onClick={() => navigate("/SignOutPage")}>Sign Out</button>
            </div>
          )}
        </div>
      </div>
 
 
      {/* Report Controls */}
      <div className="grids">
        <div className="filters">
          <div className="filter-group">
            <label>Time Range:</label>
            <select value={selectedTimeRange} onChange={(e) => setSelectedTimeRange(e.target.value)}>
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Satellite:</label>
            <select value={selectedSatellite} onChange={(e) => setSelectedSatellite(e.target.value)}>
              <option value="all">All Satellites</option>
              <option value="sat-1">Satellite 1</option>
              <option value="sat-2">Satellite 2</option>
              <option value="sat-3">Satellite 3</option>
              <option value="sat-4">Satellite 4</option>
            </select>
          </div>
          <button className="export-btn" onClick={handleExportReport}>
            <FaDownload /> Export Report
          </button>
        </div>
     
 
      {/* Summary Tabs */}
      <div className='summary-section'>
        <div className="summary-tab">
          <FaSatellite className="icon" />
          <h3>Active Satellites</h3>
          <div className="value">12</div>
          <div className="trend positive">+2 from last month</div>
        </div>
        <div className="summary-tab">
          <FaSignal className="icon" />
          <h3>Total Passes</h3>
          <div className="value">156</div>
          <div className="trend positive">+12 from last month</div>
        </div>
       
        <div className="summary-tab">
          <FaExclamationTriangle className="icon" />
          <h3>Alerts</h3>
          <div className="value">57</div>
          <div className="trend positive">-5 from last month</div>
        </div>
        <div className="summary-tab">
          <FaUpload className="icon" />
          <h3>Uplink Data</h3>
          <div className="value">1.2 TB</div>
          <div className="trend positive">+15% from last month</div>
        </div>
        <div className="summary-tab">
          <FaDownload className="icon" />
          <h3>Downlink Data</h3>
          <div className="value">3.8 TB</div>
          <div className="trend positive">+8% from last month</div>
        </div>
      </div>
      </div>
 
      <div className="section-title">
        <div className="mission-header">
          <h2>Mission Operations:</h2>
          <div className="filter-group">
            <select value={selectedSatellite} onChange={(e) => setSelectedSatellite(e.target.value)}>
              <option value="all">All Missions</option>
              <option value="communication">Communication</option>
              <option value="navigation">Navigation</option>
              <option value="observation">Earth Observation</option>
              <option value="research">Research</option>
            </select>
          </div>
        </div>
     
 
      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Satellite Pass Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={satellitePassesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="successful" stackId="a" fill="#00C49F" name="Successful" />
              <Bar dataKey="warning" stackId="a" fill="#FFBB28" name="Warning" />
              <Bar dataKey="unsuccessful" stackId="a" fill="#FF8042" name="Unsuccessful" />
            </BarChart>
          </ResponsiveContainer>
        </div>
 
         
        <div className="chart-card">
          <h3>Time in minute per Satellite</h3>
          <ResponsiveContainer width="69%" >
            <ComposedChart
              data={timeInViewData}
              margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
              barCategoryGap={50} // Add space between elements
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                scale="point"
                xAxisId={0}
                interval={0}
                padding={{ left: 50, right: 50 }} // Add padding to x-axis
              />
              <YAxis
                domain={[0, 25]}
                label={{ value: 'Minutes per Pass', angle: -90,  // Moves it inside but further left
    offset: -50, // Adjust to move further left
    style: { textAnchor: 'middle', fontSize: 14, fill: '#333' } // Improves readability
    }}
              />
              <Tooltip content={({ payload, label }) => {
                if (!payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}>
                    <p style={{margin: '5px 2px', fontWeight: 'lighter'}}>{label}</p>
                    <p style={{margin: '5px 0'}}>Median: {data.median} min</p>
                    <p style={{margin: '5px 0'}}>Q1-Q3: {data.q1}-{data.q3} min</p>
                    <p style={{margin: '5px 0'}}>Range: {data.min}-{data.max} min</p>
                  </div>
                );
              }} />
              <Legend />
             
              <Bar
                dataKey="q3"
                fill="#8B0000"
                name="q3"
                fillOpacity={1}
                stroke="#8B0000"
                strokeWidth={1}
              />
              <Bar
                dataKey="q1"
                fill="#A33D2D"
                fillOpacity={1}
                stroke="#A33D3D" /* Adjusted lighter red */
                strokeWidth={1}
                showLegend={false}
              />
              <Line
                type="monotone"
                dataKey="median"                
                stroke="#ff7300"
                strokeWidth={2}
                dot={{ fill: '#ff7300', radius: 4 }}
                name="Median"
              />
              <Line
                type="monotone"
                dataKey="max"
                stroke="#8884d8"
                strokeWidth={1}
                dot={false}
                name="Range"
              />
              <Line
                type="monotone"
                dataKey="min"
                stroke="#8884d8"
                strokeWidth={1}
                dot={false}
                showLegend={false}
              />
             
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        </div>
        </div>
 
 
      {/* Antenna Performance Section */}
      <div className="section-title">
        <h2>Shift & Pass Details</h2>
        <p>Overview of satellite tracking shifts and pass durations</p>
     
 
        <div className="charts-grid">
 
  {/* Antenna Performance (Kept Bar Chart but with better colors) */}
 
    <div className="chart-card">
          <h3>Satellite Pass Details</h3>
          <div className="table-container">
            <table className="shift-table">
              <thead>
                <tr>
                  <th>Satellite ID</th>
                  <th>AOS</th>
                  <th>LOS</th>
                  <th>Orbit</th>
                  <th>Operation Pass</th>
                </tr>
              </thead>
              <tbody>
                {satellitePassData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.aos}</td>
                    <td>{item.los}</td>
                    <td>{item.orbit}</td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: getPassStatusColor(item.passStatus) }}>
                        {item.passStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
 
        <div className="chart-card">
          <h3>Shift Details</h3>
          <div className="table-container">
            <table className="shift-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Operator</th>
                  <th>Shift</th>
                  <th>Hours</th>
                  <th>Status</th>
                  <th>Tasks</th>
                </tr>
              </thead>
              <tbody>
                {shiftDetailsData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.operator}</td>
                    <td>{item.shift}</td>
                    <td>{item.hours}</td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: getStatusColor(item.status) }}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.tasks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
 
      {/* Satellite Health Section */}
      <div className="section-title">
  <h2>Satellite Monitoring</h2>
  <p>Detailed metrics for all active satellites</p>
 
  <div className="charts-grid">
    <div className="charts-card">
      <h3>Satellite Health Metrics</h3>
      <ResponsiveContainer width="400%" height={350}>
        <LineChart data={satelliteHealthData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
         
          <Line
            type="monotone"
            dataKey="battery"
            stroke="#1E90FF" /* Dodger Blue for clarity */
            strokeWidth={2}
            dot={{ fill: '#1E90FF', r: 4 }}
            name="Battery %"
          />
         
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#D64545" /* Deep Red for contrast */
            strokeWidth={2}
            dot={{ fill: '#D64545', r: 4 }}
            name="Temperature (°C)"
          />
         
          <Line
            type="monotone"
            dataKey="solar"
            stroke="#E6A700" /* Muted Gold */
            strokeWidth={2}
            dot={{ fill: '#E6A700', r: 4 }}
            name="Solar Panel %"
          />
         
          <Line
            type="monotone"
            dataKey="fuel"
            stroke="#2E8B57" /* Deep Green */
            strokeWidth={2}
            dot={{ fill: '#2E8B57', r: 4 }}
            name="Fuel %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
 
    <div className="charts-card">
      <h3>Recent Alerts</h3>
      <div className="table-container">
        <table className="alerts-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Satellite</th>
              <th>Severity</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {alertsData.map((alert, index) => (
              <tr key={index}>
                <td>{alert.time}</td>
                <td>{alert.satellite}</td>
                <td>
                  <span className="severity-badge" style={{ backgroundColor: getSeverityColor(alert.severity) }}>
                    {alert.severity}
                  </span>
                </td>
                <td>{alert.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
   
    <div className="chartss-card">
      <h3>Ground Station Data Recovery Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataCaptureRedundancyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="satellite" />
          <YAxis />
          <Tooltip
            content={({ payload, label }) => {
              if (!payload || !payload.length) return null;
              const data = payload[0].payload;
             
              const g0MissedRecoveryRate = Math.round((data.capturedByBL1FromG0 / data.missedAtG0) * 100);
              const bl1MissedRecoveryRate = Math.round((data.capturedByG2FromBL1 / data.missedAtBL1) * 100);
              const g0IncompleteCompletionRate = Math.round((data.completedByBL1FromG0 / data.incompleteAtG0) * 100);
              const bl1IncompleteCompletionRate = Math.round((data.completedByG2FromBL1 / data.incompleteAtBL1) * 100);
             
              return (
                <div style={{
                  backgroundColor: 'white',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}>
                  <p style={{margin: '0', fontWeight: 'bold'}}>{label}</p>
                  <p>G0 Collections: {data.missedAtG0} → Recovered at BL-1: {data.capturedByBL1FromG0} ({g0MissedRecoveryRate}%)</p>
                  <p>BL-1 Collections: {data.missedAtBL1} → Recovered at G2: {data.capturedByG2FromBL1} ({bl1MissedRecoveryRate}%)</p>
                  <p>G0 Collections: {data.incompleteAtG0} → Completed at BL-1: {data.completedByBL1FromG0} ({g0IncompleteCompletionRate}%)</p>
                  <p>BL-1 Collections: {data.incompleteAtBL1} → Completed at G2: {data.completedByG2FromBL1} ({bl1IncompleteCompletionRate}%)</p>
                </div>
              );
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
          <Bar
            dataKey="missedAtG0"
            stackId="g0missed"
            fill={RECOVERY_COLORS.g0Missed}
            name="G0: Missing Data"
          />
          <Bar
            dataKey="capturedByBL1FromG0"
            stackId="g0recovery"
            fill={RECOVERY_COLORS.g0Recovered}
            name="→ BL-1: Recovered G0"
          />
          <Bar
            dataKey="missedAtBL1"
            stackId="bl1missed"
            fill={RECOVERY_COLORS.bl1Missed}
            name="BL-1: Missing Data"
          />
          <Bar
            dataKey="capturedByG2FromBL1"
            stackId="bl1recovery"
            fill={RECOVERY_COLORS.g2Recovered}
            name="→ G2: Recovered BL-1"
          />
          <Bar
            dataKey="incompleteAtG0"
            stackId="g0incomplete"
            fill={RECOVERY_COLORS.g0Incomplete}
            name="G0: Partial Data"
          />
          <Bar
            dataKey="completedByBL1FromG0"
            stackId="g0completion"
            fill={RECOVERY_COLORS.g0Completed}
            name="→ BL-1: Completed G0"
          />
          <Bar
            dataKey="incompleteAtBL1"
            stackId="bl1incomplete"
            fill={RECOVERY_COLORS.bl1Incomplete}
            name="BL-1: Partial Data"
          />
          <Bar
            dataKey="completedByG2FromBL1"
            stackId="g2completion"
            fill={RECOVERY_COLORS.g2Completed}
            name="→ G2: Completed BL-1"
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="data-recovery-summary" style={{
        marginTop: '20px',
        padding: '0',  // Remove padding from container
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        maxHeight: '300px',
        overflow: 'hidden',  // Changed from auto to hidden
        position: 'relative'
      }}>
        <div style={{
          padding: '15px',
          marginBottom: '10px',
          backgroundColor: '#f8f9fa',
          position: 'sticky',
          top: 0,
          zIndex: 2,
          borderBottom: '2px solid #e9ecef'
        }}>
          <h4 style={{
            margin: 0,
            color: '#2c3e50',
          }}>Recovery Summary</h4>
        </div>
        <div style={{
          padding: '0 15px 15px 15px',
          height: 'calc(100% - 50px)',  // Subtract header height
          overflowY: 'auto'  // Enable scrolling for content
        }}>
          {dataCaptureRedundancyData.map((item) => {
            const g0MissedRecoveryRate = Math.round((item.capturedByBL1FromG0 / item.missedAtG0) * 100);
            const bl1MissedRecoveryRate = Math.round((item.capturedByG2FromBL1 / item.missedAtBL1) * 100);
            const g0IncompleteCompletionRate = Math.round((item.completedByBL1FromG0 / item.incompleteAtG0) * 100);
            const bl1IncompleteCompletionRate = Math.round((item.completedByG2FromBL1 / item.incompleteAtBL1) * 100);
           
            return (
              <div key={item.satellite} style={{
                margin: '12px 0',
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <h5 style={{
                  margin: '0 0 15px 0',
                  color: '#2c3e50',
                  fontSize: '1.1em',
                  borderBottom: '1px solid #eee',
                  paddingBottom: '8px'
                }}>{item.satellite}</h5>
                <div style={{ display: 'flex', gap: '30px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: '0 0 12px 0',
                      fontSize: '0.95em',
                      color: '#34495e',
                      fontWeight: '500'
                    }}>
                      <strong style={{ color: RECOVERY_COLORS.g0Missed }}>G0 Collections</strong>
                    </p>
                    <div style={{ paddingLeft: '12px' }}>
                      <p style={{
                        margin: '8px 0',
                        fontSize: '0.9em',
                        color: '#34495e',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <span>• Recovered at BL-1:</span>
                        <span>{item.capturedByBL1FromG0}/{item.missedAtG0} ({g0MissedRecoveryRate}%)</span>
                      </p>
                      <p style={{
                        margin: '8px 0',
                        fontSize: '0.9em',
                        color: '#34495e',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <span>• Completed at BL-1:</span>
                        <span>{item.completedByBL1FromG0}/{item.incompleteAtG0} ({g0IncompleteCompletionRate}%)</span>
                      </p>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: '0 0 12px 0',
                      fontSize: '0.95em',
                      color: '#34495e',
                      fontWeight: '500'
                    }}>
                      <strong style={{ color: RECOVERY_COLORS.bl1Missed }}>BL-1 Collections</strong>
                    </p>
                    <div style={{ paddingLeft: '12px' }}>
                      <p style={{
                        margin: '8px 0',
                        fontSize: '0.9em',
                        color: '#34495e',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <span>• Recovered at G2:</span>
                        <span>{item.capturedByG2FromBL1}/{item.missedAtBL1} ({bl1MissedRecoveryRate}%)</span>
                      </p>
                      <p style={{
                        margin: '8px 0',
                        fontSize: '0.9em',
                        color: '#34495e',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <span>• Completed at G2:</span>
                        <span>{item.completedByG2FromBL1}/{item.incompleteAtBL1} ({bl1IncompleteCompletionRate}%)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
</div>
      {/* Report Footer */}
      <div className="report-footer">
        <div className="footer-actions">
          <button className="footer-btn"><FaDownload /> Download PDF</button>
          <button className="footer-btn"><FaServer /> Save to Archive</button>
          <button className="footer-btn"><FaGlobe /> Share Report</button>
        </div>
        <div className="footer-info">
        <p><strong>Report Generated:</strong> {reportTime}</p>
          <p><strong>Time Period:</strong> {selectedTimeRange === 'day' ? 'Last 24 Hours' :
                                          selectedTimeRange === 'week' ? 'Last Week' :
                                          selectedTimeRange === 'month' ? 'Last Month' : 'Last Quarter'}</p>
        </div>
      </div>
    </div>
  );
};
 
export default Report;
 