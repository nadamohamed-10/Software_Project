import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/pages/Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use role-specific email if generic email is provided
      const loginEmail = email.includes('@') ? email : `${email}@test.com`;
      const roleEmail = role === 'doctor' ? `doctor.${loginEmail}` : loginEmail;
      
      await login(roleEmail, password, rememberMe);
      
      // Redirect based on selected role
      if (role === 'doctor') {
        navigate('/doctor/dashboard', { replace: true });
      } else {
        navigate('/patient/dashboard', { replace: true });
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to log in. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2>Login to Your Account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Login As</label>
          <div className="role-selector">
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="patient"
                checked={role === 'patient'}
                onChange={(e) => setRole('patient')}
              />
              <span className="role-card">
                <span className="role-icon">👤</span>
                <span className="role-name">Patient</span>
              </span>
            </label>
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="doctor"
                checked={role === 'doctor'}
                onChange={(e) => setRole('doctor')}
              />
              <span className="role-card">
                <span className="role-icon">👨‍⚕️</span>
                <span className="role-name">Doctor</span>
              </span>
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={role === 'doctor' ? 'doctor@clinic.com' : 'patient@email.com'}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group form-check">
          <input
            type="checkbox"
            id="rememberMe"
            className="form-check-input"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe" className="form-check-label">Remember me</label>
        </div>
        
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? <div className="loading-spinner small"></div> : 'Login'}
        </button>
      </form>
      
      <div className="auth-footer">
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;