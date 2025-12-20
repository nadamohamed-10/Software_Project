import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePagination } from '../hooks/usePagination';
import LazyImage from '../components/common/LazyImage';
import '../styles/pages/MedicalRecords.css';

const MedicalRecords: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'consultations' | 'images'>('consultations');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  
  const confirmUpload = () => {
    if (!selectedFile) return;
    
    const newImage = {
      id: Date.now().toString(),
      name: selectedFile.name,
      date: new Date().toISOString().split('T')[0],
      type: selectedFile.type.split('/')[1].toUpperCase(),
      size: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB'
    };
    
    setUploadedImages([newImage, ...uploadedImages]);
    setShowUploadModal(false);
    setSelectedFile(null);
    alert('Medical image uploaded successfully!');
  };
  
  // Mock data for medical records
  const consultationRecords = [
    {
      id: '1',
      doctorName: 'Dr. Ahmed Nabil',
      date: '2025-12-15',
      symptoms: 'Routine annual checkup with no major complaints',
      diagnosis: 'Normal physical examination results. Blood pressure and cholesterol levels within normal range.',
      notes: 'Patient is in good health. Recommended to continue current exercise routine and diet.',
      prescriptions: ['Multivitamin supplement - Once daily']
    },
    {
      id: '2',
      doctorName: 'Dr. Ahmed Nabil',
      date: '2025-12-10',
      symptoms: 'Intermittent chest discomfort during physical activity',
      diagnosis: 'Minor cardiac irregularity, likely stress-related',
      notes: 'Ordered ECG and stress test. Prescribed beta-blocker medication.',
      prescriptions: ['Metoprolol 25mg - Twice daily']
    },
    {
      id: '3',
      doctorName: 'Dr. Ahmed Nabil',
      date: '2025-12-05',
      symptoms: 'Persistent headache and dizziness',
      diagnosis: 'Tension headaches, possibly stress-related',
      notes: 'Recommended relaxation techniques and over-the-counter pain relief as needed.',
      prescriptions: ['Ibuprofen 200mg - As needed']
    },
    {
      id: '4',
      doctorName: 'Dr. Ahmed Nabil',
      date: '2025-11-20',
      symptoms: 'Joint pain and stiffness',
      diagnosis: 'Early signs of arthritis',
      notes: 'Physical therapy referral and anti-inflammatory medication prescribed.',
      prescriptions: ['Naproxen 250mg - Twice daily']
    },
    {
      id: '5',
      doctorName: 'Dr. Ahmed Nabil',
      date: '2025-11-15',
      symptoms: 'Skin rash and itching',
      diagnosis: 'Allergic dermatitis',
      notes: 'Topical corticosteroid cream prescribed and allergen avoidance recommended.',
      prescriptions: ['Hydrocortisone cream - Apply twice daily']
    }
  ];
  
  // Use pagination for consultation records
  const paginatedConsultations = usePagination({
    data: consultationRecords,
    itemsPerPage: 3
  });
  
  const medicalImages = [
    {
      id: '1',
      name: 'ECG_Report_Dec2025.pdf',
      date: '2025-12-10',
      type: 'PDF',
      size: '1.2 MB'
    },
    {
      id: '2',
      name: 'XRay_Chest_Dec2025.jpg',
      date: '2025-12-10',
      type: 'JPG',
      size: '3.4 MB'
    },
    {
      id: '3',
      name: 'MRI_Brain_Nov2025.dcm',
      date: '2025-11-25',
      type: 'DICOM',
      size: '15.7 MB'
    },
    {
      id: '4',
      name: 'Ultrasound_Abdomen_Nov2025.png',
      date: '2025-11-20',
      type: 'PNG',
      size: '2.1 MB'
    }
  ];

  return (
    <div className="medical-records-page">
      <div className="page-header">
        <h1>Medical Records</h1>
        {user?.role === 'Patient' && activeTab === 'images' && (
          <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
            Upload Medical Image
          </button>
        )}
      </div>
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Upload Medical Image</h2>
            <div className="form-group">
              <label>Select File (X-ray, MRI, CT scan, etc.)</label>
              <input 
                type="file" 
                className="form-control"
                accept="image/*,.pdf,.dcm"
                onChange={handleFileUpload}
              />
              {selectedFile && (
                <p style={{ marginTop: '10px' }}>
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowUploadModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmUpload} disabled={!selectedFile}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'consultations' ? 'active' : ''}`}
          onClick={() => setActiveTab('consultations')}
        >
          Consultations
        </button>
        <button 
          className={`tab ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          Medical Images
        </button>
      </div>
      
      {activeTab === 'consultations' && (
        <div className="records-list">
          {paginatedConsultations.currentItems.map(record => (
            <div key={record.id} className="card record-card">
              <div className="card-header">
                <h3>Consultation with {record.doctorName}</h3>
                <p className="text-muted">Date: {record.date}</p>
              </div>
              <div className="card-body">
                <div className="record-section">
                  <h4>Symptoms</h4>
                  <p>{record.symptoms}</p>
                </div>
                
                <div className="record-section">
                  <h4>Diagnosis</h4>
                  <p>{record.diagnosis}</p>
                </div>
                
                <div className="record-section">
                  <h4>Notes</h4>
                  <p>{record.notes}</p>
                </div>
                
                {record.prescriptions.length > 0 && (
                  <div className="record-section">
                    <h4>Prescriptions</h4>
                    <ul className="prescription-list">
                      {record.prescriptions.map((prescription, index) => (
                        <li key={index}>{prescription}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {consultationRecords.length === 0 && (
            <div className="empty-state">
              <p>No consultation records found.</p>
            </div>
          )}
          
          {consultationRecords.length > 0 && (
            <div className="pagination-controls">
              <button 
                className="btn btn-outline"
                onClick={paginatedConsultations.prevPage}
                disabled={!paginatedConsultations.hasPrevPage}
              >
                Previous
              </button>
              <span>
                Page {paginatedConsultations.currentPage} of {paginatedConsultations.totalPages}
              </span>
              <button 
                className="btn btn-outline"
                onClick={paginatedConsultations.nextPage}
                disabled={!paginatedConsultations.hasNextPage}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'images' && (
        <div className="records-list">
          {[...uploadedImages, ...medicalImages].map(image => (
            <div key={image.id} className="card image-card">
              <div className="card-body">
                <div className="image-info">
                  <div className="image-icon">
                    {image.type === 'PDF' ? '📄' : '🖼️'}
                  </div>
                  <div className="image-details">
                    <h4>{image.name}</h4>
                    <p className="text-muted">Uploaded on {image.date}</p>
                    <p className="text-muted">{image.size}</p>
                  </div>
                </div>
                <div className="image-actions">
                  <button className="btn btn-outline">Download</button>
                  <button className="btn btn-outline">View</button>
                </div>
              </div>
            </div>
          ))}
          
          {uploadedImages.length === 0 && medicalImages.length === 0 && (
            <div className="empty-state">
              <p>No medical images found. Upload your X-rays, MRI, or CT scans.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;