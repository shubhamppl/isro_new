import React, { useState, useEffect } from 'react';
import './Dashboard.css';

import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import SatelliteMapViewDashboard from '../Dashboard/SatelliteMapViewDashboard';
import EquipmentManagement from './EquipmentManagement'; // Adjust the path as needed
import SessionPage from './SessionPage'; // Add this import
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'; // Add these imports
 
// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
 
const Dashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoMenuOpen, setLogoMenuOpen] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showTriggerSessionForm, setShowTriggerSessionForm] = useState(false);
  const [showDesignForm, setDesignForm] = useState(false); // Corrected state for Design Form
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionToReview, setSessionToReview] = useState(null);
  const [showExpandedMap, setShowExpandedMap] = useState(null); // 'current' or 'next' or null
  const [showEquipmentModal, setShowEquipmentModal] = useState(false); // New state for Equipment/Satellite Management modal
  const [isUplinkEnabled, setIsUplinkEnabled] = useState(false);
  const [isDownlinkEnabled, setIsDownlinkEnabled] = useState(false);
  const [isSweepEnabled, setIsSweepEnabled] = useState(false);
  const [isRangeEnabled, setIsRangeEnabled] = useState(false);
  const [nextIsUplinkEnabled, setNextIsUplinkEnabled] = useState(false);
  const [nextIsDownlinkEnabled, setNextIsDownlinkEnabled] = useState(false);
  const [nextIsSweepEnabled, setNextIsSweepEnabled] = useState(false);
  const [nextIsRangeEnabled, setNextIsRangeEnabled] = useState(false);
  const [showDetailedHealth, setShowDetailedHealth] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
 
  const handleSignOut = () => {
    navigate("/SignupPage");
  };
 
  const alerts = [
    {
      category: 'Signal',
      equipment: 'Antenna A1',
      reason: 'Signal interference detected',
      status: 'Resolved',
      timestamp: '2025-03-05 14:32:10'
    },
    {
      category: 'Power',
      equipment: 'Power Supply Unit 2',
      reason: 'Power fluctuation in equipment',
      status: 'Unresolved',
      timestamp: '2025-03-05 14:30:45'
    },
    {
      category: 'Mechanical',
      equipment: 'Antenna Mount M3',
      reason: 'Mechanical tilt misalignment',
      status: 'Resolved',
      timestamp: '2025-03-05 14:28:22'
    },
    {
      category: 'Communication',
      equipment: 'Transceiver T1',
      reason: 'Loss of communication with satellite',
      status: 'Unresolved',
      timestamp: '2025-03-05 14:25:15'
    },
    {
      category: 'Temperature',
      equipment: 'Transceiver T2',
      reason: 'High temperature in transceiver',
      status: 'Resolved',
      timestamp: '2025-03-05 14:22:55'
    },
    {
      category: 'Mechanical',
      equipment: 'Antenna A2',
      reason: 'Antenna positioning error',
      status: 'Unresolved',
      timestamp: '2025-03-05 14:20:30'
    }
  ];
 
  const equipmentStatus = {
    success: ['Equip 2', 'Equip 3', 'Equip 5'],
    failed: ['Equip 5'],
    progress: ['Equip 5', 'Equip 11'],
    inactive: [
      { name: 'Equip 3', start: '08:00:00', end: '08:15:00' },
      { name: 'Equip 8', start: '08:15:00', end: '08:30:00' },
      { name: 'Equip 1', start: '08:30:00', end: '08:45:00' },
      { name: 'Equip 31', start: '08:45:00', end: '09:00:00' },
      { name: 'Equip 21', start: '09:00:00', end: '09:15:00' },
      { name: 'Equip 9', start: '09:15:00', end: '09:30:00' },
      { name: 'Equip 31', start: '09:30:00', end: '09:45:00' },
      { name: 'Equip 45', start: '09:45:00', end: '10:00:00' },
      { name: 'Equip 65', start: '10:00:00', end: '10:15:00' },
      { name: 'Equip 42', start: '10:15:00', end: '10:30:00' },
      { name: 'Equip 76', start: '10:30:00', end: '10:45:00' },
      { name: 'Equip 61', start: '10:45:00', end: '11:00:00' },
      { name: 'Equip 78', start: '11:00:00', end: '11:15:00' },
      { name: 'Equip 79', start: '11:15:00', end: '11:30:00' },
      { name: 'Equip 80', start: '11:30:00', end: '11:45:00' }
    ]
  };
 
  const satelliteInfo = {
    current: {
      pass: 'Sat12334',
      orbit: '2233',
      aos: '12:02:22',
      los: '12:34:12',
    },
    next: {
      pass: 'Sat12304',
      orbit: '445',
      aos: '12:39:22',
      los: '13:14:12',
    }
  };
 
  const satellitePositions = {
    current: { lat: 28.6139, lng: 77.2090 }, // Example for current position
    next: { lat: 19.0760, lng: 72.8777 }     // Example for next position
  };
 
  const equipmentTableData = [
    { name: 'Antenna E24', status: 'Successful', startTime: '14:52:22', endTime: '16:49:22' },
    { name: 'Transmitter T12', status: 'Failed', startTime: '12:45:22', endTime: '19:49:22' },
    { name: 'Receiver R08', status: 'Pending', startTime: '14:52:22', endTime: '16:49:22' },
    { name: 'Signal Processor SP4', status: 'Progress', startTime: '14:42:22', endTime: '19:49:22' },
    { name: 'Frequency Controller FC2', status: 'Successful', startTime: '14:52:22', endTime: '19:49:22' },
    { name: 'Power Amplifier PA1', status: 'Progress', startTime: '14:55:22', endTime: '19:49:22' },
    { name: 'Tracking System TS3', status: 'Pending', startTime: '14:52:22', endTime: '16:49:22' },
  ];
 
  const handleSessionFormSubmit = (data) => {
    console.log('Session form submitted:', data);
    setSessionToReview(data);
    setShowSessionForm(false);
  };
 
  const ExpandedMapModal = ({ position, title, satellitePass, onClose, isCurrentPass }) => (
    <div className="satellite-map-modal-overlay" onClick={onClose}>
      <div className="satellite-map-modal" onClick={e => e.stopPropagation()}>
        <button className="satellite-map-close" onClick={onClose}>×</button>
        <h2>{title}</h2>
        <div className="map-container-fullscreen">
          <SatelliteMapViewDashboard
            position={position}
            isCurrentPass={isCurrentPass}
            onRangeUpdate={(updates) => {
              console.log('Range updates:', updates);
            }}
          />
        </div>
      </div>
    </div>
  );
 
  const EquipmentManagementModal = ({ onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Equipment/Satellite Management</h2>
        <div className="modal-body">
          <EquipmentManagement />
        </div>
      </div>
    </div>
  );
 
  const SessionPageModal = ({ onClose, onEdit }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Manage Session</h2>
        <div className="modal-body">
          <SessionPage/>
        </div>
      </div>
    </div>
  );
 
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
 
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
 
  const equipmentOverviewData = [
    { name: 'Online', value: 75, color: '#50C878', count: 15 },  // Green
    { name: 'Error', value: 15, color: '#FF6B6B', count: 3 },   // Red
    { name: 'Offline', value: 10, color: '#808080', count: 2 }  // Changed from #4169E1 (blue) to #808080 (grey)
  ];

  const getHealthMetrics = (equipment) => {
    const metrics = {
      successful: {
        'RF Power': '96%',
        'Signal Strength': '98%',
        'Temperature': '92%',
        'Operational Status': '97%'
      },
      progress: {
        'RF Power': '78%',
        'Signal Strength': '82%',
        'Temperature': '85%',
        'Operational Status': '80%'
      },
      failed: {
        'RF Power': '45%',
        'Signal Strength': '30%',
        'Temperature': '88%',
        'Operational Status': '20%'
      },
      pending: {
        'RF Power': '70%',
        'Signal Strength': '75%',
        'Temperature': '90%',
        'Operational Status': '65%'
      }
    };
    return metrics[equipment.status.toLowerCase()] || metrics.pending;
  };

  const getDetailedHealthMetrics = (equipment) => {
    // Detailed metrics based on equipment status
    const metrics = {
      successful: {
        'System Health': '95%',
        'Performance': '98%',
        'Reliability': '93%',
        'Signal Quality': '97%',
        'Power Efficiency': '94%'
      },
      progress: {
        'System Health': '75%',
        'Performance': '80%',
        'Reliability': '72%',
        'Signal Quality': '78%',
        'Power Efficiency': '82%'
      },
      failed: {
        'System Health': '60%',
        'Performance': '55%',
        'Reliability': '45%',
        'Signal Quality': '40%',
        'Power Efficiency': '50%'
      },
      pending: {
        'System Health': '70%',
        'Performance': '65%',
        'Reliability': '75%',
        'Signal Quality': '68%',
        'Power Efficiency': '72%'
      }
    };
    return metrics[equipment.status.toLowerCase()] || metrics.pending;
  };

  const DetailedHealthModal = ({ equipment, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content detailed-health-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{equipment.name} - Detailed Health Status</h2>
        <div className="detailed-health-metrics">
          {Object.entries(getDetailedHealthMetrics(equipment)).map(([metric, value], index) => (
            <div key={index} className="detailed-metric">
              <div className="metric-header">
                <span className="metric-name">{metric}</span>
                <span className="metric-value">{value}</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-fill"
                  style={{
                    width: value,
                    backgroundColor: parseInt(value) > 90 ? '#50C878' : 
                                   parseInt(value) > 70 ? '#FFA500' : '#FF6B6B'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
            <div className="dropdown-menu">
              <button onClick={() => navigate("/Local_view")}>Go to Local View</button>
            </div>
          )}
 
          <div className="button-group">
            <button className="button active" tabIndex={0} onClick={() => navigate('/Dashboard')}>Real-time Configuration</button>
            <button className="button" tabIndex={0} onClick={() => navigate("/Tracking")}>Tracking</button>
            <button className="button" tabIndex={0} onClick={() => navigate("/Simulation")}>Tracking and Simulation</button>
            <button className="button" tabIndex={0} onClick={() => navigate("/Report")}>Report</button>
            <button className="button" tabIndex={0} onClick={() => navigate("/LogsPage")}>Logs</button>
            <button className="button" tabIndex={0} onClick={() => navigate("/EditSatelliteSchedule")}>Schedule</button>
          </div>
        </div>
        <div className="title">Equipment Status & Configuration</div>
        <div className="header-right">
          <div className="button-group">
            <button className="button" onClick={() => setShowEquipmentModal(true)}>
              Equipment/ Satellite Management
            </button>
            <button className="button" onClick={() => { console.log("Manage Session clicked"); setShowSessionModal(true); }}>
              Manage Session
            </button>
          </div>
        </div>
 
        {/* Move this outside the header-right div */}
        <div className={`dashboard-content ${showSessionModal || showEquipmentModal ? "blurred" : ""}`}>
          {showEquipmentModal && (
            <EquipmentManagementModal
              onClose={() => setShowEquipmentModal(false)}
            />
          )}
          {showSessionModal && (
            <SessionPageModal
              onClose={() => setShowSessionModal(false)}            
            />
          )}
        </div>
       
        <span>{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}</span>
 
        <img
          src="/Image/user.jpg"
          alt="User"
          className="avatar"
          onClick={() => setMenuOpen(!menuOpen)}
        />
        {menuOpen && (
          <div className="dropdown-menu">
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        )}
      </div>
 
      {/* Info Banner */}
      <div className="info-banner">
        <div className="info-banner-group">
          {/* Mission Related */}
          <div className="info-banner-section">
            <i className="fas fa-rocket section-icon"></i>
            <div className="info-content">
              <span className="info-label">Mission</span>
              <span className="info-value highlight-primary">Communication</span>
            </div>
          </div>
          <div className="info-banner-divider">|</div>
          <div className="info-banner-section">
            <i className="fas fa-clock section-icon"></i>
            <div className="info-content">
              <span className="info-label">Mission Time</span>
              <span className="info-value highlight-timer">T+ 17:45:00</span>
            </div>
          </div>
          <div className="info-banner-divider">|</div>
 
          {/* Ground Station & Antenna */}
          <div className="info-banner-section">
            <i className="fas fa-broadcast-tower section-icon"></i>
            <div className="info-content">
              <span className="info-label">Ground Station</span>
              <span className="info-value highlight-station">BGL-01</span>
            </div>
          </div>
          <div className="info-banner-divider">|</div>
          <div className="info-banner-section">
            <i className="fas fa-satellite-dish section-icon"></i>
            <div className="info-content">
              <span className="info-label">Antenna</span>
              <span className="info-value highlight-antenna">ANT-1</span>
            </div>
          </div>
          <div className="info-banner-divider">|</div>
 
          {/* Satellite Info */}
          <div className="info-banner-section">
            <i className="fas fa-satellite section-icon"></i>
            <div className="info-content">
              <span className="info-label">Pass time</span>
              <span className="info-value highlight-satellite">15 min</span>
            </div>
          </div>
          <div className="info-banner-divider">|</div>
 
          {/* Other parameters with icons */}
          <div className="info-banner-section">
            <i className="fas fa-broadcast-tower section-icon"></i>
            <div className="info-content">
              <span className="info-label">Frequency</span>
              <span className="info-value">2250.5 MHz</span>
            </div>
          </div>
          <div className="info-banner-divider">|</div>
          <div className="info-banner-section">
            <i className="fas fa-signal section-icon"></i>
            <div className="info-content">
              <span className="info-label">Signal</span>
              <span className="info-value">-65.8 dBm</span>
            </div>
          </div>
          <div className="info-banner-divider">|</div>
          <div className="info-banner-section">
            <i className="fas fa-compass section-icon"></i>
            <div className="info-content">
              <span className="info-label">AZ/EL</span>
              <span className="info-value">145.32°/68.5°</span>
            </div>
          </div>
          <div className="info-banner-divider">|</div>
          <div className="info-banner-section">
            <i className="fas fa-cloud-sun section-icon"></i>
            <div className="info-content">
              <span className="info-label">Weather</span>
              <span className="info-value">Clear Sky</span>
            </div>
          </div>
          <div className="info-banner-divider">|</div>
          <div className="info-banner-section">
            <i className="fas fa-wind section-icon"></i>
            <div className="info-content">
              <span className="info-label">Wind</span>
              <span className="info-value">12 km/h NE</span>
            </div>
          </div>
        </div>
      </div>
 
      {/* Main Content Grid */}
      <div className="grid">
        {/* Charts Section */}
        <div className="charts-section">
          {/* Current Satellite Info Card */}
          <div className="card satellite-card">
            <div className="satellite-container">
              <div className="satellite-section info-section">
                <h2>Current Satellite Info</h2>
                <div className="toggles-container">
                  <div className="toggle-group">
                    <span>Uplink</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={isUplinkEnabled}
                        onChange={() => setIsUplinkEnabled(!isUplinkEnabled)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="toggle-group">
                    <span>Downlink</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={isDownlinkEnabled}
                        onChange={() => setIsDownlinkEnabled(!isDownlinkEnabled)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="toggle-group">
                    <span>Sweep</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={isSweepEnabled}
                        onChange={() => setIsSweepEnabled(!isSweepEnabled)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="toggle-group">
                    <span>Range</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={isRangeEnabled}
                        onChange={() => setIsRangeEnabled(!isRangeEnabled)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
                <div className="pass-sections horizontal-layout">
                  {/* Left Title */}
                 
                 
                  {/* Center Details */}
                  <div className="pass-row-container center-details">
                    <div className="pass-block">
                      <div className="pass-details">
                        <div className="pass-info horizontal">
                          <div className="info-item">
                            <span className="info-label">Pass</span>
                            <span className="info-value">{satelliteInfo.current.pass}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Orbit</span>
                            <span className="info-value">{satelliteInfo.current.orbit}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">AOS</span>
                            <span className="info-value">{satelliteInfo.current.aos}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">LOS</span>
                            <span className="info-value">{satelliteInfo.current.los}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                 
                  {/* Right Map */}
                  <div className="pass-row-container">
                    <div className="Cpass-block map-block horizontal">
                      <div className="pass-header">Current Satellite Position</div>
                      <div className="map-container">
                        <button
                          className="map-view-button"
                          onClick={() => setShowExpandedMap('current')}
                        >
                          View
                        </button>
                        <SatelliteMapViewDashboard
                          onRangeUpdate={(updates) => {
                            console.log('Current position updates:', updates);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
          {/* Next Satellite Info Card */}
          <div className="card satellite-card">
            <div className="satellite-container">
              <div className="satellite-section info-section">
                <h2>Next Satellite Info</h2>
                <div className="toggles-container">
                  <div className="toggle-group" title="It will get active when the satellite comes online">
                    <span>Uplink</span>
                    <label className="switch disabled">
                      <input
                        type="checkbox"
                        checked={nextIsUplinkEnabled}
                        onChange={() => setNextIsUplinkEnabled(!nextIsUplinkEnabled)}
                        disabled
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="toggle-group" title="It will get active when the satellite comes online">
                    <span>Downlink</span>
                    <label className="switch disabled">
                      <input
                        type="checkbox"
                        checked={nextIsDownlinkEnabled}
                        onChange={() => setNextIsDownlinkEnabled(!nextIsDownlinkEnabled)}
                        disabled
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="toggle-group" title="It will get active when the satellite comes online">
                    <span>Sweep</span>
                    <label className="switch disabled">
                      <input
                        type="checkbox"
                        checked={nextIsSweepEnabled}
                        onChange={() => setNextIsSweepEnabled(!nextIsSweepEnabled)}
                        disabled
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="toggle-group" title="It will get active when the satellite comes online">
                    <span>Range</span>
                    <label className="switch disabled">
                      <input
                        type="checkbox"
                        checked={nextIsRangeEnabled}
                        onChange={() => setNextIsRangeEnabled(!nextIsRangeEnabled)}
                        disabled
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
                <div className="pass-sections horizontal-layout">
                  {/* Center Details */}
                  <div className="pass-row-container center-details">
                    <div className="pass-blocks">
                      <div className="pass-details">
                        <div className="pass-info horizontal">
                          <div className="info-item">
                            <span className="info-label">Pass</span>
                            <span className="info-value">{satelliteInfo.next.pass}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Orbit</span>
                            <span className="info-value">{satelliteInfo.next.orbit}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">AOS</span>
                            <span className="info-value">{satelliteInfo.next.aos}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">LOS</span>
                            <span className="info-value">{satelliteInfo.next.los}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                 
                  {/* Right Map */}
                  <div className="pass-row-container">
                    <div className="pass-block map-block horizontal">
                      <div className="pass-header">Next Pass Position</div>
                      <div className="map-container">
                        <button
                          className="map-view-button"
                          onClick={() => setShowExpandedMap('next')}
                        >
                          View
                        </button>
                        <SatelliteMapViewDashboard
                          onRangeUpdate={(updates) => {
                            console.log('Next position updates:', updates);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
          {/* Equipment Configuration card */}
          <div className="cardsss equipment-config-card">
            <div className="equipment-config-header">
              <h2>Equipment to be configure for next pass</h2>
              <button className="common-edit-button" onClick={() => navigate("/NavigateToEquipmentPage")}>
                ✎ Edit
              </button>
            </div>
            <div className="equipment-config-content">
              <div className="equipment-status-group">
                <div className="equipment-status-label">Configuration Sequence</div>
                <div className="equipment-items">
                  {equipmentStatus.inactive.map((item, index) => (
                    <div 
                      key={index} 
                      className="equipment-chip" 
                      title={`Step ${index + 1}\nStart: ${item.start}\nEnd: ${item.end}`}
                    >
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {/* Health Status Cards */}
          {/* Software Health Card - Now First */}
         
          </div>
       
 
        {/* Bottom Section */}
        <div className="bottom-section">
          {/* Alerts Card */}
         
 
          <div className="status-overview-container">
          <div className="cardses">
            <h2>Alerts</h2>
            <div className="alerts">
              <div className="alert-header">
                <span className="alert-col category">Category</span>
                <span className="alert-col equipment">Equipment</span>
                <span className="alert-col reason">Reason</span>
                <span className="alert-col timestamp">Timestamp</span>
                <span className="alert-col status">Status</span>
              </div>
              {alerts.map((alert, index) => (
                <div key={index} className="alert-item">
                  <span className="alert-col category">{alert.category}</span>
                  <span className="alert-col equipment">{alert.equipment}</span>
                  <span className="alert-col reason">{alert.reason}</span>
                  <span className="alert-col timestamp">{alert.timestamp}</span>
                  <span className={`alert-col status ${alert.status.toLowerCase()}`}>
                    {alert.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
 
  {/* Equipment Health Status Card */}
  <div className="health-card">
            <h3>Software Health Status</h3>
            <div className="health-metric">
              <span className="health-metric-label">CPU Usage</span>
              <span className="health-metric-value">65%</span>
            </div>
            <div className="health-progress-bar">
              <div className="health-progress-fill health-status-warning" style={{width: '65%'}}></div>
            </div>
            <div className="health-metric">
              <span className="health-metric-label">Memory Usage</span>
              <span className="health-metric-value">45%</span>
            </div>
            <div className="health-progress-bar">
              <div className="health-progress-fill health-status-good" style={{width: '45%'}}></div>
            </div>
          </div>
 
         </div>
 
          {/* Equipment Status Card - Moved up */}
          <div className="cardses equipment-status-card">
            <div className="equipment-status-header">
              <h2>Equipment Configuration Status</h2>
              <button className="common-edit-button" onClick={() => navigate("/NavigateToEquipmentPage")}>
                ✎ Edit
              </button>
            </div>
            <div className="equipment-table">
              <div className="table-header">
                <div className="column">Equipment Name</div>
                <div className="column">Status</div>
                <div className="column">Start Time</div>
                <div className="column">End Time</div>
              </div>
              <div className="table-body">
                {equipmentTableData.map((equipment, index) => (
                  <div key={index} className="table-row">
                    <div className="column equipment-name">
                      {equipment.name}
                    </div>
                    <div className="column">
                      <span className={`status-badge ${equipment.status.toLowerCase().replace(' ', '-')}`}>
                        {equipment.status}
                      </span>
                    </div>
                    <div className="column">{equipment.startTime}</div>
                    <div className="column">{equipment.endTime}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
 
          {/* Equipment Status Overview Card - Moved down */}
 
 
 
         
<div className="status-overview-containers">
  <div className="card status-overview-card">
    <h2>Equipment Status Overview</h2>
    <div className="pie-chart-container">
      <PieChart width={300} height={300}>
        <Pie
          data={equipmentOverviewData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {equipmentOverviewData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          content={({ payload }) => {
            if (payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="custom-tooltip">
                  <p>{`${data.name}: ${data.value}%`}</p>
                  <p>{`${data.count} Equipment`}</p>
                </div>
              );
            }
            return null;
          }}
        />
      </PieChart>
    </div>
    <div className="status-summary">
      {equipmentOverviewData.map((item, index) => (
        <div key={index} className="status-item" title={`${item.count} Equipment are currently ${item.name.toLowerCase()}`}>
          <span className="status-dot" style={{ backgroundColor: item.color }}></span>
          <span className="status-name">{item.name} ({item.count})</span>
        </div>
      ))}
    </div>
  </div>
{/* Equipment Health Status (Individual) - Keep this section */}
<div className="health-cards equipment-health-individual">
  <div className="health-card-header">
    <h3>Equipment Health Status (Individual)</h3>
    <button 
      className="common-edit-button expand-all-button"
      onClick={() => {
        setSelectedEquipment({
          name: "All Equipment",
          status: "overview",
          details: equipmentTableData
        });
        setShowDetailedHealth(true);
      }}
    >
      View All Health Metrics ↗
    </button>
  </div>
  <div className="equipment-health-boxes">
    {equipmentTableData.map((equipment, index) => (
      <div 
        key={index} 
        className="equipment-health-box"
        title={`
          ${equipment.name}
          RF Power: ${getHealthMetrics(equipment)['RF Power']}
          Signal Strength: ${getHealthMetrics(equipment)['Signal Strength']}
          Temperature: ${getHealthMetrics(equipment)['Temperature']}
          Operational Status: ${getHealthMetrics(equipment)['Operational Status']}
        `}
      >
        <div className="equipment-health-name">{equipment.name}</div>
        <div className={`equipment-health-score ${
          equipment.status.toLowerCase() === 'successful' ? 'excellent' :
          equipment.status.toLowerCase() === 'progress' ? 'good' : 'warning'
        }`}>
          {getHealthMetrics(equipment)['Operational Status']}
        </div>
      </div>
    ))}
  </div>
  {/* ...existing modal code... */}
</div>

</div>
</div>
 
      {/* Expanded Map Modals */}
      {showExpandedMap === 'current' && (
<ExpandedMapModal
          position={satellitePositions.current}
          title="Current Satellite Position"
          satellitePass={satelliteInfo.current.pass}
          onClose={() => setShowExpandedMap(null)}
          isCurrentPass={true}
        />
      )}
      {showExpandedMap === 'next' && (
<ExpandedMapModal
          position={satellitePositions.next}
          title="Next Pass Position"
          satellitePass={satelliteInfo.next.pass}
          onClose={() => setShowExpandedMap(null)}
          isCurrentPass={false}
        />
      )}
      {/* Equipment/Satellite Management Modal */}
      {showEquipmentModal && (
<EquipmentManagementModal onClose={() => setShowEquipmentModal(false)} />
      )}
      {showSessionModal && (
<SessionPageModal onClose={() => setShowSessionModal(false)} />
      )}
</div>
  );
};
export default Dashboard;