import React, { useState, useEffect } from "react"
import './Logs.css';
import { useNavigate } from "react-router-dom";
 
const LogsPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoMenuOpen, setLogoMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data from API...");
        const response = await fetch("http://127.0.0.1:5000/api/logs");
        if (!response.ok) throw new Error("Failed to fetch data");
 
        const result = await response.json();
        console.log("API Response:", result);
 
        if (!Array.isArray(result)) {
          throw new Error("API response is not an array");
        }
 
        // Map API keys to expected keys
        const mappedData = result.map((item) => ({
          logID: item.Log_ID,
          timestamp: item.Timestamp,
          equipment: item.Equipment,
          health: item.Equipment_Health,
          action: item.Activity_Action,
          status: item.Status,
          remarks: item.Comments_Remarks,
        }));
 
        console.log("Mapped Data:", mappedData);
 
        setData(mappedData);
        setFilteredData(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
  }, []);
 
  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
 
  const metrics = [
    { label: "Average Packet Lost Rate", value: "0.5%" },
    { label: "Average Latency", value: "476 ms" },
    { label: "Alerts", value: "67" },
    { label: "Current Antenna Active Status", value: "48/65" },
    { label: "Errors Logged", value: "554" },
    { label: "Average Uptime", value: "92%" },
  ];
 
  return (
    <div className="dashboard">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <img
            src="logo.png"
            alt="ISRO Logo"
            className="logo"
            onClick={() => setLogoMenuOpen(!logoMenuOpen)}
          />
          {logoMenuOpen && (
            <div className="dropdown-menu1">
              <button onClick={() => navigate("/Local_view")}>Go to Local View</button>
            </div>
          )}
          <div className="button-group">
            <button onClick={() => navigate("/dashboard")} className="button">Real-time Configuration</button>
            <button className="button" tabIndex={0} onClick={() => navigate("/Tracking")}>Tracking</button>
            <button className="button" tabIndex={0} onClick={() => navigate("/Simulation")}>Tracking and Simulation</button>
            <button onClick={() => navigate("/report")} className="button">Report</button>
            <button onClick={() => navigate("/LogsPage")} className="button active">Logs</button>
            <button onClick={() => navigate("/EditSatelliteSchedule")} className="button">Schedule</button>
          </div>
        </div>
        <div className="title">Logs</div>
        <div className="header-right">
          <span>{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit',timeZoneName: 'short' })}</span>
 
          <div className="user-menu-wrapper">
            <img
              src="/Image/user.jpg"
              alt="User Avatar"
              className="avatar"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/SignOutPage")}>Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </div>
 
      {/* Content */}
      <div className="container">
        <div className="table-container1">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Timestamp</th>
                  <th>Equipment</th>
                  <th>Equipment Health (%)</th>
                  <th>Activity/Action</th>
                  <th>Status</th>
                  <th>Comments/Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.logID}</td>
                      <td>{row.timestamp}</td>
                      <td>{row.equipment}</td>
                      <td>{row.health}</td>
                      <td>{row.action}</td>
                      <td>{row.status}</td>
                      <td>{row.remarks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="metrics-container">
          {metrics.map((metric, index) => (
            <div className="metric" key={index}>
              <strong>{metric.label} </strong> {metric.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default LogsPage;