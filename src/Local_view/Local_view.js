import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Local_page.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
 
// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
 
const MapView = ({ location, title }) => {
  const position = [
    parseFloat(location.lat.split('°')[0]),
    parseFloat(location.long.split('°')[0])
  ];
 
  return (
    <div className='visualization-container'>
      <div className="map-containeres">
        <div className="map-title">{title}</div>
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={position} />
        </MapContainer>
      </div>
    </div>
  );
};
 
const StationCard = ({ station, missionIndex, isUpcoming = false }) => {
  const totalAlarms = Object.values(station.alarms).reduce((a, b) => a + b, 0);
  const missionTitles = [
    "Equipment Configures for Mission M1",
    "Equipment Configures for Mission M2",
    "Equipment Configures for Mission M3"
  ];
  const [activeTooltip, setActiveTooltip] = useState(null);
  const navigate = useNavigate();
 
  // For upcoming missions, these are always set to default values and can't be changed
  const [isUplinkActive] = useState(isUpcoming ? false : true);
  const [isDownlinkActive] = useState(isUpcoming ? false : true);
  const [isSweepActive] = useState(isUpcoming ? false : false);
  const [isRangeActive] = useState(isUpcoming ? false : false);
 
  return (
    <div className="station-card">
      <div className="station-header">
        <div>
          <div className="card-title">
            <button className="buttons" tabIndex={0} onClick={() => navigate("/dashboard")}>View</button>
            <h2 className="crp-title">ANT - 1</h2>
            <span className="timestamp">T+ 01:01:23</span>
           
            {/* New Time Display Position */}
           
            <div className="control-toggles">
              <div className="toggle-item">
                <span>Sweep</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isSweepActive}
                    onChange={!isUpcoming ? () => {} : undefined}
                    disabled={isUpcoming}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="toggle-item">
                <span>Range</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isRangeActive}
                   
                    disabled={isUpcoming}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <span className="station-id">{station.id}</span>
          </div>
         
          <div className="satellite-info">
            <div className="label">Satellite Name</div>
            <div className="satellite-details">
              <span className="satellite-name">{station.satelliteName}</span>
              <span className={`status-${isUpcoming ? 'inactive' : 'active'}`}>● {isUpcoming ? 'Inactive' : 'Active'}</span>
            </div>
          </div>
 
          <div className="mission-info">
            <div className="info-item">
              <span className="info-label">Mission ID:</span>
              <span className="info-value">{station.missionId}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Pass ID:</span>
              <span className="info-value">{station.passId}</span>
            </div>
          </div>
 
          <div className="communication-panel">
            <div className="antenna-icon">
              <svg viewBox="0 0 24 24">
                <path fill={isUpcoming ? "#aaa" : "currentColor"} d="M21,8c-1.45,0-2.26,1.44-1.93,2.51l-3.55,3.56c-0.3-0.09-0.74-0.09-1.04,0l-2.55-2.55C12.27,10.45,11.46,9,10,9 c-1.45,0-2.27,1.44-1.93,2.52l-4.56,4.55C2.44,15.74,1,16.55,1,18c0,1.1,0.9,2,2,2c1.45,0,2.26-1.44,1.93-2.51l4.55-4.56 c0.3,0.09,0.74,0.09,1.04,0l2.55,2.55C12.73,16.55,13.54,18,15,18c1.45,0,2.27-1.44,1.93-2.52l3.56-3.55 C21.56,12.26,23,11.45,23,10C23,8.9,22.1,8,21,8z"/>
              </svg>
            </div>
            <div className="wave-indicators">
              <div className="wave-item">
                <span>Uplink</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isUplinkActive}
                    onChange={!isUpcoming ? () => {} : undefined}
                    disabled={isUpcoming}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <svg viewBox="0 0 100 20" className={`wave ${isUplinkActive ? 'active' : 'inactive'}`}>
                  <path d="M0,10 Q25,0 50,10 Q75,20 100,10" stroke={isUpcoming ? "#aaa" : "green"} strokeWidth="3" fill="none"/>
                </svg>
              </div>
              <div className="wave-item">
                <span>Downlink</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isDownlinkActive}
                    onChange={!isUpcoming ? () => {} : undefined}
                    disabled={isUpcoming}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <svg viewBox="0 0 100 20" className={`wave ${isDownlinkActive ? 'active' : 'inactive'}`}>
                  <path d="M0,10 Q25,0 50,10 Q75,20 100,10" stroke={isUpcoming ? "#aaa" : "green"} strokeWidth="3" fill="none"/>
                </svg>
              </div>
            </div>
            <div className="satellite-icon">
              <svg viewBox="0 0 24 24">
                <path fill={isUpcoming ? "#aaa" : "currentColor"} d="M12,15c-1.66,0-3-1.34-3-3s1.34-3,3-3s3,1.34,3,3S13.66,15,12,15z"/>
              </svg>
            </div>
           
          </div>
         
        </div>
       
        {isUpcoming && <div style={{ width: '30px' }}></div>}
 
        <div className={isUpcoming ? "upcoming-status" : "status-indicators"}>
  {['SCSN', 'AOS', 'LOS', 'LLAN', 'STNN', 'TLM'].map(item => (
    <div key={item} className="status-item">
      <span className={isUpcoming ? "upcoming-dot" : "active-dot"}></span>
      <span className={isUpcoming ? "upcoming-text" : ""}>{item}</span>
    </div>
  ))}
</div>
 
       
 
 
        <div className="channel-info">
  {isUpcoming ? (
    <>
      <div className="mission-times-header">
        <div className="time-block">
          <span className="time-label">Start</span>
          <span className="time-value">
            {new Date(station.startTime).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </span>
          <span className="time-date">
            {new Date(station.startTime).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short'
            })}
          </span>
        </div>
        <div className="time-block">
          <span className="time-label">End</span>
          <span className="time-value">
            {new Date(station.endTime).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </span>
          <span className="time-date">
            {new Date(station.endTime).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short'
            })}
          </span>
        </div>
      </div>
      <div>Str Opr: TM,TC,SPS_PB,PB,TR</div>
      <div>Channel A (ChA) IF Level: NA</div>
      <div>Channel B (ChB) IF Level: NA</div>
      <div>Channel A (ChA) Eb/No: NA</div>
      <div>Channel B (ChB) Eb/No: NA</div>
      <div>TM Storage File Size in Bytes: NA</div>
    </>
  ) : (
    <>
      <div>Str Opr: TM,TC,SPS_PB,PB,TR</div>
      <div>Channel A (ChA) IF Level: +107.03 dB</div>
      <div>Channel B (ChB) IF Level: -122.8 dB</div>
      <div>Channel A (ChA) Eb/No: -58.1</div>
      <div>Channel B (ChB) Eb/No: 39.1</div>
      <div>TM Storage File Size in Bytes: 104857600</div>
    </>
  )}
</div>
 
 
{isUpcoming && <div style={{ width: '45px' }}></div>}
       
 
        <div style={{ height: isUpcoming ? '30px' : '10px' }}></div>
     
 
        <div className="metricss">
          <div className="metrics-item">
            <div className={`metrics-label`}>{missionTitles[missionIndex]}</div>
            <div className={`metrics-value equipment`}>{station.equipmentConfigures}</div>
          </div>
          <div className="metrics-item">
            <div className={`metrics-label`}>Satellite Pass Time</div>
            <div className={`metrics-value passes`}>{station.satellitePasses}</div>
          </div>
        </div>
 
        <div className="visualizations">  
          <div className="location-cards">
            <div className="location-card">
              <MapView location={station.location} title="Location" />
            </div>
            <div className="alarm-chart">
              <div className="donut-chart">
                <svg viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" className={`donut-ring`}/>
                  {[
                    { value: station.alarms.signalLoss || 0, class: 'signal-loss', offset: 0 },
                    { value: station.alarms.powerFailure || 0, class: 'power-failure', offset: station.alarms.signalLoss || 0 },
                    { value: station.alarms.alignmentError || 0, class: 'alignment-error', offset: (station.alarms.signalLoss || 0) + (station.alarms.powerFailure || 0) },
                    { value: station.alarms.other || 0, class: 'other', offset: (station.alarms.signalLoss || 0) + (station.alarms.powerFailure || 0) + (station.alarms.alignmentError || 0) }
                  ].map(({ value, class: className, offset }) => (
                    <circle
                      key={className}
                      cx="18"
                      cy="18"
                      r="15.915"
                      className={`donut-segment ${className}`}
                      strokeDasharray={`${value ? (value / totalAlarms) * 100 : 0}, 100`}
                      transform={`rotate(${value ? (offset / totalAlarms) * 360 - 90 : 0} 18 18)`}
                      onMouseEnter={() => value && setActiveTooltip({ type: className, value })}
                      onMouseLeave={() => setActiveTooltip(null)}
                    />
                  ))}
                  <text x="18" y="18" className={`donut-text`}>{totalAlarms} Alerts</text>
                </svg>
                {activeTooltip && (
                  <div className="donut-tooltip">
                    <div className="tooltip-title">
                      {activeTooltip.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </div>
                    <div className="tooltip-value">{activeTooltip.value} alarms</div>
                    <div className="tooltip-percentage">
                      {Math.round((activeTooltip.value / totalAlarms) * 100)}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
const Local_view = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoMenuOpen, setLogoMenuOpen] = useState(false);
  const navigate = useNavigate();
 
  const stations = [
    {
      id: 'BL-1',
      missionId: 'MISSION-001',
      passId: 'PASS-2023-001',
      satelliteName: 'Sat12334',
      satellitePasses: '15 mins',
      equipmentConfigures: 30,
      location: {
        lat: '12.9716° N',
        long: '77.5946° E'
      },
      alarms: {
        signalLoss: 12,
        powerFailure: 4,
        alignmentError: 7,
        other: 3
      }
    },
    {
      id: 'BL-1',
      missionId: 'MISSION-002',
      passId: 'PASS-2023-002',
      satelliteName: '122DSKL',
      satellitePasses: '20 mins',
      equipmentConfigures: 45,
      location: {
        lat: '12.9716° N',
        long: '77.5946° E'
      },
      alarms: {
        signalLoss: 20,
        powerFailure: 5,
        alignmentError: 10,
        other: 2
      }
    }
  ];
 
  const upcomingStations = [
    {
      id: 'BL-1',
      missionId: 'MISSION-003',
      passId: 'PASS-2023-003',
      satelliteName: 'Sat14534',
      satellitePasses: '10 mins',
      equipmentConfigures: 67,
      location: {
        lat: '12.9716° N',
        long: '77.5946° E'
      },
      alarms: {
        signalLoss: 1
      },
      startTime: '2025-04-05T14:30:00',
      endTime: '2025-04-05T14:40:00'
    }
  ];
 
  return (
    <div className="dashboards">
      <div className="header">
        <div className="header-left">
          <img
            src="logo.png"
            alt="ISRO Logo"
            className="logo"          
          />
          {logoMenuOpen && (
            <div className="dropdown-menu1">
              <button>Go to Local View</button>
            </div>
          )}
        </div>
        <div className="title">Operational Mission Overview</div>
       
        <div className="header-right">
          <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
 
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
 
      <h2>Current Missions</h2>
      {stations.map((station, index) => (
        <StationCard key={station.id} station={station} missionIndex={index} />
      ))}
 
      <h2>Upcoming Missions</h2>
      {upcomingStations.map((station, index) => (
        <StationCard key={station.id} station={station} missionIndex={2} isUpcoming={true} />
      ))}
    </div>
  );
};
 
export default Local_view;