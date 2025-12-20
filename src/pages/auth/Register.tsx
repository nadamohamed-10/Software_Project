import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validatePhoneNumber, validateName, validatePassword } from '../../utils/security';
import '../../styles/pages/Auth.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'Patient' as 'Patient' | 'Doctor',
    gender: '' as 'Male' | 'Female' | 'Other' | '',
    dateOfBirth: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }
    
    // First name validation
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (!validateName(formData.firstName)) {
      newErrors.firstName = 'First name must be between 2 and 50 characters and contain only letters';
    }
    
    // Last name validation
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (!validateName(formData.lastName)) {
      newErrors.lastName = 'Last name must be between 2 and 50 characters and contain only letters';
    }
    
    // Phone number validation (Egyptian format)
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid Egyptian phone number format';
    }
    
    // Gender validation (required for patients)
    if (formData.role === 'Patient' && !formData.gender) {
      newErrors.gender = 'Gender is required for patients';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        ...(formData.role === 'Patient' && {
          gender: formData.gender as 'Male' | 'Female' | 'Other',
          dateOfBirth: formData.dateOfBirth
        })
      });
      
      navigate('/patient/dashboard');
    } catch (err) {
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h2>Create an Account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName" className="form-label">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phoneNumber" className="form-label">Phone Number *</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
            placeholder="+20XXXXXXXXX or 01XXXXXXXX"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="role" className="form-label">Role *</label>
          <select
            id="role"
            name="role"
            className="form-control"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
          </select>
        </div>
        
        {formData.role === 'Patient' && (
          <>
            <div className="form-group">
              <label htmlFor="gender" className="form-label">Gender *</label>
              <select
                id="gender"
                name="gender"
                className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <div className="text-danger">{errors.gender}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                className="form-control"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? <div className="loading-spinner small"></div> : 'Register'}
        </button>
      </form>
      
      <div className="auth-footer">
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
};

export default Register;