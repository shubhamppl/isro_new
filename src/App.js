import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// Update imports to point to correct folder locations
import SignupPage from './Sign_in_page/SignupPage';
import Dashboard from './Dashboard/Dashboard';
import Design from './Dashboard/Design';
import Report from './Report/Report';
import NavigateToEquipmentPage from './Dashboard/NavigateToEquipmentPage';
import SignOutPage from './Sign_in_page/SignOutPage';
import LogsPage from './Logs/LogsPage';
import Tracking from './Simulation_page/Tracking'; 
import NavigateToSessionPage from './Dashboard/NavigateToSessionPage';
import LocalView from './Local_view/Local_view';
import EditSatelliteSchedule from './Schedule/EditSatelliteSchedule';
import Simulation from './Tracking/simulation';  // Ensure the casing matches the file name
import SatelliteMapView from './Tracking/SatelliteMapView';
import EquipmentManagement from './Dashboard/EquipmentManagement';
import SessionPage from './Dashboard/SessionPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/SignupPage" />} />
        <Route path='/Local_view' element={<LocalView/>}/>
        <Route path="/SignupPage" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />
        <Route path="/NavigateToEquipmentPage" element={<NavigateToEquipmentPage />} />
        <Route path="/SignOutPage" element={<SignOutPage />} />
        <Route path="/LogsPage" element={<LogsPage />} />
        <Route path='/Tracking' element={<Tracking />} />       
        <Route path='NavigateToSessionPage' element={<NavigateToSessionPage/>} />
        <Route path='EditSatelliteSchedule' element={<EditSatelliteSchedule/>} />
        <Route path='simulation' element={<Simulation/>} />
        <Route  path='SatelliteMapView' element={<SatelliteMapView/>}/>
        <Route path="/Design" element={<Design />} />      
        <Route path="/EquipmentManagement" element={<EquipmentManagement/>}/>
        <Route path="/SessionPage" element={<SessionPage/>}/>
      </Routes>
    </Router>
  );
};

export default App;
