import React from "react";
import "./session.css"; // CSS for styling
import { useNavigate } from "react-router-dom";
 

const SessionPage = ({ onClose, onEdit,onNew }) => {
    const navigate = useNavigate();
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Manage Sessions</h2>
        <div className="button-group">
          
          <button className="session-button edit" tabIndex={0} onClick={() => navigate("/Design")}>New Session </button>
          <button className="session-button edit" onClick={onEdit}>
            Edit Session
          </button>
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SessionPage;
