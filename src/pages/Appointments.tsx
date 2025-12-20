import { useState, type ReactNode } from 'react';

// Mock Arabic doctor data
const mockDoctors = [
  {
    id: 'D001',
    firstName: 'Ahmed',
    lastName: 'Nabil',
    arabicName: 'Ahmed Nabil',
    specialty: 'Orthopedic',
    specialtyAr: 'Orthopaedics'
  }
];

type Doctor = { id: string; firstName: string; lastName: string; arabicName?: string; specialty?: string; specialtyAr?: string };
type Appointment = { id: string; doctorId: string; date: string; time: string; status: 'Scheduled'|'Confirmed'|'CheckedIn'|'InProgress'|'Completed'|'Cancelled'|string; reason?: string };
type BookingForm = { selectedDate: string; selectedTime: string; reason: string; selectedDoctor: string };
type RescheduleForm = { newDate: string; newTime: string };
type ConfirmDialog = { type: 'book'|'reschedule'|'cancel'; title: string; message: ReactNode; onConfirm: () => void } | null;

const PatientAppointments = () => {
  const [activeTab, setActiveTab] = useState<'book'|'upcoming'|'history'>('book');
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'A001',
      doctorId: 'D001',
      date: '2025-12-25',
      time: '10:00 AM',
      status: 'Confirmed',
      reason: 'Knee pain consultation'
    },
    {
      id: 'A002',
      doctorId: 'D001',
      date: '2025-12-28',
      time: '02:00 PM',
      status: 'Scheduled',
      reason: 'Follow-up visit'
    }
  ]);

  // Booking form state
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    selectedDate: '',
    selectedTime: '',
    reason: '',
    selectedDoctor: 'D001'
  });

  // Reschedule state
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState<RescheduleForm>({
    newDate: '',
    newTime: ''
  });

  // Confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>(null);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM'
  ];

  // Typed tabs to keep `tab` as a narrow union type
  const tabs: ('book'|'upcoming'|'history')[] = ['book', 'upcoming', 'history'];

  const isSlotTaken = (doctorId: string, date: string, time: string, excludeAppointmentId?: string): boolean => {
    return appointments.some(apt => 
      apt.doctorId === doctorId && 
      apt.date === date && 
      apt.time === time && 
      apt.status !== 'Cancelled' && // Don't count cancelled appointments
      apt.id !== excludeAppointmentId // Exclude current appointment when rescheduling
    );
  };

  const getDoctorInfo = (doctorId: string): Doctor => {
    return (mockDoctors.find(d => d.id === doctorId) || mockDoctors[0]) as Doctor;
  };

  const handleBookAppointment = () => {
    if (!bookingForm.selectedDate || !bookingForm.selectedTime || !bookingForm.reason) {
      alert('Please fill all fields');
      return;
    }

    // Check if slot is already taken
    if (isSlotTaken(bookingForm.selectedDoctor, bookingForm.selectedDate, bookingForm.selectedTime)) {
      alert('This time slot is already booked. Please select another time.');
      return;
    }

    const doctor = getDoctorInfo(bookingForm.selectedDoctor);
    
    setConfirmDialog({
      type: 'book',
      title: 'Confirm Appointment Booking',
      message: (
        <div>
          <p><strong>Doctor:</strong> Dr. {doctor.firstName} {doctor.lastName} ({doctor.arabicName})</p>
          <p><strong>Specialty:</strong> {doctor.specialty}</p>
          <p><strong>Date:</strong> {new Date(bookingForm.selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
          })}</p>
          <p><strong>Time:</strong> {bookingForm.selectedTime}</p>
          <p><strong>Reason:</strong> {bookingForm.reason}</p>
        </div>
      ),
      onConfirm: () => {
        const newAppointment = {
          id: `A${Date.now()}`,
          doctorId: bookingForm.selectedDoctor,
          date: bookingForm.selectedDate,
          time: bookingForm.selectedTime,
          status: 'Scheduled',
          reason: bookingForm.reason
        };
        
        setAppointments([...appointments, newAppointment]);
        setBookingForm({
          selectedDate: '',
          selectedTime: '',
          reason: '',
          selectedDoctor: 'D001'
        });
        setActiveTab('upcoming');
        setConfirmDialog(null);
        alert('Appointment booked successfully!');
      }
    });
  };

  const handleStartReschedule = (appointment: Appointment) => {
    setRescheduleAppointment(appointment);
    setRescheduleForm({
      newDate: appointment.date,
      newTime: appointment.time
    });
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleForm.newDate || !rescheduleForm.newTime) {
      alert('Please select new date and time');
      return;
    }

    if (!rescheduleAppointment) return; 

    // Check if new slot is already taken (excluding current appointment)
    if (isSlotTaken(rescheduleAppointment.doctorId, rescheduleForm.newDate, rescheduleForm.newTime, rescheduleAppointment.id)) {
      alert('This time slot is already booked. Please select another time.');
      return;
    }

    setConfirmDialog({
      type: 'reschedule',
      title: 'Confirm Reschedule',
      message: (
        <div>
          <p style={{ marginBottom: '12px' }}><strong>Original Appointment:</strong></p>
          <p>Date: {new Date(rescheduleAppointment.date).toLocaleDateString()}</p>
          <p>Time: {rescheduleAppointment.time}</p>
          <p style={{ margin: '16px 0', color: '#3b82f6', fontWeight: 'bold' }}>↓ Rescheduling to ↓</p>
          <p><strong>New Appointment:</strong></p>
          <p>Date: {new Date(rescheduleForm.newDate).toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
          })}</p>
          <p>Time: {rescheduleForm.newTime}</p>
        </div>
      ),
      onConfirm: () => {
        setAppointments(prev => prev.map(apt => 
          apt.id === rescheduleAppointment.id 
            ? { ...apt, date: rescheduleForm.newDate, time: rescheduleForm.newTime }
            : apt
        ));
        setRescheduleAppointment(null);
        setConfirmDialog(null);
        alert('Appointment rescheduled successfully!');
      }
    });
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    const doctor = getDoctorInfo(appointment.doctorId);
    
    setConfirmDialog({
      type: 'cancel',
      title: 'Cancel Appointment',
      message: (
        <div>
          <p style={{ marginBottom: '12px', color: '#ef4444' }}>
            Are you sure you want to cancel this appointment?
          </p>
          <p><strong>Doctor:</strong> Dr. {doctor.firstName} {doctor.lastName}</p>
          <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {appointment.time}</p>
          <p style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
            This action cannot be undone.
          </p>
        </div>
      ),
      onConfirm: () => {
        setAppointments(prev => prev.map(apt => 
          apt.id === appointment.id 
            ? { ...apt, status: 'Cancelled' }
            : apt
        ));
        setConfirmDialog(null);
        alert('Appointment cancelled successfully');
      }
    });
  };

  const upcomingAppointments = appointments.filter(apt => 
    ['Scheduled', 'Confirmed', 'CheckedIn'].includes(apt.status)
  );

  const pastAppointments = appointments.filter(apt => 
    ['Completed', 'Cancelled'].includes(apt.status)
  );

  return (
    <div style={{ padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
          Appointments
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Manage your medical appointments
        </p>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === tab ? '#3b82f6' : 'transparent',
              color: activeTab === tab ? 'white' : '#6b7280',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #3b82f6' : 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '-2px',
              borderRadius: '8px 8px 0 0'
            }}
          >
            {tab === 'book' && '📅 Book Appointment'}
            {tab === 'upcoming' && '📋 Upcoming'}
            {tab === 'history' && '📚 History'}
          </button>
        ))}
      </div>

      {/* Book Appointment Tab */}
      {activeTab === 'book' && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
            Schedule Your Appointment
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '32px' }}>
            Book a consultation with Dr. Ahmed Nabil - Orthopedic Specialist (Ahmed Nabil)
          </p>

          {/* Date Selection */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
              📅 Select Date
            </h3>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={bookingForm.selectedDate}
              onChange={(e) => setBookingForm({...bookingForm, selectedDate: e.target.value})}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Time Slots */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
              🕐 Choose Time Slot
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
              gap: '12px' 
            }}>
              {timeSlots.map(slot => {
                const isTaken = bookingForm.selectedDate ? 
                  isSlotTaken(bookingForm.selectedDoctor, bookingForm.selectedDate, slot) : false;
                
                return (
                  <button
                    key={slot}
                    onClick={() => {
                      if (!isTaken) {
                        setBookingForm({...bookingForm, selectedTime: slot});
                      }
                    }}
                    disabled={isTaken}
                    style={{
                      padding: '12px',
                      backgroundColor: isTaken 
                        ? '#f3f4f6' 
                        : bookingForm.selectedTime === slot 
                          ? '#3b82f6' 
                          : 'white',
                      color: isTaken 
                        ? '#9ca3af' 
                        : bookingForm.selectedTime === slot 
                          ? 'white' 
                          : '#374151',
                      border: `2px solid ${
                        isTaken 
                          ? '#e5e7eb' 
                          : bookingForm.selectedTime === slot 
                            ? '#3b82f6' 
                            : '#e5e7eb'
                      }`,
                      borderRadius: '8px',
                      cursor: isTaken ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {slot}
                    {isTaken && (
                      <span style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        fontSize: '10px',
                        color: '#ef4444'
                      }}>
                        ✕
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {bookingForm.selectedDate && (
              <p style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                Slots marked with ✕ are already booked
              </p>
            )}
          </div>

          {/* Reason */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
              📝 Reason for Visit
            </h3>
            <textarea
              value={bookingForm.reason}
              onChange={(e) => setBookingForm({...bookingForm, reason: e.target.value})}
              placeholder="Please describe your symptoms or reason for the appointment..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                minHeight: '120px',
                fontFamily: 'Arial, sans-serif'
              }}
            />
          </div>

          {/* Summary */}
          {bookingForm.selectedDate && bookingForm.selectedTime && (
            <div style={{ 
              backgroundColor: isSlotTaken(bookingForm.selectedDoctor, bookingForm.selectedDate, bookingForm.selectedTime) 
                ? '#fee2e2' 
                : '#eff6ff', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: '24px',
              border: `1px solid ${
                isSlotTaken(bookingForm.selectedDoctor, bookingForm.selectedDate, bookingForm.selectedTime) 
                  ? '#fecaca' 
                  : '#bfdbfe'
              }`
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '12px', 
                color: isSlotTaken(bookingForm.selectedDoctor, bookingForm.selectedDate, bookingForm.selectedTime)
                  ? '#dc2626'
                  : '#1e40af'
              }}>
                {isSlotTaken(bookingForm.selectedDoctor, bookingForm.selectedDate, bookingForm.selectedTime)
                  ? '⚠️ This slot is already booked!'
                  : 'Appointment Summary'}
              </h4>
              {!isSlotTaken(bookingForm.selectedDoctor, bookingForm.selectedDate, bookingForm.selectedTime) && (
                <>
                  <p style={{ marginBottom: '6px', color: '#374151' }}>
                    <strong>Doctor:</strong> Dr. Ahmed Nabil (Ahmed Nabil)
                  </p>
                  <p style={{ marginBottom: '6px', color: '#374151' }}>
                    <strong>Specialty:</strong> Orthopedic
                  </p>
                  <p style={{ marginBottom: '6px', color: '#374151' }}>
                    <strong>Date:</strong> {new Date(bookingForm.selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </p>
                  <p style={{ color: '#374151' }}>
                    <strong>Time:</strong> {bookingForm.selectedTime}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setActiveTab('upcoming')}
              style={{
                padding: '14px 28px',
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleBookAppointment}
              disabled={
                !bookingForm.selectedDate || 
                !bookingForm.selectedTime || 
                !bookingForm.reason ||
                isSlotTaken(bookingForm.selectedDoctor, bookingForm.selectedDate, bookingForm.selectedTime)
              }
              style={{
                padding: '14px 28px',
                backgroundColor: (
                  bookingForm.selectedDate && 
                  bookingForm.selectedTime && 
                  bookingForm.reason &&
                  !isSlotTaken(bookingForm.selectedDoctor, bookingForm.selectedDate, bookingForm.selectedTime)
                ) 
                  ? '#3b82f6' 
                  : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: (
                  bookingForm.selectedDate && 
                  bookingForm.selectedTime && 
                  bookingForm.reason &&
                  !isSlotTaken(bookingForm.selectedDoctor, bookingForm.selectedDate, bookingForm.selectedTime)
                ) 
                  ? 'pointer' 
                  : 'not-allowed',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              {isSlotTaken(bookingForm.selectedDoctor, bookingForm.selectedDate, bookingForm.selectedTime)
                ? '⚠️ Slot Already Booked'
                : '✓ Confirm Appointment'}
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Appointments Tab */}
      {activeTab === 'upcoming' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {upcomingAppointments.length === 0 ? (
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '40px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <p style={{ fontSize: '18px' }}>No upcoming appointments</p>
              <button
                onClick={() => setActiveTab('book')}
                style={{
                  marginTop: '16px',
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Book New Appointment
              </button>
            </div>
          ) : (
            upcomingAppointments.map(appointment => {
              const doctor = getDoctorInfo(appointment.doctorId);
              const isRescheduling = rescheduleAppointment?.id === appointment.id;

              return (
                <div 
                  key={appointment.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  {!isRescheduling ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
                            Dr. {doctor.firstName} {doctor.lastName}
                          </h3>
                          <p style={{ color: '#6b7280', fontSize: '14px' }}>
                            {doctor.specialty} | {doctor.arabicName}
                          </p>
                        </div>
                        <span style={{
                          padding: '6px 16px',
                          backgroundColor: '#10b98120',
                          color: '#10b981',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          height: 'fit-content'
                        }}>
                          {appointment.status}
                        </span>
                      </div>

                      <div style={{ marginBottom: '16px', color: '#374151' }}>
                        <p style={{ marginBottom: '6px' }}>
                          <strong>📅 Date:</strong> {new Date(appointment.date).toLocaleDateString('en-US', { 
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </p>
                        <p style={{ marginBottom: '6px' }}>
                          <strong>🕐 Time:</strong> {appointment.time}
                        </p>
                        <p>
                          <strong>📝 Reason:</strong> {appointment.reason}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleStartReschedule(appointment)}
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
                          🔄 Reschedule
                        </button>
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
                          ✕ Cancel Appointment
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
                        Reschedule Appointment
                      </h3>

                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                          New Date
                        </label>
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={rescheduleForm.newDate}
                          onChange={(e) => setRescheduleForm({...rescheduleForm, newDate: e.target.value, newTime: ''})}
                          style={{
                            width: '100%',
                            maxWidth: '300px',
                            padding: '10px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                        <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                          Select a new date first, then choose an available time slot
                        </p>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                          New Time
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                          {timeSlots.map(slot => {
                            const isTaken = rescheduleAppointment && rescheduleForm.newDate ? 
                              isSlotTaken(
                                rescheduleAppointment.doctorId, 
                                rescheduleForm.newDate, 
                                slot,
                                rescheduleAppointment.id // Exclude current appointment
                              ) : false;
                            
                            return (
                              <button
                                key={slot}
                                onClick={() => {
                                  if (!isTaken) {
                                    setRescheduleForm({...rescheduleForm, newTime: slot});
                                  }
                                }}
                                disabled={isTaken || !rescheduleForm.newDate}
                                style={{
                                  padding: '10px',
                                  backgroundColor: isTaken 
                                    ? '#f3f4f6' 
                                    : rescheduleForm.newTime === slot 
                                      ? '#3b82f6' 
                                      : 'white',
                                  color: isTaken || !rescheduleForm.newDate
                                    ? '#9ca3af' 
                                    : rescheduleForm.newTime === slot 
                                      ? 'white' 
                                      : '#374151',
                                  border: `2px solid ${
                                    isTaken || !rescheduleForm.newDate
                                      ? '#e5e7eb' 
                                      : rescheduleForm.newTime === slot 
                                        ? '#3b82f6' 
                                        : '#e5e7eb'
                                  }`,
                                  borderRadius: '6px',
                                  cursor: isTaken || !rescheduleForm.newDate ? 'not-allowed' : 'pointer',
                                  fontSize: '13px',
                                  fontWeight: '500',
                                  position: 'relative',
                                  overflow: 'hidden'
                                }}
                              >
                                {slot}
                                {isTaken && (
                                  <span style={{
                                    position: 'absolute',
                                    top: '1px',
                                    right: '1px',
                                    fontSize: '9px',
                                    color: '#ef4444'
                                  }}>
                                    ✕
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {rescheduleForm.newDate && (
                          <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                            Slots marked with ✕ are already booked for the selected date
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => setRescheduleAppointment(null)}
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
                          onClick={handleConfirmReschedule}
                          disabled={!rescheduleForm.newDate || !rescheduleForm.newTime}
                          style={{
                            padding: '10px 20px',
                            backgroundColor: rescheduleForm.newDate && rescheduleForm.newTime ? '#10b981' : '#9ca3af',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: rescheduleForm.newDate && rescheduleForm.newTime ? 'pointer' : 'not-allowed',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          ✓ Confirm Reschedule
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pastAppointments.length === 0 ? (
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              padding: '40px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <p style={{ fontSize: '18px' }}>No appointment history</p>
            </div>
          ) : (
            pastAppointments.map(appointment => {
              const doctor = getDoctorInfo(appointment.doctorId);
              return (
                <div 
                  key={appointment.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    opacity: appointment.status === 'Cancelled' ? 0.7 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        {doctor.specialty} | {doctor.arabicName}
                      </p>
                    </div>
                    <span style={{
                      padding: '6px 16px',
                      backgroundColor: appointment.status === 'Completed' ? '#10b98120' : '#ef444420',
                      color: appointment.status === 'Completed' ? '#10b981' : '#ef4444',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      height: 'fit-content'
                    }}>
                      {appointment.status}
                    </span>
                  </div>

                  <div style={{ color: '#374151' }}>
                    <p style={{ marginBottom: '6px' }}>
                      <strong>📅 Date:</strong> {new Date(appointment.date).toLocaleDateString('en-US', { 
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                      })}
                    </p>
                    <p style={{ marginBottom: '6px' }}>
                      <strong>🕐 Time:</strong> {appointment.time}
                    </p>
                    <p>
                      <strong>📝 Reason:</strong> {appointment.reason}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
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
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '28px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '16px', 
              color: '#1f2937' 
            }}>
              {confirmDialog.title}
            </h3>
            <div style={{ 
              marginBottom: '24px', 
              color: '#374151',
              lineHeight: '1.6'
            }}>
              {confirmDialog.message}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setConfirmDialog(null)}
                style={{
                  padding: '10px 24px',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                style={{
                  padding: '10px 24px',
                  backgroundColor: confirmDialog.type === 'cancel' ? '#ef4444' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {confirmDialog.type === 'cancel' ? '✕ Cancel Appointment' : '✓ Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;