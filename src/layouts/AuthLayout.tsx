import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/layouts/AuthLayout.css';

const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Clinic Management System</h2>
            <p>Welcome to our healthcare platform</p>
          </div>
          <div className="auth-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;