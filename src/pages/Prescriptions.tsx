import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/Prescriptions.css';

const Prescriptions: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  
  const downloadPDF = (prescriptionId: string, medicationName: string) => {
    // Mock PDF download - in real app, this would fetch from backend
    alert(`Downloading prescription PDF for ${medicationName}...`);
    // Simulate download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,Prescription PDF content');
    element.setAttribute('download', `prescription_${prescriptionId}.pdf`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const printPrescription = () => {
    window.print();
  };
  
  // Mock data for prescriptions
  const activePrescriptions = [
    {
      id: '1',
      medication: 'Amoxicillin 500mg',
      dosage: '1 capsule',
      frequency: 'Three times daily',
      duration: '7 days',
      instructions: 'Take with food to reduce stomach upset',
      doctor: 'Dr. Ahmed Nabil',
      dateIssued: '2025-12-15',
      status: 'Processing'
    },
    {
      id: '2',
      medication: 'Loratadine 10mg',
      dosage: '1 tablet',
      frequency: 'Once daily',
      duration: '14 days',
      instructions: 'Can be taken with or without food',
      doctor: 'Dr. Ahmed Nabil',
      dateIssued: '2025-12-10',
      status: 'Ready for Pickup'
    }
  ];
  
  const prescriptionHistory = [
    {
      id: '3',
      medication: 'Multivitamin',
      dosage: '1 tablet',
      frequency: 'Once daily',
      duration: '30 days',
      instructions: 'Take in the morning with breakfast',
      doctor: 'Dr. Ahmed Nabil',
      dateIssued: '2025-11-15',
      status: 'Dispensed'
    },
    {
      id: '4',
      medication: 'Ibuprofen 200mg',
      dosage: '1 tablet',
      frequency: 'As needed',
      duration: '7 days',
      instructions: 'Take with food. Maximum 3 tablets per day',
      doctor: 'Dr. Ahmed Nabil',
      dateIssued: '2025-11-10',
      status: 'Expired'
    }
  ];

  return (
    <div className="prescriptions-page">
      <div className="page-header">
        <h1>Prescriptions</h1>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>
      
      <div className="prescriptions-list">
        {(activeTab === 'active' ? activePrescriptions : prescriptionHistory).map(prescription => (
          <div key={prescription.id} className="card prescription-card">
            <div className="card-header">
              <h3>{prescription.medication}</h3>
              <span className={`status-badge ${prescription.status.toLowerCase().replace(' ', '-')}`}>
                {prescription.status}
              </span>
            </div>
            <div className="card-body">
              <div className="prescription-details">
                <div className="detail-row">
                  <span className="detail-label">Doctor:</span>
                  <span className="detail-value">{prescription.doctor}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Date Issued:</span>
                  <span className="detail-value">{prescription.dateIssued}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Dosage:</span>
                  <span className="detail-value">{prescription.dosage}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Frequency:</span>
                  <span className="detail-value">{prescription.frequency}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{prescription.duration}</span>
                </div>
                
                {prescription.instructions && (
                  <div className="detail-row">
                    <span className="detail-label">Instructions:</span>
                    <span className="detail-value">{prescription.instructions}</span>
                  </div>
                )}
              </div>
              
              <div className="prescription-actions">
                {activeTab === 'active' && (
                  <>
                    {prescription.status === 'Ready for Pickup' && (
                      <button className="btn btn-primary">Mark as Picked Up</button>
                    )}
                    <button 
                      className="btn btn-outline"
                      onClick={() => downloadPDF(prescription.id, prescription.medication)}
                    >
                      Download PDF
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={printPrescription}
                    >
                      Print
                    </button>
                  </>
                )}
                
                {activeTab === 'history' && (
                  <>
                    <button 
                      className="btn btn-outline"
                      onClick={() => downloadPDF(prescription.id, prescription.medication)}
                    >
                      Download PDF
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {((activeTab === 'active' && activePrescriptions.length === 0) || 
          (activeTab === 'history' && prescriptionHistory.length === 0)) && (
          <div className="empty-state">
            <p>No prescriptions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;