import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import apiService, { Appointment, Prescription, MedicalRecord } from '../../services/api';
import '../../styles/pages/PatientDashboard.css';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Mock data for testing - replace with actual API calls when backend is ready
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          patientId: user.id,
          doctorId: 'doc1',
          date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          time: '10:00 AM',
          status: 'Confirmed',
          reason: 'Follow-up consultation',
          doctorName: 'Ahmed Nabil',
          specialty: 'Orthopedic'
        }
      ];

      const mockPrescriptions: Prescription[] = [
        {
          id: '1',
          patientId: user.id,
          doctorId: 'doc1',
          medication: 'Ibuprofen',
          dosage: '400mg',
          frequency: 'Twice daily',
          duration: '7 days',
          instructions: 'Take with food',
          status: 'ReadyForPickup',
          dateIssued: new Date().toISOString(),
          doctorName: 'Ahmed Nabil'
        }
      ];

      const mockRecords: MedicalRecord[] = [
        {
          id: '1',
          patientId: user.id,
          doctorId: 'doc1',
          date: new Date().toISOString(),
          symptoms: 'Knee pain',
          diagnosis: 'Mild arthritis',
          notes: 'Recommended physical therapy',
          prescriptions: []
        }
      ];

      setAppointments(mockAppointments);
      setPrescriptions(mockPrescriptions);
      setMedicalRecords(mockRecords);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments
    .filter(apt => ['Scheduled', 'Confirmed', 'CheckedIn'].includes(apt.status))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const recentPrescriptions = prescriptions
    .filter(p => p.status !== 'Expired')
    .sort((a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime())
    .slice(0, 3);

  const recentRecords = medicalRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const handleReschedule = (appointmentId: string) => {
    navigate(`/appointments?reschedule=${appointmentId}`);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await apiService.updateAppointment(appointmentId, { status: 'Cancelled' });
      await loadDashboardData();
      
      addNotification({
        type: 'appointment',
        title: 'Appointment Cancelled',
        message: 'Your appointment has been cancelled successfully'
      });
    } catch (error) {
      addNotification({
        type: 'alert',
        title: 'Error',
        message: 'Failed to cancel appointment'
      });
    }
  };

  const downloadPrescription = async (prescriptionId: string) => {
    // Mock PDF download - replace with actual API call
    addNotification({
      type: 'prescription',
      title: 'Download Started',
      message: 'Your prescription is being downloaded'
    });
  };

  if (loading) {
    return (
      <div className="patient-dashboard">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Patient Dashboard</h1>
          <p>Welcome back, {user?.firstName} {user?.lastName}</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/appointments?book=true')}
          >
            Book Appointment
          </button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="dashboard-stats">
        <div className="stat-card" onClick={() => navigate('/appointments')}>
          <h3>Upcoming Appointments</h3>
          <p className="stat-number">{upcomingAppointments.length}</p>
          {upcomingAppointments.length > 0 && (
            <p className="stat-label">
              Next: {new Date(upcomingAppointments[0].date).toLocaleDateString()} at {upcomingAppointments[0].time}
            </p>
          )}
        </div>
        
        <div className="stat-card" onClick={() => navigate('/prescriptions')}>
          <h3>Active Prescriptions</h3>
          <p className="stat-number">
            {prescriptions.filter(p => ['Pending', 'Processing', 'ReadyForPickup'].includes(p.status)).length}
          </p>
          {recentPrescriptions.length > 0 && (
            <p className="stat-label">
              Latest: {new Date(recentPrescriptions[0].dateIssued).toLocaleDateString()}
            </p>
          )}
        </div>
        
        <div className="stat-card" onClick={() => navigate('/medical-records')}>
          <h3>Medical Records</h3>
          <p className="stat-number">{medicalRecords.length}</p>
          {recentRecords.length > 0 && (
            <p className="stat-label">
              Updated: {new Date(recentRecords[0].date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Upcoming Appointments */}
        <div className="card">
          <div className="card-header">
            <h2>Upcoming Appointments</h2>
            <button 
              className="btn btn-sm btn-outline"
              onClick={() => navigate('/appointments')}
            >
              View All
            </button>
          </div>
          <div className="card-body">
            {upcomingAppointments.length === 0 ? (
              <div className="empty-state">
                <p>No upcoming appointments</p>
              </div>
            ) : (
              <div className="appointments-list">
                {upcomingAppointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="appointment-item">
                    <div className="appointment-info">
                      <h4>Dr. {appointment.doctorName}</h4>
                      <p className="specialty">{appointment.specialty}</p>
                      <p className="date-time">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                      <p className="reason">{appointment.reason || 'General Consultation'}</p>
                      <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="appointment-actions">
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleReschedule(appointment.id)}
                      >
                        Reschedule
                      </button>
                      <button 
                        className="btn btn-sm btn-outline danger"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Prescriptions</h2>
            <button 
              className="btn btn-sm btn-outline"
              onClick={() => navigate('/prescriptions')}
            >
              View All
            </button>
          </div>
          <div className="card-body">
            {recentPrescriptions.length === 0 ? (
              <div className="empty-state">
                <p>No prescriptions found</p>
              </div>
            ) : (
              <div className="prescriptions-list">
                {recentPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="prescription-item">
                    <div className="prescription-info">
                      <h4>{prescription.medication}</h4>
                      <p>Prescribed by: Dr. {prescription.doctorName}</p>
                      <p className="dosage">{prescription.dosage} - {prescription.frequency}</p>
                      <p className="date">
                        Issued: {new Date(prescription.dateIssued).toLocaleDateString()}
                      </p>
                      <span className={`status-badge ${prescription.status.toLowerCase()}`}>
                        {prescription.status}
                      </span>
                    </div>
                    <div className="prescription-actions">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => downloadPrescription(prescription.id)}
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Medical Records */}
        <div className="card full-width">
          <div className="card-header">
            <h2>Recent Medical Records</h2>
            <button 
              className="btn btn-sm btn-outline"
              onClick={() => navigate('/medical-records')}
            >
              View All
            </button>
          </div>
          <div className="card-body">
            {recentRecords.length === 0 ? (
              <div className="empty-state">
                <p>No medical records found</p>
              </div>
            ) : (
              <div className="records-list">
                {recentRecords.map((record) => (
                  <div key={record.id} className="record-item">
                    <div className="record-date">
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                    <div className="record-content">
                      <h4>Consultation</h4>
                      <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                      <p><strong>Symptoms:</strong> {record.symptoms}</p>
                      {record.notes && (
                        <p className="notes">{record.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="card-body">
            <div className="quick-actions">
              <button 
                className="action-button"
                onClick={() => navigate('/profile')}
              >
                <span className="action-icon">👤</span>
                <span>Edit Profile</span>
              </button>
              <button 
                className="action-button"
                onClick={() => navigate('/medical-records?upload=true')}
              >
                <span className="action-icon">📤</span>
                <span>Upload Medical Images</span>
              </button>
              <button 
                className="action-button"
                onClick={() => navigate('/appointments?book=true')}
              >
                <span className="action-icon">📅</span>
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;