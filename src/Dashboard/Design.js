import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Satellite, Radio, Settings, Clock, ChevronRight, Calendar, AlertCircle } from 'lucide-react';
import './Design.css';

// Mock data definitions
const mockLocations = [
  { id: 'loc1', name: 'Bengaluru', regions: ['South India', 'Karnataka'] },
  { id: 'loc2', name: 'Sriharikota', regions: ['South India', 'Andhra Pradesh'] },
  { id: 'loc3', name: 'Ahmedabad', regions: ['West India', 'Gujarat'] }
];

const mockSatellites = [
  { id: 'sat1', name: 'INSAT-3DR', type: 'Meteorological' },
  { id: 'sat2', name: 'GSAT-30', type: 'Communication' },
  { id: 'sat3', name: 'RISAT-2B', type: 'Earth Observation' }
];

const mockGroundStations = [
  { id: 'gs1', name: 'ISTRAC Bengaluru', capabilities: ['Tracking', 'Telemetry'] },
  { id: 'gs2', name: 'MCF Hassan', capabilities: ['Communication', 'Control'] },
  { id: 'gs3', name: 'SDSC SHAR', capabilities: ['Launch Control', 'Tracking'] }
];

// Equipment categories and items
const generateEquipmentData = () => {
  const categories = [
    'RF Systems', 'Antenna Systems', 'Power Systems', 'Control Units',
    'Data Processing', 'Network Equipment', 'Test Equipment', 'Monitoring Systems'
  ];

  const equipment = [];
  categories.forEach((category, catIndex) => {
    for (let i = 1; i <= 10; i++) {
      equipment.push({
        id: `eq-${catIndex}-${i}`,
        name: `${category} ${i}`,
        category,
        configTime: Math.floor(Math.random() * 60) + 30,
        specifications: {
          power: `${Math.floor(Math.random() * 1000)}W`,
          frequency: `${Math.floor(Math.random() * 100)}GHz`,
          status: Math.random() > 0.2 ? 'Operational' : 'Maintenance'
        }
      });
    }
  });
  return { categories, equipment };
};

const { categories: equipmentCategories, equipment: equipmentItems } = generateEquipmentData();

const Design = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  
  // Move state declarations here
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [totalTime, setTotalTime] = useState(0);
  const [selectedItems, setSelectedItems] = useState({
    location: null,
    region: null,
    satellite: null,
    groundStation: null,
    equipment: []
  });

  const [error, setError] = useState("");
  const [selectedTimes, setSelectedTimes] = useState({
    start: '',
    end: ''
  });

  // Add new state for time range editing
  const [editingTimeRange, setEditingTimeRange] = useState(null);

  // Add this function near the top of your component
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    return dateTimeString.replace('T', ' T-');
  };

  // Update the calculateTimeSlot function to include duration parameter
  const calculateTimeSlot = (startTime, previousDuration, duration) => {
    if (!startTime) return '';
    
    const start = new Date(startTime);
    if (previousDuration > 0) {
      start.setMinutes(start.getMinutes() + previousDuration);
    }
    
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + duration); // Use passed duration instead of item.configTime
    
    const formatTime = (date) => {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };
    
    return `${formatTime(start)} to ${formatTime(end)}`;
  };

  // Add new handler function for time range updates
  const handleTimeRangeUpdate = (itemId, newStartTime) => {
    const equipmentIndex = selectedItems.equipment.findIndex(item => item.id === itemId);
    if (equipmentIndex === -1) return;

    const updatedEquipment = [...selectedItems.equipment];
    let currentStartTime = new Date(newStartTime);

    // Update start times for this and all subsequent equipment
    for (let i = equipmentIndex; i < updatedEquipment.length; i++) {
      const item = updatedEquipment[i];
      const endTime = new Date(currentStartTime);
      endTime.setMinutes(endTime.getMinutes() + item.configTime);
      
      item.startTime = currentStartTime.toISOString();
      item.endTime = endTime.toISOString();
      
      currentStartTime = new Date(endTime);
    }

    setSelectedItems(prev => ({
      ...prev,
      equipment: updatedEquipment
    }));
    setEditingTimeRange(null);
  };

  // Add this function outside renderHierarchyContent
  const filteredEquipment = equipmentItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Update totalTime when equipment changes
  React.useEffect(() => {
    const newTotal = selectedItems.equipment.reduce((sum, item) => sum + item.configTime, 0);
    setTotalTime(newTotal);
  }, [selectedItems.equipment]);

  const steps = [
    'Location, Satellite & Ground Station',
    'Equipment Configuration',
    'Review Configuration',
    'Session Information'
  ];

  const handleLocationSelect = (location) => {
    setSelectedItems(prev => ({...prev, location, region: null}));
  };

  const handleRegionSelect = (e, region) => {
    e.stopPropagation();
    setSelectedItems(prev => ({...prev, region}));
  };

  const handleSatelliteSelect = (satellite) => {
    setSelectedItems(prev => ({...prev, satellite}));
  };

  const handleGroundStationSelect = (station) => {
    console.log('Selected station:', station); // Add this for debugging
    setSelectedItems(prev => ({...prev, groundStation: station}));
  };

  const handleNext = () => {
    if (activeStep === 1) {
      // Validate that all required components including time are selected in Case 1
      if (!selectedItems.location || !selectedItems.satellite || !selectedItems.groundStation) {
        setError("Please select a Location, Satellite, and Ground Station before proceeding.");
        return;
      }
      if (!selectedTimes.start || !selectedTimes.end) {
        setError("Please select both Start Time and End Time before proceeding.");
        return;
      }
      // Validate that end time is after start time
      if (new Date(selectedTimes.end) <= new Date(selectedTimes.start)) {
        setError("End Time must be after Start Time.");
        return;
      }
    }
    setError(""); // Clear any previous errors
    setActiveStep(prev => prev + 1);
  };

  const handleEquipmentSelect = (equipment) => {
    setSelectedItems(prev => ({
      ...prev,
      equipment: [...prev.equipment, equipment]
    }));
  };

  const handleRemoveEquipment = (id) => {
    setSelectedItems(prev => ({
      ...prev,
      equipment: prev.equipment.filter(item => item.id !== id)
    }));
  };

  const renderHierarchyContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="hierarchy-step unified-selection">
            <div className="step-header">
              <h3 className="step-title">Select Location, Satellite & Ground Station</h3>
              <div className="time-selection-container">
                <div className="time-input-group">
                  <label>Start Time<span className="required-asterisk">*</span></label>
                  <input
                    type="datetime-local"
                    value={selectedTimes.start}
                    onChange={(e) => setSelectedTimes(prev => ({...prev, start: e.target.value}))}
                    required
                    className={!selectedTimes.start ? 'input-error' : ''}
                  />
                </div>
                <span className="time-separator">to</span>
                <div className="time-input-group">
                  <label>End Time<span className="required-asterisk">*</span></label>
                  <input
                    type="datetime-local"
                    value={selectedTimes.end}
                    onChange={(e) => setSelectedTimes(prev => ({...prev, end: e.target.value}))}
                    required
                    className={!selectedTimes.end ? 'input-error' : ''}
                  />
                </div>
              </div>
            </div>

            {/* Location Selection */}
            <div className="selection-section">
              <h4 className="section-title">
                <Map size={20} className="section-icon" />
                Location & Region
              </h4>
              <div className="location-grid">
                {mockLocations.map((location) => (
                  <div
                    key={location.id}
                    className={`location-card ${selectedItems.location?.id === location.id ? "selected" : ""}`}
                    onClick={() => handleLocationSelect(location)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${location.name}`}
                  >
                    <Map size={24} className="card-icon" />
                    <h4 className="card-title">{location.name}</h4>
                    <div className="regions">
                      {location.regions.map((region) => (
                        <span
                          key={region}
                          className={`region-tag ${selectedItems.region === region ? "selected" : ""}`}
                          onClick={(e) => handleRegionSelect(e, region)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Select ${region}`}
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Satellite Selection */}
            <div className="selection-section">
              <h4 className="section-title">
                <Satellite size={20} className="section-icon" />
                Satellite
              </h4>
              <div className="satellite-grid">
                {mockSatellites.map((satellite) => (
                  <div
                    key={satellite.id}
                    className={`satellite-card ${selectedItems.satellite?.id === satellite.id ? "selected" : ""}`}
                    onClick={() => handleSatelliteSelect(satellite)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${satellite.name}`}
                  >
                    <Satellite size={24} className="card-icon" />
                    <h4 className="card-title">{satellite.name}</h4>
                    <p className="card-subtitle">{satellite.type}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ground Station Selection */}
            <div className="selection-section">
              <h4 className="section-title">
                <Radio size={20} className="section-icon" />
                Ground Station
              </h4>
              <div className="station-grid">
                {mockGroundStations.map((station) => (
                  <div
                    key={station.id}
                    className={`station-card ${selectedItems.groundStation?.id === station.id ? "selected" : ""}`}
                    onClick={() => handleGroundStationSelect(station)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${station.name}`}
                  >
                    <Radio size={24} className="card-icon" />
                    <h4 className="card-title">{station.name}</h4>
                    <p className="card-subtitle">Capabilities:</p>
                    <div className="capabilities">
                      {station.capabilities.map((cap, index) => (
                        <span key={index} className="capability-tag">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <AlertCircle size={16} className="error-icon" />
                <span>{error}</span>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="equipment-configuration">
            {/* Add time display banner */}
            <div className="selected-time-banner">
              <Clock size={16} />
              <span>Selected Time Range:</span>
              <span className="time-value">{formatDateTime(selectedTimes.start)}</span>
              <span>to</span>
              <span className="time-value">{formatDateTime(selectedTimes.end)}</span>
            </div>
            
            <div className="unified-equipment-box">
              {/* Left Panel: Equipment Search and Categories */}
              <div className="equipment-left-panel">
                <div className="equipment-search">
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="equipment-categories">
                  <div className="category-list">
                    <div 
                      className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('all')}
                    >
                      All Equipment
                    </div>
                    {equipmentCategories.map(category => (
                      <div
                        key={category}
                        className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Panel: Equipment Grid */}
              <div className="equipment-middle-panel">
                <div className="equipment-grid">
                  {filteredEquipment.map(item => {
                    const isSelected = selectedItems.equipment.some(selectedItem => selectedItem.id === item.id);
                    return (
                      <div
                        key={item.id}
                        className={`equipment-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => !isSelected && handleEquipmentSelect(item)}
                      >
                        <div className="equipment-name">{item.name}</div>
                        <div className="equipment-time">
                          <Clock size={14} />
                          {item.configTime}min
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Panel: Selected Equipment */}
              <div className="equipment-right-panel">
                <div className="selected-equipment-panel">
                  <div className="selected-equipment-header">
                    <h3>Selected Equipment ({selectedItems.equipment.length})</h3>
                    <div className="total-time">Total: {totalTime}min</div>
                  </div>
                  <div className="selected-equipment-grid">
                    {selectedItems.equipment.map((item, index) => {
                      // Calculate total duration of all previous items
                      const previousDuration = selectedItems.equipment
                        .slice(0, index)
                        .reduce((acc, curr) => acc + curr.configTime, 0);
                      
                      const timeSlot = calculateTimeSlot(
                        selectedTimes.start,
                        previousDuration,
                        item.configTime // Pass the current item's duration
                      );
                      
                      return (
                        <div key={item.id} className="selected-equipment-item">
                          <div className="equipment-details">
                            <span className="equipment-name">{item.name}</span>
                            {editingTimeRange === item.id ? (
                              <div className="time-range-edit">
                                <input
                                  type="datetime-local"
                                  defaultValue={item.startTime || selectedTimes.start}
                                  onChange={(e) => handleTimeRangeUpdate(item.id, e.target.value)}
                                  onBlur={() => setEditingTimeRange(null)}
                                  autoFocus
                                />
                              </div>
                            ) : (
                              <div className="equipment-timeslot-container">
                                <span className="equipment-timeslot">{timeSlot}</span>
                                <button 
                                  className="edit-time-range-button"
                                  onClick={() => setEditingTimeRange(item.id)}
                                >
                                  ✎
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="equipment-duration">
                            <span className="duration-time">{item.configTime}min</span>
                            <button 
                              className="remove-button"
                              onClick={() => handleRemoveEquipment(item.id)}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        const totalConfigTime = selectedItems.equipment.reduce((acc, curr) => acc + curr.configTime, 0);
      
        return (
          <div className="hierarchy-step flow-diagram">
            <h3>Configuration Flow Overview</h3>
            <div className="flow-container">
              <div className="flow-node">
                <div className="flow-content">
                  <h4>Location & Region</h4>
                  <p>{selectedItems.location ? selectedItems.location.name : 'Select Location'}</p>
                  <p>{selectedItems.region || 'Select Region'}</p>
                </div>
              </div>
              
              <ChevronRight size={24} className="flow-arrow" />
              
              <div className="flow-node">
                <div className="flow-content">
                  <h4>Satellite</h4>
                  <p>{selectedItems.satellite ? selectedItems.satellite.name : 'Select Satellite'}</p>
                  <p>{selectedItems.satellite ? selectedItems.satellite.type : 'Select Type'}</p>
                </div>
              </div>
              
              <ChevronRight size={24} className="flow-arrow" />
              
              <div className="flow-node">
                <div className="flow-content">
                  <h4>Ground Station</h4>
                  <p>{selectedItems.groundStation ? selectedItems.groundStation.name : 'Select Ground Station'}</p>
                  <p>{selectedItems.groundStation ? 
                    selectedItems.groundStation.capabilities.join(', ') : 
                    'Select Capabilities'}</p>
                </div>
              </div>
              
              <ChevronRight size={24} className="flow-arrow" />
              
              <div className="equipment-node">
                <div className="flow-content">
                  <h4>Equipment Configuration</h4>
                  <div className="equipment-list">
                    {selectedItems.equipment.map((item, index) => {
                      const previousDuration = selectedItems.equipment
                        .slice(0, index)
                        .reduce((acc, curr) => acc + curr.configTime, 0);
                      
                      const timeSlot = calculateTimeSlot(
                        selectedTimes.start,
                        previousDuration,
                        item.configTime
                      );

                      return (
                        <div key={index} className="equipment-item-flow">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Settings size={16} />
                              <span>{item.name}</span>
                            </div>
                            <span className="equipment-timeslot">{timeSlot}</span>
                          </div>
                          <span className="equipment-time">{item.configTime}min</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="total-time">
                    Total Configuration Time: {totalConfigTime} minutes
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        // Calculate total duration from selected times
        const startDateTime = new Date(selectedTimes.start);
        const endDateTime = new Date(selectedTimes.end);
        const totalDuration = Math.ceil((endDateTime - startDateTime) / (1000 * 60)); // Convert to minutes

        return (
          <div className="hierarchy-step final-config">
            <h3>Session Configuration Summary</h3>
            <div className="config-sections">
              <div className="config-section">
                <h4>Schedule Information</h4>
                <div className="input-group">
                  <label>Session Name</label>
                  <input type="text" placeholder="Enter session name" required />
                </div>
                <div className="input-group">
                  <label>Start Date & Time</label>
                  <div className="datetime-display">
                    {formatDateTime(selectedTimes.start)}
                  </div>
                </div>
                <div className="input-group">
                  <label>Duration</label>
                  <div className="duration-display">
                    {totalDuration} minutes
                  </div>
                </div>
              </div>

              <div className="config-section">
                <h4>Location & Satellite</h4>
                <div className="summary-item">
                  <Map size={16} />
                  <span>Location: {selectedItems.location?.name} ({selectedItems.region})</span>
                </div>
                <div className="summary-item">
                  <Satellite size={16} />
                  <span>Satellite: {selectedItems.satellite?.name} ({selectedItems.satellite?.type})</span>
                </div>
                <div className="summary-item">
                  <Radio size={16} />
                  <span>Ground Station: {selectedItems.groundStation?.name}</span>
                </div>
              </div>

              {/* Rest of the components */}
              <div className="config-section">
                <h4>Equipment Configuration ({selectedItems.equipment.length})</h4>
                <div className="equipment-timeline">
                  {selectedItems.equipment.map((equip, index) => (
                    <div key={equip.id} className="timeline-item">
                      <Clock size={16} />
                      <div className="timeline-content">
                        <span>{equip.name}</span>
                        <span className="time">{equip.configTime} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="config-section">
                <h4>Additional Settings</h4>
                <div className="input-group">
                  <label>Priority Level</label>
                  <select>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Notes</label>
                  <textarea placeholder="Add any additional notes..."></textarea>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="design-container">
      <div className="design-header">
        <div className="header-content">
          <h2>Mission Configuration</h2>
          <button onClick={() => navigate('/Dashboard')} className="back-button">
            Back to Dashboard
          </button>
        </div>
        <div className="steps-indicator">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`step ${activeStep === index + 1 ? 'active' : ''} ${activeStep > index + 1 ? 'completed' : ''}`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="design-content">
        {renderHierarchyContent()}
      </div>

      <div className="design-footer">
        <button 
          className="secondary-button"
          onClick={() => navigate('/Dashboard')}
        >
          Cancel
        </button>
        
        {activeStep > 1 && (
          <button 
            className="secondary-button"
            onClick={() => setActiveStep(prev => prev - 1)}
          >
            Previous
          </button>
        )}
        
        {activeStep < steps.length ? (
          <button 
            className="primary-button"
            onClick={handleNext}
          >
            Next
          </button>
        ) : (
          <button 
            className="primary-button"
            onClick={() => {
              alert('Configuration saved!');
              navigate('/Dashboard');
            }}
          >
            Save Configuration
          </button>
        )}
      </div>
    </div>
  );
};

export default Design;