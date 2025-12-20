import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import '../../styles/pages/PrescriptionCreator.css';

interface Drug {
  id: string;
  name: string;
  type: 'frequent' | 'custom';
  defaultDosage?: string;
  defaultFrequency?: string;
}

interface PrescriptionDrug {
  id: string;
  drugId: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

const PrescriptionCreator: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Drug library
  const [frequentDrugs] = useState<Drug[]>([
    { id: '1', name: 'Paracetamol 500mg', type: 'frequent', defaultDosage: '1 tablet', defaultFrequency: 'Every 6 hours' },
    { id: '2', name: 'Ibuprofen 400mg', type: 'frequent', defaultDosage: '1 tablet', defaultFrequency: 'Every 8 hours' },
    { id: '3', name: 'Amoxicillin 500mg', type: 'frequent', defaultDosage: '1 capsule', defaultFrequency: 'Every 8 hours' },
    { id: '4', name: 'Omeprazole 20mg', type: 'frequent', defaultDosage: '1 capsule', defaultFrequency: 'Once daily' },
    { id: '5', name: 'Diclofenac 50mg', type: 'frequent', defaultDosage: '1 tablet', defaultFrequency: 'Every 12 hours' },
  ]);

  const [customDrugs, setCustomDrugs] = useState<Drug[]>([]);
  const [prescriptionDrugs, setPrescriptionDrugs] = useState<PrescriptionDrug[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<PrescriptionDrug | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDrugName, setNewDrugName] = useState('');
  const [draggedDrug, setDraggedDrug] = useState<Drug | null>(null);
  const [saving, setSaving] = useState(false);

  const filteredDrugs = [...frequentDrugs, ...customDrugs].filter(drug =>
    drug.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragStart = (drug: Drug) => {
    setDraggedDrug(drug);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedDrug) {
      addDrugToPrescription(draggedDrug);
      setDraggedDrug(null);
    }
  };

  const addDrugToPrescription = (drug: Drug) => {
    const newDrug: PrescriptionDrug = {
      id: Date.now().toString(),
      drugId: drug.id,
      name: drug.name,
      dosage: drug.defaultDosage || '',
      frequency: drug.defaultFrequency || '',
      duration: '7 days',
      instructions: 'Take after meals'
    };
    setPrescriptionDrugs([...prescriptionDrugs, newDrug]);
    setSelectedDrug(newDrug);
  };

  const removeDrug = (id: string) => {
    setPrescriptionDrugs(prescriptionDrugs.filter(drug => drug.id !== id));
    if (selectedDrug?.id === id) {
      setSelectedDrug(null);
    }
  };

  const updateSelectedDrug = (field: keyof PrescriptionDrug, value: string) => {
    if (!selectedDrug) return;

    const updated = { ...selectedDrug, [field]: value };
    setSelectedDrug(updated);
    setPrescriptionDrugs(prescriptionDrugs.map(drug =>
      drug.id === updated.id ? updated : drug
    ));
  };

  const addCustomDrug = () => {
    if (!newDrugName.trim()) return;

    const newDrug: Drug = {
      id: Date.now().toString(),
      name: newDrugName,
      type: 'custom'
    };
    setCustomDrugs([...customDrugs, newDrug]);
    setNewDrugName('');
  };

  const savePrescription = async (action: 'save' | 'save-print' | 'save-send') => {
    if (prescriptionDrugs.length === 0) {
      addNotification({
        type: 'alert',
        title: 'Validation Error',
        message: 'Please add at least one medication to the prescription'
      });
      return;
    }

    setSaving(true);
    try {
      // Save prescription via API
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));

      addNotification({
        type: 'prescription',
        title: 'Prescription Created',
        message: `Prescription created successfully`
      });

      if (action === 'save-print') {
        // Trigger print functionality
        window.print();
      } else if (action === 'save-send') {
        // Send to patient
        addNotification({
          type: 'prescription',
          title: 'Prescription Sent',
          message: 'Prescription has been sent to the patient'
        });
      }

      navigate('/doctor/dashboard');
    } catch (error) {
      addNotification({
        type: 'alert',
        title: 'Error',
        message: 'Failed to save prescription'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="prescription-creator">
      {/* Header */}
      <div className="prescription-header">
        <h1>Create Prescription</h1>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button 
            className="btn btn-outline" 
            onClick={() => savePrescription('save')}
            disabled={saving || prescriptionDrugs.length === 0}
          >
            Save
          </button>
          <button 
            className="btn btn-outline" 
            onClick={() => savePrescription('save-print')}
            disabled={saving || prescriptionDrugs.length === 0}
          >
            Save & Print
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => savePrescription('save-send')}
            disabled={saving || prescriptionDrugs.length === 0}
          >
            Save & Send to Patient
          </button>
        </div>
      </div>

      {/* Three-panel layout */}
      <div className="prescription-layout">
        {/* Left Panel - Drug Library */}
        <div className="drug-library-panel">
          <div className="card">
            <div className="card-header">
              <h2>Drug Library</h2>
            </div>
            <div className="card-body">
              {/* Search */}
              <div className="search-box">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search drugs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Frequent Drugs */}
              <div className="drug-section">
                <h3>Frequent Medications</h3>
                <div className="drug-list">
                  {filteredDrugs.filter(d => d.type === 'frequent').map(drug => (
                    <div
                      key={drug.id}
                      className="drug-item"
                      draggable
                      onDragStart={() => handleDragStart(drug)}
                      onClick={() => addDrugToPrescription(drug)}
                    >
                      <span>{drug.name}</span>
                      <span className="drug-add-icon">+</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Drugs */}
              <div className="drug-section">
                <h3>Custom Medications</h3>
                <div className="add-custom-drug">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter drug name..."
                    value={newDrugName}
                    onChange={(e) => setNewDrugName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomDrug()}
                  />
                  <button className="btn btn-primary btn-sm" onClick={addCustomDrug}>
                    Add
                  </button>
                </div>
                <div className="drug-list">
                  {customDrugs.filter(d =>
                    d.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map(drug => (
                    <div
                      key={drug.id}
                      className="drug-item"
                      draggable
                      onDragStart={() => handleDragStart(drug)}
                      onClick={() => addDrugToPrescription(drug)}
                    >
                      <span>{drug.name}</span>
                      <span className="drug-add-icon">+</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Panel - Prescription List */}
        <div className="prescription-list-panel">
          <div className="card">
            <div className="card-header">
              <h2>Prescription</h2>
            </div>
            <div 
              className="card-body prescription-drop-zone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {prescriptionDrugs.length === 0 ? (
                <div className="empty-state">
                  <p>Drag medications here or click to add</p>
                  <p className="text-muted">No medications added yet</p>
                </div>
              ) : (
                <div className="prescription-drugs-list">
                  {prescriptionDrugs.map(drug => (
                    <div
                      key={drug.id}
                      className={`prescription-drug-item ${selectedDrug?.id === drug.id ? 'selected' : ''}`}
                      onClick={() => setSelectedDrug(drug)}
                    >
                      <div className="drug-info">
                        <h4>{drug.name}</h4>
                        <p>{drug.dosage} - {drug.frequency}</p>
                        <p className="text-muted">{drug.duration}</p>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDrug(drug.id);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Drug Details Editor */}
        <div className="drug-details-panel">
          <div className="card">
            <div className="card-header">
              <h2>Medication Details</h2>
            </div>
            <div className="card-body">
              {selectedDrug ? (
                <div className="drug-details-form">
                  <div className="form-group">
                    <label className="form-label">Medication Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedDrug.name}
                      onChange={(e) => updateSelectedDrug('name', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dosage</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., 1 tablet, 500mg"
                      value={selectedDrug.dosage}
                      onChange={(e) => updateSelectedDrug('dosage', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Frequency</label>
                    <select
                      className="form-control"
                      value={selectedDrug.frequency}
                      onChange={(e) => updateSelectedDrug('frequency', e.target.value)}
                    >
                      <option value="">Select frequency</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="Every 6 hours">Every 6 hours</option>
                      <option value="Every 8 hours">Every 8 hours</option>
                      <option value="Every 12 hours">Every 12 hours</option>
                      <option value="As needed">As needed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <select
                      className="form-control"
                      value={selectedDrug.duration}
                      onChange={(e) => updateSelectedDrug('duration', e.target.value)}
                    >
                      <option value="3 days">3 days</option>
                      <option value="5 days">5 days</option>
                      <option value="7 days">7 days</option>
                      <option value="10 days">10 days</option>
                      <option value="14 days">14 days</option>
                      <option value="30 days">30 days</option>
                      <option value="Until finished">Until finished</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Instructions</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="e.g., Take after meals"
                      value={selectedDrug.instructions}
                      onChange={(e) => updateSelectedDrug('instructions', e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>Select a medication to edit details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCreator;
