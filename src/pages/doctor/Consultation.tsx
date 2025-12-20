import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import apiService, { MedicalRecord, Prescription } from '../../services/api';
import '../../styles/pages/Consultation.css';

interface PatientInfo {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  medicalHistory?: string;
}

interface ConsultationData {
  symptoms: string;
  diagnosis: string;
  notes: string;
}

const Consultation: React.FC = () => {
  const { patientId, appointmentId } = useParams<{ patientId: string; appointmentId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    symptoms: '',
    diagnosis: '',
    notes: ''
  });
  const [pastConsultations, setPastConsultations] = useState<MedicalRecord[]>([]);
  const [medicalImages, setMedicalImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [consultationStartTime] = useState(new Date());
  const [timer, setTimer] = useState(0);
  const [editingMedicalHistory, setEditingMedicalHistory] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState('');
  const [activeSection, setActiveSection] = useState<'patient-info' | 'medical-history' | 'past-consultations' | 'current-consultation' | 'prescription'>('patient-info');

  // Timer update every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(calculateConsultationDuration());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    if (!patientId) return;

    console.log('Loading patient data for:', patientId);
    setLoading(true);
    try {
      // Mock patient data
      const mockPatient: PatientInfo = {
        id: patientId,
        firstName: 'Adel',
        lastName: 'Ahmed',
        dateOfBirth: '1985-05-15',
        gender: 'Male',
        phoneNumber: '+201234567890',
        email: 'Adel.Ahmed@gmail.com',
        medicalHistory: 'Previous orthopedic surgery on left knee (2020)\nAllergies: Penicillin\nChronic conditions: None'
      };
      
      setPatient(mockPatient);
      setMedicalHistory(mockPatient.medicalHistory || '');

      // Mock past consultations
      const mockConsultations: MedicalRecord[] = [
        {
          id: '1',
          patientId: patientId,
          doctorId: user?.id || 'doc1',
          date: new Date(Date.now() - 86400000 * 30).toISOString(),
          symptoms: 'Knee pain and stiffness',
          diagnosis: 'Mild osteoarthritis',
          notes: 'Recommended physical therapy and anti-inflammatory medication',
          prescriptions: ['Ibuprofen 400mg']
        }
      ];
      setPastConsultations(mockConsultations);

      // Mock medical images
      setMedicalImages(['xray_knee_left.jpg', 'mri_knee.jpg']);
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ConsultationData, value: string) => {
    setConsultationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateConsultationDuration = () => {
    const now = new Date();
    const duration = Math.floor((now.getTime() - consultationStartTime.getTime()) / 1000 / 60);
    return duration;
  };

  const saveConsultation = async (action: 'save' | 'save-prescription') => {
    if (!patient || !user) return;

    if (!consultationData.symptoms || !consultationData.diagnosis) {
      alert('Please fill in symptoms and diagnosis');
      return;
    }

    setSaving(true);
    try {
      const record: Omit<MedicalRecord, 'id'> = {
        patientId: patient.id,
        doctorId: user.id,
        date: new Date().toISOString(),
        symptoms: consultationData.symptoms,
        diagnosis: consultationData.diagnosis,
        notes: consultationData.notes,
        prescriptions: []
      };

      // Save to localStorage for mock
      const saved = JSON.parse(localStorage.getItem('consultations') || '[]');
      saved.push({ id: Date.now().toString(), ...record });
      localStorage.setItem('consultations', JSON.stringify(saved));

      alert('Consultation saved successfully!');

      if (action === 'save-prescription') {
        navigate(`/doctor/prescription/${patient.id}`);
      } else {
        navigate('/doctor/dashboard');
      }
    } catch (error) {
      alert('Failed to save consultation');
    } finally {
      setSaving(false);
    }
  };

  const endConsultation = () => {
    const duration = calculateConsultationDuration();
    if (window.confirm(`End consultation? Duration: ${duration} minutes`)) {
      navigate('/doctor/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="consultation-page">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="consultation-page">
        <div className="alert alert-danger">Patient not found</div>
      </div>
    );
  }

  return (
    <div className="consultation-page">
      {/* Header */}
      <div className="consultation-header">
        <div className="patient-info-header">
          <h1>Consultation: {patient.firstName} {patient.lastName}</h1>
          <span className="consultation-timer">
            ⏱️ Duration: {timer} minutes
          </span>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={endConsultation}>
            End Consultation
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="consultation-tabs">
        <button 
          className={`tab ${activeSection === 'patient-info' ? 'active' : ''}`}
          onClick={() => setActiveSection('patient-info')}
        >
          👤 Patient Info
        </button>
        <button 
          className={`tab ${activeSection === 'medical-history' ? 'active' : ''}`}
          onClick={() => setActiveSection('medical-history')}
        >
          📋 Medical History
        </button>
        <button 
          className={`tab ${activeSection === 'past-consultations' ? 'active' : ''}`}
          onClick={() => setActiveSection('past-consultations')}
        >
          📚 Past Consultations
        </button>
        <button 
          className={`tab ${activeSection === 'current-consultation' ? 'active' : ''}`}
          onClick={() => setActiveSection('current-consultation')}
        >
          📝 Current Consultation
        </button>
        <button 
          className={`tab ${activeSection === 'prescription' ? 'active' : ''}`}
          onClick={() => setActiveSection('prescription')}
        >
          💊 Add Prescription
        </button>
      </div>

      {/* Patient Information Section */}
      {activeSection === 'patient-info' && (
        <div className="consultation-section">
          <div className="section-container">
            <div className="section-header">
              <h2>Patient Information</h2>
            </div>
            <div className="info-grid">
              <div className="info-card">
                <label>Full Name</label>
                <span>{patient.firstName} {patient.lastName}</span>
              </div>
              <div className="info-card">
                <label>Date of Birth</label>
                <span>{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
              </div>
              <div className="info-card">
                <label>Gender</label>
                <span>{patient.gender}</span>
              </div>
              <div className="info-card">
                <label>Phone</label>
                <span>{patient.phoneNumber}</span>
              </div>
              <div className="info-card">
                <label>Email</label>
                <span>{patient.email}</span>
              </div>
              <div className="info-card">
                <label>Age</label>
                <span>{new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years</span>
              </div>
            </div>
            
            <div className="section-header" style={{ marginTop: '2rem' }}>
              <h2>Medical Images</h2>
            </div>
            {medicalImages.length === 0 ? (
              <p className="text-muted">No medical images uploaded</p>
            ) : (
              <div className="medical-images-grid">
                {medicalImages.map((image, index) => (
                  <div key={index} className="medical-image-card">
                    <div className="image-icon">🖼️</div>
                    <div className="image-name">{image}</div>
                    <button className="btn btn-sm btn-outline">View</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Medical History Section */}
      {activeSection === 'medical-history' && (
        <div className="consultation-section">
          <div className="section-container">
            <div className="section-header">
              <h2>Medical History</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setEditingMedicalHistory(!editingMedicalHistory)}
              >
                {editingMedicalHistory ? '❌ Cancel' : '✏️ Edit'}
              </button>
            </div>
            <textarea
              className="form-control large-textarea"
              rows={12}
              value={editingMedicalHistory ? medicalHistory : (patient.medicalHistory || '')}
              onChange={(e) => setMedicalHistory(e.target.value)}
              readOnly={!editingMedicalHistory}
              placeholder="No medical history recorded"
            />
            {editingMedicalHistory && (
              <button 
                className="btn btn-primary btn-large"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  if (patient) {
                    patient.medicalHistory = medicalHistory;
                    localStorage.setItem(`patient_${patient.id}_history`, medicalHistory);
                    setEditingMedicalHistory(false);
                    alert('Medical history updated successfully!');
                  }
                }}
              >
                💾 Save Changes
              </button>
            )}
          </div>
        </div>
      )}

      {/* Past Consultations Section */}
      {activeSection === 'past-consultations' && (
        <div className="consultation-section">
          <div className="section-container">
            <div className="section-header">
              <h2>Past Consultations</h2>
            </div>
            {pastConsultations.length === 0 ? (
              <div className="empty-state">
                <p>No past consultations found</p>
              </div>
            ) : (
              <div className="past-consultations-list">
                {pastConsultations.map((consultation) => (
                  <div key={consultation.id} className="consultation-card">
                    <div className="consultation-date-badge">
                      📅 {new Date(consultation.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="consultation-content">
                      <div className="consultation-field">
                        <strong>Symptoms:</strong>
                        <p>{consultation.symptoms}</p>
                      </div>
                      <div className="consultation-field">
                        <strong>Diagnosis:</strong>
                        <p>{consultation.diagnosis}</p>
                      </div>
                      <div className="consultation-field">
                        <strong>Notes:</strong>
                        <p>{consultation.notes}</p>
                      </div>
                      {consultation.prescriptions && consultation.prescriptions.length > 0 && (
                        <div className="consultation-field">
                          <strong>Prescriptions:</strong>
                          <ul>
                            {consultation.prescriptions.map((rx, idx) => (
                              <li key={idx}>{rx}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current Consultation Section */}
      {activeSection === 'current-consultation' && (
        <div className="consultation-section">
          <div className="section-container">
            <div className="section-header">
              <h2>Current Consultation</h2>
            </div>
            <div className="consultation-form">
              <div className="form-group">
                <label htmlFor="symptoms" className="form-label">
                  Symptoms *
                </label>
                <textarea
                  id="symptoms"
                  className="form-control"
                  rows={5}
                  value={consultationData.symptoms}
                  onChange={(e) => handleInputChange('symptoms', e.target.value)}
                  placeholder="Enter patient symptoms..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="diagnosis" className="form-label">
                  Diagnosis *
                </label>
                <textarea
                  id="diagnosis"
                  className="form-control"
                  rows={5}
                  value={consultationData.diagnosis}
                  onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                  placeholder="Enter diagnosis..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes" className="form-label">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  className="form-control"
                  rows={6}
                  value={consultationData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter additional notes, recommendations, or follow-up instructions..."
                />
              </div>

              <div className="consultation-actions">
                <button
                  className="btn btn-outline btn-large"
                  onClick={() => saveConsultation('save')}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : '💾 Save Consultation'}
                </button>
                <button
                  className="btn btn-primary btn-large"
                  onClick={() => saveConsultation('save-prescription')}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : '💊 Save & Add Prescription'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Section */}
      {activeSection === 'prescription' && (
        <div className="consultation-section">
          <div className="section-container">
            <div className="prescription-actions">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => {
                  navigate(`/doctor/prescription/${patient.id}`);
                }}
              >
                💊 Add New Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultation;
