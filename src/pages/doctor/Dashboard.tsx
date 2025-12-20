import { useState } from 'react';

// Mock Arabic patient data
const mockArabicPatients = [
  {
    id: 'P001',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    arabicName: 'Ahmed Hassan',
    phone: '+20 123 456 7890',
    age: 35,
    gender: 'Male'
  },
  {
    id: 'P002',
    firstName: 'Fatima',
    lastName: 'Ali',
    arabicName: 'Fatima Ali',
    phone: '+20 100 234 5678',
    age: 28,
    gender: 'Female'
  },
  {
    id: 'P003',
    firstName: 'Mohamed',
    lastName: 'Ibrahim',
    arabicName: 'Mohamed Ibrahim',
    phone: '+20 111 345 6789',
    age: 42,
    gender: 'Male'
  },
  {
    id: 'P004',
    firstName: 'Nour',
    lastName: 'Khalil',
    arabicName: 'Nour Khalil',
    phone: '+20 122 456 7890',
    age: 31,
    gender: 'Female'
  }
];

const mockAppointments = [
  {
    id: 'A001',
    patientId: 'P001',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    status: 'Confirmed',
    reason: 'Knee pain and stiffness'
  },
  {
    id: 'A002',
    patientId: 'P002',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    status: 'CheckedIn',
    reason: 'Back pain evaluation'
  },
  {
    id: 'A003',
    patientId: 'P003',
    date: new Date().toISOString().split('T')[0],
    time: '02:00 PM',
    status: 'Scheduled',
    reason: 'Follow-up visit for shoulder injury'
  },
  {
    id: 'A004',
    patientId: 'P004',
    date: new Date().toISOString().split('T')[0],
    time: '03:30 PM',
    status: 'Confirmed',
    reason: 'Hip pain consultation'
  }
];

// Common medications library
const medicationLibrary = [
  { name: 'Paracetamol 500mg', defaultDosage: '1 tablet', defaultFrequency: 'Every 6 hours' },
  { name: 'Ibuprofen 400mg', defaultDosage: '1 tablet', defaultFrequency: 'Every 8 hours' },
  { name: 'Amoxicillin 500mg', defaultDosage: '1 capsule', defaultFrequency: 'Every 8 hours' },
  { name: 'Diclofenac 50mg', defaultDosage: '1 tablet', defaultFrequency: 'Twice daily' },
  { name: 'Omeprazole 20mg', defaultDosage: '1 capsule', defaultFrequency: 'Once daily' },
  { name: 'Naproxen 250mg', defaultDosage: '1 tablet', defaultFrequency: 'Twice daily' },
  { name: 'Metformin 500mg', defaultDosage: '1 tablet', defaultFrequency: 'Twice daily' },
  { name: 'Atorvastatin 20mg', defaultDosage: '1 tablet', defaultFrequency: 'Once daily at night' },
];

// ---- Types ----
type Patient = { id: string; firstName: string; lastName: string; arabicName?: string; phone?: string; age?: number; gender?: string };
type Appointment = { id: string; patientId: string; date: string; time: string; status: 'Scheduled'|'Confirmed'|'CheckedIn'|'InProgress'|'Completed'|'Cancelled'|string; reason?: string };
type Prescription = { id: number; name: string; dosage: string; frequency: string; duration: string; instructions?: string };
type ConsultationData = { symptoms: string; diagnosis: string; notes: string; prescriptions: Prescription[] };
type ConfirmDialog = { type: 'confirm'|'cancel'; appointment: Appointment; message: string };
type Medication = { name: string; defaultDosage?: string; defaultFrequency?: string };

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<(Appointment & { patient?: Patient }) | null>(null);
  const [showConsultationModal, setShowConsultationModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'consultation'|'prescription'>('consultation');
  const [consultationData, setConsultationData] = useState<ConsultationData>({
    symptoms: '',
    diagnosis: '',
    notes: '',
    prescriptions: []
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState<ConfirmDialog | null>(null);
  const [showAddMedicationModal, setShowAddMedicationModal] = useState<boolean>(false);
  const [medicationSearch, setMedicationSearch] = useState<string>('');
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [newMedicationForm, setNewMedicationForm] = useState<Omit<Prescription, 'id'>>({
    name: '',
    dosage: '',
    frequency: 'Twice daily',
    duration: '7 days',
    instructions: 'Take after meals'
  });

  const getPatientInfo = (patientId: string): Patient | undefined => {
    return mockArabicPatients.find((p) => p.id === patientId);
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string,string> = {
      'Scheduled': '#3b82f6',
      'Confirmed': '#10b981',
      'CheckedIn': '#f59e0b',
      'InProgress': '#8b5cf6',
      'Completed': '#6b7280',
      'Cancelled': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const handleConfirmAppointment = (appointment: Appointment) => {
    const patient = getPatientInfo(appointment.patientId);
    setShowConfirmDialog({
      type: 'confirm',
      appointment,
      message: `Confirm appointment for ${patient?.firstName ?? ''} ${patient?.lastName ?? ''}?`
    });
  };

  const confirmAction = () => {
    if (!showConfirmDialog) return;
    if (showConfirmDialog.type === 'confirm') {
      setAppointments(prev => prev.map(apt => 
        apt.id === showConfirmDialog.appointment.id 
          ? { ...apt, status: 'Confirmed' }
          : apt
      ));
    } else if (showConfirmDialog.type === 'cancel') {
      setAppointments(prev => prev.map(apt => 
        apt.id === showConfirmDialog.appointment.id 
          ? { ...apt, status: 'Cancelled' }
          : apt
      ));
    }
    setShowConfirmDialog(null);
  };

  const handleStartConsultation = (appointment: Appointment) => {
    const patient = getPatientInfo(appointment.patientId);
    setSelectedAppointment({ ...appointment, patient });
    setConsultationData({
      symptoms: appointment.reason || '',
      diagnosis: '',
      notes: '',
      prescriptions: []
    });
    setActiveTab('consultation');
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { ...apt, status: 'InProgress' }
        : apt
    ));
    setShowConsultationModal(true);
  };

  const handleOpenAddMedication = () => {
    setShowAddMedicationModal(true);
    setMedicationSearch('');
    setSelectedMedication(null);
    setNewMedicationForm({
      name: '',
      dosage: '',
      frequency: 'Twice daily',
      duration: '7 days',
      instructions: 'Take after meals'
    });
  };

  const handleSelectMedicationFromLibrary = (med: Medication) => {
    setSelectedMedication(med);
    setNewMedicationForm({
      name: med.name,
      dosage: med.defaultDosage || '',
      frequency: med.defaultFrequency || 'Twice daily',
      duration: '7 days',
      instructions: 'Take after meals'
    });
  };

  const handleAddMedicationToList = () => {
    if (!newMedicationForm.name || !newMedicationForm.dosage || !newMedicationForm.frequency) {
      alert('Please fill all required medication fields');
      return;
    }

    const newPrescription = {
      id: Date.now(),
      ...newMedicationForm
    };

    setConsultationData(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, newPrescription]
    }));

    setShowAddMedicationModal(false);
    setActiveTab('prescription');
    alert('Medication added successfully!');
  };

  const handleRemovePrescription = (id: number) => {
    setConsultationData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter(p => p.id !== id)
    }));
  };

  const handleSaveConsultation = () => {
    if (!consultationData.symptoms || !consultationData.diagnosis) {
      alert('Please fill in symptoms and diagnosis');
      return;
    }

    if (!selectedAppointment) {
      console.warn('No selected appointment when saving consultation');
      return;
    }

    const consultationRecord = {
      id: `C${Date.now()}`,
      appointmentId: selectedAppointment.id,
      patientId: selectedAppointment.patientId,
      date: new Date().toISOString(),
      ...consultationData
    };

    console.log('Consultation saved:', consultationRecord);

    setAppointments(prev => prev.map(apt => 
      apt.id === selectedAppointment.id 
        ? { ...apt, status: 'Completed' }
        : apt
    ));

    setShowConsultationModal(false);
    setSelectedAppointment(null);
    setConsultationData({ symptoms: '', diagnosis: '', notes: '', prescriptions: [] });
    
    alert('Consultation saved successfully!');
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    const patient = getPatientInfo(appointment.patientId);
    setShowConfirmDialog({
      type: 'cancel',
      appointment,
      message: `Cancel appointment for ${patient?.firstName ?? ''} ${patient?.lastName ?? ''}?`
    });
  };

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toDateString();
    return new Date(apt.date).toDateString() === today;
  });

  const stats = {
    total: todayAppointments.length,
    completed: todayAppointments.filter(a => a.status === 'Completed').length,
    checkedIn: todayAppointments.filter(a => a.status === 'CheckedIn').length,
    upcoming: todayAppointments.filter(a => ['Scheduled', 'Confirmed'].includes(a.status)).length
  };

  const filteredMedications = medicationLibrary.filter(med =>
    med.name.toLowerCase().includes(medicationSearch.toLowerCase())
  );

  // Safe values for confirmation dialog rendering
  const confirmDialogMessage = showConfirmDialog?.message ?? '';
  const isConfirmDialogCancel = showConfirmDialog?.type === 'cancel';

  return (
    <div style={{ padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Doctor Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Welcome back, Dr. Ahmed Nabil - Orthopedic Specialist
        </p>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Today's Appointments
          </h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#3b82f6', margin: '8px 0' }}>
            {stats.total}
          </p>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            {stats.completed} Completed, {stats.upcoming} Upcoming
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Checked In
          </h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#f59e0b', margin: '8px 0' }}>
            {stats.checkedIn}
          </p>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            Waiting for consultation
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Completed Today
          </h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981', margin: '8px 0' }}>
            {stats.completed}
          </p>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            Total consultations
          </p>
        </div>
      </div>

      {/* Appointments List */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
          Today's Schedule
        </h2>

        {todayAppointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            <p>No appointments scheduled for today</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {todayAppointments.map((appointment) => {
              const patient = getPatientInfo(appointment.patientId);
              return (
                <div 
                  key={appointment.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: appointment.status === 'InProgress' ? '#fef3c7' : 'white'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ 
                        fontSize: '18px', 
                        fontWeight: 'bold',
                        backgroundColor: '#eff6ff',
                        color: '#3b82f6',
                        padding: '4px 12px',
                        borderRadius: '6px'
                      }}>
                        {appointment.time}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: getStatusColor(appointment.status) + '20',
                        color: getStatusColor(appointment.status)
                      }}>
                        {appointment.status}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                      {patient?.firstName ?? ''} {patient?.lastName ?? ''} ({patient?.arabicName ?? ''})
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '2px' }}>
                      Patient ID: {appointment.patientId} | Age: {patient?.age ?? ''} | {patient?.gender ?? ''}
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>
                      📞 {patient?.phone ?? ''}
                    </p>
                    <p style={{ fontSize: '14px', color: '#374151', marginTop: '8px' }}>
                      <strong>Reason:</strong> {appointment.reason}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {appointment.status === 'Scheduled' && (
                      <button
                        onClick={() => handleConfirmAppointment(appointment)}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        ✓ Confirm
                      </button>
                    )}
                    
                    {(appointment.status === 'CheckedIn' || appointment.status === 'Confirmed') && (
                      <button
                        onClick={() => handleStartConsultation(appointment)}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        ▶ Start Consultation
                      </button>
                    )}

                    {appointment.status === 'InProgress' && (
                      <button
                        onClick={() => handleStartConsultation(appointment)}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#8b5cf6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        📋 Continue Consultation
                      </button>
                    )}

                    {appointment.status === 'Completed' && (
                      <button
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        ✓ Completed
                      </button>
                    )}

                    {!['Completed', 'Cancelled', 'InProgress'].includes(appointment.status) && (
                      <button
                        onClick={() => handleCancelAppointment(appointment)}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: 'white',
                          color: '#ef4444',
                          border: '1px solid #ef4444',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        ✕ Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Consultation Modal */}
      {showConsultationModal && selectedAppointment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{ 
              padding: '24px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                    Consultation: {selectedAppointment.patient?.firstName ?? ''} {selectedAppointment.patient?.lastName ?? ''}
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    Patient ID: {selectedAppointment.patientId} | {selectedAppointment.patient?.arabicName ?? ''}
                  </p>
                </div>
                <button
                  onClick={() => setShowConsultationModal(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '0',
                    width: '32px',
                    height: '32px'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button
                  onClick={() => setActiveTab('consultation')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: activeTab === 'consultation' ? '#3b82f6' : 'transparent',
                    color: activeTab === 'consultation' ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  📋 Consultation
                </button>
                <button
                  onClick={() => setActiveTab('prescription')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: activeTab === 'prescription' ? '#3b82f6' : 'transparent',
                    color: activeTab === 'prescription' ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    position: 'relative'
                  }}
                >
                  💊 Prescriptions
                  {consultationData.prescriptions.length > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {consultationData.prescriptions.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              {activeTab === 'consultation' && (
                <>
                  {/* Symptoms */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                      Symptoms *
                    </label>
                    <textarea
                      value={consultationData.symptoms}
                      onChange={(e) => setConsultationData(prev => ({ ...prev, symptoms: e.target.value }))}
                      placeholder="Enter patient symptoms..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        minHeight: '100px',
                        fontFamily: 'Arial, sans-serif',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {/* Diagnosis */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                      Diagnosis *
                    </label>
                    <textarea
                      value={consultationData.diagnosis}
                      onChange={(e) => setConsultationData(prev => ({ ...prev, diagnosis: e.target.value }))}
                      placeholder="Enter diagnosis..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        minHeight: '100px',
                        fontFamily: 'Arial, sans-serif',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {/* Notes */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                      Additional Notes
                    </label>
                    <textarea
                      value={consultationData.notes}
                      onChange={(e) => setConsultationData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Enter additional notes, recommendations, or follow-up instructions..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        minHeight: '120px',
                        fontFamily: 'Arial, sans-serif',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </>
              )}

              {activeTab === 'prescription' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      Prescription List
                    </h3>
                    <button
                      onClick={handleOpenAddMedication}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>+</span>
                      Add Medication
                    </button>
                  </div>

                  {consultationData.prescriptions.length === 0 ? (
                    <div style={{
                      padding: '40px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      textAlign: 'center',
                      color: '#6b7280',
                      border: '2px dashed #d1d5db'
                    }}>
                      <p style={{ fontSize: '16px', marginBottom: '8px' }}>No medications added yet</p>
                      <p style={{ fontSize: '14px' }}>Click "Add Medication" to start prescribing</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {consultationData.prescriptions.map((prescription) => (
                        <div key={prescription.id} style={{
                          padding: '20px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          position: 'relative'
                        }}>
                          <button
                            onClick={() => handleRemovePrescription(prescription.id)}
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              backgroundColor: '#fee2e2',
                              color: '#ef4444',
                              border: 'none',
                              borderRadius: '6px',
                              width: '28px',
                              height: '28px',
                              cursor: 'pointer',
                              fontSize: '16px',
                              fontWeight: 'bold'
                            }}
                          >
                            ✕
                          </button>
                          
                          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                            {prescription.name}
                          </h4>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px', color: '#374151' }}>
                            <div>
                              <strong>Dosage:</strong> {prescription.dosage}
                            </div>
                            <div>
                              <strong>Frequency:</strong> {prescription.frequency}
                            </div>
                            <div>
                              <strong>Duration:</strong> {prescription.duration}
                            </div>
                            <div>
                              <strong>Instructions:</strong> {prescription.instructions}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '20px 24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'white'
            }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {consultationData.prescriptions.length} medication(s) prescribed
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowConsultationModal(false)}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveConsultation}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  💾 Save Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      {showAddMedicationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '85vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Add Medication Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
                  Add Medication
                </h3>
                <button
                  onClick={() => setShowAddMedicationModal(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Search */}
              <div style={{ marginTop: '16px' }}>
                <input
                  type="text"
                  placeholder="Search medications..."
                  value={medicationSearch}
                  onChange={(e) => setMedicationSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* Medication Library */}
            <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                Common Medications
              </h4>
              <div style={{ display: 'grid', gap: '8px', marginBottom: '24px' }}>
                {filteredMedications.map((med, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectMedicationFromLibrary(med)}
                    style={{
                      padding: '12px',
                      backgroundColor: selectedMedication?.name === med.name ? '#eff6ff' : 'white',
                      border: `2px solid ${selectedMedication?.name === med.name ? '#3b82f6' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      color: '#1f2937',
                      fontWeight: selectedMedication?.name === med.name ? '600' : '400'
                    }}
                  >
                    {med.name}
                  </button>
                ))}
              </div>

              {/* Custom Medication Form */}
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#f9fafb', 
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
                  Medication Details
                </h4>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>
                    Medication Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter medication name..."
                    value={newMedicationForm.name}
                    onChange={(e) => setNewMedicationForm({...newMedicationForm, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>
                      Dosage *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 500mg, 1 tablet"
                      value={newMedicationForm.dosage}
                      onChange={(e) => setNewMedicationForm({...newMedicationForm, dosage: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>
                      Duration *
                    </label>
                    <select
                      value={newMedicationForm.duration}
                      onChange={(e) => setNewMedicationForm({...newMedicationForm, duration: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="3 days">3 days</option>
                      <option value="5 days">5 days</option>
                      <option value="7 days">7 days</option>
                      <option value="10 days">10 days</option>
                      <option value="14 days">14 days</option>
                      <option value="30 days">30 days</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>
                    Frequency *
                  </label>
                  <select
                    value={newMedicationForm.frequency}
                    onChange={(e) => setNewMedicationForm({...newMedicationForm, frequency: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Every 6 hours">Every 6 hours</option>
                    <option value="Every 8 hours">Every 8 hours</option>
                    <option value="Every 12 hours">Every 12 hours</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>
                    Instructions
                  </label>
                  <textarea
                    placeholder="e.g., Take after meals"
                    value={newMedicationForm.instructions}
                    onChange={(e) => setNewMedicationForm({...newMedicationForm, instructions: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      minHeight: '80px',
                      fontFamily: 'Arial, sans-serif',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Add Medication Footer */}
            <div style={{
              padding: '20px 24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              backgroundColor: 'white'
            }}>
              <button
                onClick={() => setShowAddMedicationModal(false)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddMedicationToList}
                disabled={!newMedicationForm.name || !newMedicationForm.dosage || !newMedicationForm.frequency}
                style={{
                  padding: '10px 24px',
                  backgroundColor: newMedicationForm.name && newMedicationForm.dosage && newMedicationForm.frequency 
                    ? '#10b981' 
                    : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: newMedicationForm.name && newMedicationForm.dosage && newMedicationForm.frequency 
                    ? 'pointer' 
                    : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                ✓ Add to Prescription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>
              Confirm Action
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              {confirmDialogMessage}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setShowConfirmDialog(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isConfirmDialogCancel ? '#ef4444' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;