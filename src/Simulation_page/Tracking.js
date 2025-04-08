import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Tracking.css";

const Tracking = () => {
  const navigate = useNavigate();
  const [logoMenuOpen, setLogoMenuOpen] = useState(false);

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
            <div className="dropdown-menuls">
              <button onClick={() => navigate("/Local_view")}>Go to Local View</button>
            </div>
          )}

          <div className="button-group">
            <button onClick={() => navigate("/dashboard")} className="button">Real-time Configuration</button>
            <button className="button active" tabIndex={0} onClick={() => navigate("/Tracking")}>Tracking</button>
            <button className="button" tabIndex={0} onClick={() => navigate("/Simulation")}>Tracking and Simulation</button>
            <button className="button" tabIndex={0} onClick={() => navigate("/Report")}>Report</button>
            <button className="button" tabIndex={0} onClick={() => navigate("/LogsPage")}>Logs</button>
            <button className="button" tabIndex={0} onClick={() => navigate("/EditSatelliteSchedule")}>Schedule</button>
          </div>
        </div>
      </div>

      {/* Existing Work in Progress content */}
      <div className="wip-container">
        <motion.div
          className="loader"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
        <p className="wip-text">Work in Progress...</p>
      </div>
    </div>
  );
};

export default Tracking;