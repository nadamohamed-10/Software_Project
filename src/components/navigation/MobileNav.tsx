import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/MobileNav.css';

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="mobile-nav">
      <div className="mobile-nav-header">
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <Link to="/" className="mobile-logo">
          <h1>ClinicMS</h1>
        </Link>
      </div>

      {isOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <div className="mobile-menu-header">
              <Link to="/" className="mobile-logo" onClick={closeMenu}>
                <h2>ClinicMS</h2>
              </Link>
              <button className="close-menu" onClick={closeMenu}>
                ×
              </button>
            </div>

            <nav className="mobile-nav-links">
              {user?.role === 'Patient' ? (
                <>
                  <Link to="/patient/dashboard" className="nav-link" onClick={closeMenu}>
                    <span className="icon">📅</span>
                    <span className="text">Dashboard</span>
                  </Link>
                  <Link to="/appointments" className="nav-link" onClick={closeMenu}>
                    <span className="icon">📋</span>
                    <span className="text">Appointments</span>
                  </Link>
                  <Link to="/medical-records" className="nav-link" onClick={closeMenu}>
                    <span className="icon">📝</span>
                    <span className="text">Medical Records</span>
                  </Link>
                  <Link to="/prescriptions" className="nav-link" onClick={closeMenu}>
                    <span className="icon">💊</span>
                    <span className="text">Prescriptions</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/doctor/dashboard" className="nav-link" onClick={closeMenu}>
                    <span className="icon">📅</span>
                    <span className="text">Dashboard</span>
                  </Link>
                  <Link to="/appointments" className="nav-link" onClick={closeMenu}>
                    <span className="icon">📋</span>
                    <span className="text">Appointments</span>
                  </Link>
                  <Link to="/schedule" className="nav-link" onClick={closeMenu}>
                    <span className="icon">🕒</span>
                    <span className="text">Schedule</span>
                  </Link>
                </>
              )}
              <Link to="/profile" className="nav-link" onClick={closeMenu}>
                <span className="icon">👤</span>
                <span className="text">Profile</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;