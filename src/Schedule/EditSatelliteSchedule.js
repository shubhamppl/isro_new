import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "./Local_page.css"; // Ensure the CSS file is imported
import "./EditSatelliteSchedule.css";
 
 
const EditSatelliteSchedule = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoMenuOpen, setLogoMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/data");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
 
  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter((item) =>
        item.ScheduleID.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);
 
  const handleEdit = (item) => {
    console.log("Edit button clicked, item:", item);
    setEditData(item);
    setIsModalOpen(true);
  };
 
  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
    setErrorMessage(""); // Clear error message when modal is closed
  };
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value);
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
 
  const saveChanges = async () => {
    console.log("Saving changes:", editData);
 
    // Validate that all fields are non-null
    const requiredFields = [
      "Date",
      "Station",
      "Status",
      "Satellite",
      "Orbit",
      "Elevation",
      "AOS",
      "LOS",
      "Operation",
    ];
 
    for (const field of requiredFields) {
      if (!editData[field] || editData[field] === "") {
        setErrorMessage(`Please fill in the ${field} field.`);
        return; // Stop saving if any field is empty
      }
    }
 
    if (!editData || !editData.ScheduleID) {
      console.error("ScheduleID is missing in editData");
      return;
    }
 
    try {
      const response = await fetch("http://127.0.0.1:5000/api/update-schedule-updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
 
      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to update data:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
 
      const result = await response.json();
      console.log("Update Result:", result);
 
      // Update local state
      setData((prevData) =>
        prevData.map((item) =>
          item.ScheduleID === editData.ScheduleID ? { ...item, ...editData } : item
        )
      );
      console.log("Local state updated:", data);
 
      closeModal();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
 
  const handleAddSchedule = () => {
    const maxScheduleID = data.length > 0
      ? Math.max(...data.map(schedule => Number(schedule.ScheduleID))) + 1
      : 1; // Start from 1 if no existing schedules
 
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
 
    const newSchedule = {
      ScheduleID: maxScheduleID,  // Unique ScheduleID
      Date: formatDate(new Date()),  // Corrected date format (dd-mm-YYYY)
      PassID: "P" + maxScheduleID,
      Station: "",
      Status: "",
      Satellite: "",
      Orbit: "",
      Elevation: "",
      AOS: "",
      LOS: "",
      Operation: "",
    };
 
    // Add the new schedule to the local state
    setData((prevData) => [...prevData, newSchedule]);
    setFilteredData((prevData) => [...prevData, newSchedule]);
 
    // Open the edit modal for the new schedule
    setEditData(newSchedule);
    setIsModalOpen(true);
  };
 
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
            <button onClick={() => navigate("/LogsPage")} className="button">Logs</button>
            <button onClick={() => navigate("/EditSatelliteSchedule")} className="button active">Schedule</button>
          </div>
        </div>
 
        <div className="title">Satellite Schedule</div>
 
        <div className="header-right">
          <span>
            {currentTime.toLocaleTimeString('en-IN', { hour: "2-digit", minute: "2-digit",timeZoneName: 'short' })}
          </span>
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
 
      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by ScheduleID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="add-schedule-btn" onClick={handleAddSchedule}>
          Add Schedule +
        </button>
      </div>
 
      {/* Table Section */}
      <div className="table-container2">
        <table border="1">
          <thead>
            <tr>
              <th>ScheduleID</th>
              <th>Date</th>
              <th>Pass ID</th>
              <th>Station</th>
              <th>Status</th>
              <th>Satellite</th>
              <th>Orbit</th>
              <th>Elevation</th>
              <th>AOS</th>
              <th>LOS</th>
              <th>Operation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.ScheduleID || index}>
                  <td>{item.ScheduleID}</td>
                  <td>{item.Date || "N/A"}</td>
                  <td>{item.PassID || "N/A"}</td>
                  <td>{item.Station || "N/A"}</td>
                  <td>{item.Status || "N/A"}</td>
                  <td>{item.Satellite || "N/A"}</td>
                  <td>{item.Orbit || "N/A"}</td>
                  <td>{item.Elevation || "N/A"}</td>
                  <td>{item.AOS || "N/A"}</td>
                  <td>{item.LOS || "N/A"}</td>
                  <td>{item.Operation || "N/A"}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(item)}
                      disabled={item.Status === "Completed"} // Disable if Status is "Completed"
                      title={item.Status === "Completed" ? "Editing is disabled for Completed status" : ""} // Tooltip
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
 
      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Schedule</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
            <form>
              <label>
                ScheduleID:
                <input
                  type="text"
                  name="ScheduleID"
                  value={editData.ScheduleID || ""}
                  onChange={handleInputChange} // Allow editing for ScheduleID
                  disabled
                />
              </label>
              <label>
                Date:
                <input
                  type="text"
                  name="Date"
                  value={editData.Date || ""}
                  onChange={handleInputChange} // Allow editing for Date
                />
              </label>
              <label>
                Pass ID:
                <input
                  type="text"
                  name="PassID"
                  value={editData.PassID || ""}
                  onChange={handleInputChange} // Allow editing for PassID
                  disabled
                />
              </label>
              <label>
                Station:
                <input
                  type="text"
                  name="Station"
                  value={editData.Station || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Status:
                <input
                  type="text"
                  name="Status"
                  value={editData.Status || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Satellite:
                <input
                  type="text"
                  name="Satellite"
                  value={editData.Satellite || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Orbit:
                <input
                  type="text"
                  name="Orbit"
                  value={editData.Orbit || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Elevation:
                <input
                  type="text"
                  name="Elevation"
                  value={editData.Elevation || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                AOS:
                <input
                  type="text"
                  name="AOS"
                  value={editData.AOS || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                LOS:
                <input
                  type="text"
                  name="LOS"
                  value={editData.LOS || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Operation:
                <input
                  type="text"
                  name="Operation"
                  value={editData.Operation || ""}
                  onChange={handleInputChange}
                />
              </label>
              <button type="button" onClick={saveChanges}>
                Save
              </button>
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default EditSatelliteSchedule;