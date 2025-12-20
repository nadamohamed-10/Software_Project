import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/Home.css';
import NameTransliterator from '../components/common/NameTransliterator';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>Welcome to Clinic Management System</h1>
        <p>Hello, {user?.firstName} {user?.lastName}!</p>
        <p>You are logged in as a {user?.role}.</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <NameTransliterator />
      </div>
      
      <div className="dashboard-links">
        <div className="card">
          <div className="card-body text-center">
            <h3>Patient Dashboard</h3>
            <p>Manage your appointments, medical records, and prescriptions.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/patient/dashboard')}
            >
              Go to Patient Dashboard
            </button>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <h3>Doctor Dashboard</h3>
            <p>Manage your schedule, appointments, and patient records.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/doctor/dashboard')}
            >
              Go to Doctor Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;