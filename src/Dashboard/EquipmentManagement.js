import React, { useState } from 'react';
import './EquipmentManagement.css';

const EquipmentManagement = () => {
  const [activeTab, setActiveTab] = useState('equipment');
  const [equipmentList] = useState([
    { id: 1, name: 'Equipment 1', status: 'Online', type: 'Antenna' },
    { id: 2, name: 'Equipment 2', status: 'Offline', type: 'Transmitter' },
    { id: 3, name: 'Equipment 3', status: 'Maintenance', type: 'Receiver' }
  ]);

  return (
    <div className="equipment-management">
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'equipment' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('equipment')}
        >
          Equipment
        </button>
        <button 
          className={`tab-button ${activeTab === 'satellite' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('satellite')}
        >
          Satellite
        </button>
      </div>

      <div className="tab-content-container">
        {activeTab === 'equipment' && (
          <div className="list-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipmentList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button className="edit-button">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'satellite' && (
          <div>
            <h3>Satellite Configuration</h3>
            {/* Add satellite management content here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentManagement;
