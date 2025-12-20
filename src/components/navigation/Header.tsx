import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationBadge from '../notifications/NotificationBadge';
import NotificationDropdown from '../notifications/NotificationDropdown';

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleLogout = () => {
    // Clear auth tokens
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    // Redirect to login
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <span className="menu-icon"></span>
            <span className="menu-icon"></span>
            <span className="menu-icon"></span>
          </button>
          <Link to="/" className="logo">
            <h1>ClinicMS</h1>
          </Link>
        </div>
        <div className="header-right">
          <nav className="top-nav">
            <NotificationBadge onClick={() => setIsNotificationOpen(!isNotificationOpen)} />
            <Link to="/profile" className="nav-link">Profile</Link>
            <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
          </nav>
          <NotificationDropdown 
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;