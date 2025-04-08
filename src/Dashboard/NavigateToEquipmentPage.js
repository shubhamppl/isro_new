import { useState } from "react";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

export default function NavigateToEquipmentPage() {
  const [autoTracking, setAutoTracking] = useState(false);
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSaveConfiguration = () => {
    alert("Configuration Saved!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic here
    console.log('Time Range:', { startTime, endTime });
    // Navigate back or process the data
    navigate('/Dashboard');
  };

  return (
    <div className="center-wrapper">
      <div className="content-box">
        {/* Header Section */}
        <div className="header">
          <h2>Edit Configuration</h2>
          <button className="close-btn" onClick={() => navigate(-1)}>
  X
</button>

        </div>

        {/* Form Section */}
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Equip Name</label>
            <select>
              <option>Equip 15</option>
              <option>Equip 16</option>
              <option>Equip 17</option>
            </select>
          </div>

          <div className="form-group">
            <label>Equip Type</label>
            <select>
              <option>Antenna Dish</option>
              <option>Transceiver</option>
            </select>
          </div>

          <div className="grid-group">
            <div className="form-group">
              <label>Frequency Band</label>
              <select>
                <option>C</option>
                <option>Ku</option>
              </select>
            </div>

            <div className="form-group">
              <label>Frequency</label>
              <select>
                <option>5.6 MHz</option>
                <option>7.2 MHz</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Bandwidth</label>
            <input type="text" defaultValue="38 MHz" />
          </div>

          <div className="form-group">
            <label>Target Satellites</label>
            <input type="text" defaultValue="S1, S2, S3" />
          </div>

          <div className="toggle-group">
            <Switch
              checked={autoTracking}
              onChange={setAutoTracking}
              className={`toggle-switch ${autoTracking ? 'on' : 'off'}`}
            >
              <span className="toggle-slider" />
            </Switch>
            <span>Auto-Tracking</span>
          </div>

          <div className="time-range">
            <div className="time-input">
              <label>Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="time-input">
              <label>End Time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="action-buttons">
            <button type="button">View Config History</button>
            <button type="button">Restore Default</button>
          </div>

          <button
            type="button"
            onClick={handleSaveConfiguration}
            className="save-btn"
          >
            Set Configuration
          </button>

          <div className="button-group">
            <button type="submit" className="submit-btn">Configure</button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/Dashboard')}
            >
              Cancel
            </button>
          </div>

          <p className="update-info">
            *Last Updated by User U1 on 26-1-2024 at 16:37 IST
          </p>
        </form>
      </div>

      <style jsx>{`
        .center-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #e2e8f0;
          padding: 1rem;
        }

        .content-box {
          background: #ffffff;
          width: 100%;
          max-width: 450px;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
        }

        .close-btn {
          background-color: #ef4444;
          color: white;
          font-weight: bold;
          padding: 0.5rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .close-btn:hover {
          background-color: #dc2626;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.875rem;
          color: #4a5568;
          font-weight: 500;
        }

        .form-group select,
        .form-group input {
          padding: 0.3rem;
          border: 1px solid #cbd5e0;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .form-group select:focus,
        .form-group input:focus {
          border-color: #4299e1;
          outline: none;
        }

        .grid-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .toggle-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }

        .toggle-switch {
          width: 3rem;
          height: 1.75rem;
          background-color: #cbd5e0;
          border-radius: 1rem;
          position: relative;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .toggle-switch.on {
          background-color: #4299e1;
        }

        .toggle-slider {
          width: 1.25rem;
          height: 1.25rem;
          background-color: white;
          border-radius: 50%;
          position: absolute;
          top: 0.25rem;
          left: 0.25rem;
          transition: transform 0.2s;
        }

        .toggle-switch.on .toggle-slider {
          transform: translateX(1.25rem);
        }

        .time-range {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .time-input {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .button-group {
          display: flex;
          justify-content: space-between;
          margin: 0.5rem 0;
        }

        .action-buttons {
          display: flex;
          justify-content: space-between;
          margin: 0.5rem 0;
        }

        .action-buttons button {
          color: #4299e1;
          background: none;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s;
        }

        .button{
        color:rgb(96, 97, 99);
        }

        .action-buttons button:hover {
          color: #3182ce;
        }

        .save-btn {
          width: 100%;
          background-color:rgb(125, 179, 222);
          color:rgb(91, 100, 114);
          padding: 0.75rem;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .save-btn:hover {
          background-color: #3182ce;
        }

        .submit-btn {
          width: 100%;
          background-color: #4299e1;
          color: white;
          padding: 0.75rem;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-btn:hover {
          background-color: #3182ce;
        }

        .cancel-btn {
          width: 100%;
          background-color: #e53e3e;
          color: white;
          padding: 0.75rem;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .cancel-btn:hover {
          background-color: #c53030;
        }

        .update-info {
          font-size: 0.75rem;
          color: #718096;
          text-align: right;
          margin-top: 0.3rem;
        }
      `}</style>
    </div>
  );
}