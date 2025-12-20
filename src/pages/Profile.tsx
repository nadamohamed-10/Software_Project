import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/Profile.css';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    // Patient specific fields
    gender: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    medicalHistory: {
      allergies: '',
      chronicConditions: '',
      currentMedications: '',
      pastSurgeries: '',
      familyHistory: ''
    },
    // Doctor specific fields
    specialization: '',
    licenseNumber: '',
    experience: '',
    education: '',
    bio: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicalHistoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage for persistence
    localStorage.setItem(`profile_${user?.email}`, JSON.stringify(formData));
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  // Load saved profile data
  React.useEffect(() => {
    if (user?.email) {
      const savedProfile = localStorage.getItem(`profile_${user.email}`);
      if (savedProfile) {
        setFormData(prev => ({ ...prev, ...JSON.parse(savedProfile) }));
      }
    }
  }, [user]);

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Profile</h1>
        <button 
          className="btn btn-outline"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      
      <div className="profile-content">
        <div className="card">
          <div className="card-header">
            <h2>Personal Information</h2>
          </div>
          <div className="card-body">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="form-control"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-control"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="form-control"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                
                {user?.role === 'Patient' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="gender" className="form-label">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        className="form-control"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        className="form-control"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}
                
                {user?.role === 'Doctor' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="specialization" className="form-label">Specialization</label>
                      <input
                        type="text"
                        id="specialization"
                        name="specialization"
                        className="form-control"
                        value={formData.specialization}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="licenseNumber" className="form-label">License Number</label>
                      <input
                        type="text"
                        id="licenseNumber"
                        name="licenseNumber"
                        className="form-control"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}
                
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{user?.firstName} {user?.lastName}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user?.email}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{user?.phoneNumber}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Role:</span>
                  <span className="info-value">{user?.role}</span>
                </div>
                
                {user?.role === 'Patient' && (
                  <>
                    <div className="info-row">
                      <span className="info-label">Gender:</span>
                      <span className="info-value">{formData.gender || 'Not specified'}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="info-label">Date of Birth:</span>
                      <span className="info-value">{formData.dateOfBirth || 'Not specified'}</span>
                    </div>
                  </>
                )}
                
                {user?.role === 'Doctor' && (
                  <>
                    <div className="info-row">
                      <span className="info-label">Specialization:</span>
                      <span className="info-value">{formData.specialization || 'Not specified'}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="info-label">License Number:</span>
                      <span className="info-value">{formData.licenseNumber || 'Not specified'}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        {user?.role === 'Patient' && (
          <div className="card">
            <div className="card-header">
              <h2>Medical History</h2>
            </div>
            <div className="card-body">
              {isEditing ? (
                <form>
                  <div className="form-group">
                    <label htmlFor="allergies" className="form-label">Allergies</label>
                    <textarea
                      id="allergies"
                      name="allergies"
                      className="form-control"
                      rows={3}
                      value={formData.medicalHistory.allergies}
                      onChange={handleMedicalHistoryChange}
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="chronicConditions" className="form-label">Chronic Conditions</label>
                    <textarea
                      id="chronicConditions"
                      name="chronicConditions"
                      className="form-control"
                      rows={3}
                      value={formData.medicalHistory.chronicConditions}
                      onChange={handleMedicalHistoryChange}
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="currentMedications" className="form-label">Current Medications</label>
                    <textarea
                      id="currentMedications"
                      name="currentMedications"
                      className="form-control"
                      rows={3}
                      value={formData.medicalHistory.currentMedications}
                      onChange={handleMedicalHistoryChange}
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="pastSurgeries" className="form-label">Past Surgeries</label>
                    <textarea
                      id="pastSurgeries"
                      name="pastSurgeries"
                      className="form-control"
                      rows={3}
                      value={formData.medicalHistory.pastSurgeries}
                      onChange={handleMedicalHistoryChange}
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="familyHistory" className="form-label">Family History</label>
                    <textarea
                      id="familyHistory"
                      name="familyHistory"
                      className="form-control"
                      rows={3}
                      value={formData.medicalHistory.familyHistory}
                      onChange={handleMedicalHistoryChange}
                    ></textarea>
                  </div>
                  
                  <button type="button" className="btn btn-primary">Save Medical History</button>
                </form>
              ) : (
                <div className="medical-history-info">
                  <div className="info-row">
                    <span className="info-label">Allergies:</span>
                    <span className="info-value">{formData.medicalHistory.allergies || 'None reported'}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Chronic Conditions:</span>
                    <span className="info-value">{formData.medicalHistory.chronicConditions || 'None reported'}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Current Medications:</span>
                    <span className="info-value">{formData.medicalHistory.currentMedications || 'None reported'}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Past Surgeries:</span>
                    <span className="info-value">{formData.medicalHistory.pastSurgeries || 'None reported'}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Family History:</span>
                    <span className="info-value">{formData.medicalHistory.familyHistory || 'None reported'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;