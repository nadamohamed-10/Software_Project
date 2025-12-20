import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user } = useAuth();
  
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        <ul>
          {user?.role === 'Patient' && (
            <>
              <li>
                <Link to="/patient/dashboard" className="nav-link">
                  <span className="icon">📅</span>
                  <span className="text">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="nav-link">
                  <span className="icon">📋</span>
                  <span className="text">Appointments</span>
                </Link>
              </li>
              <li>
                <Link to="/medical-records" className="nav-link">
                  <span className="icon">📝</span>
                  <span className="text">Medical Records</span>
                </Link>
              </li>
              <li>
                <Link to="/prescriptions" className="nav-link">
                  <span className="icon">💊</span>
                  <span className="text">Prescriptions</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="nav-link">
                  <span className="icon">👤</span>
                  <span className="text">Profile</span>
                </Link>
              </li>
            </>
          )}
          
          {user?.role === 'Doctor' && (
            <>
              <li>
                <Link to="/doctor/dashboard" className="nav-link">
                  <span className="icon">📊</span>
                  <span className="text">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/doctor/consultation/test-patient-123/test-appt-456" className="nav-link">
                  <span className="icon">🩺</span>
                  <span className="text">Test Consultation</span>
                </Link>
              </li>
              <li>
                <Link to="/doctor/prescription/test-patient-123" className="nav-link">
                  <span className="icon">💊</span>
                  <span className="text">Add New Prescription</span>
                </Link>
              </li>
              <li>
                <Link to="/doctor/schedule" className="nav-link">
                  <span className="icon">📅</span>
                  <span className="text">Schedule</span>
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="nav-link">
                  <span className="icon">📋</span>
                  <span className="text">Appointments</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="nav-link">
                  <span className="icon">👤</span>
                  <span className="text">Profile</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;