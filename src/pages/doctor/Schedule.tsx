import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/pages/Schedule.css';

const Schedule: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data for schedule
  const [schedule, setSchedule] = useState([
    {
      id: '1',
      day: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 30,
      isActive: true
    },
    {
      id: '2',
      day: 'Tuesday',
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 30,
      isActive: true
    },
    {
      id: '3',
      day: 'Wednesday',
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 30,
      isActive: true
    },
    {
      id: '4',
      day: 'Thursday',
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 30,
      isActive: true
    },
    {
      id: '5',
      day: 'Friday',
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 30,
      isActive: true
    },
    {
      id: '6',
      day: 'Saturday',
      startTime: '10:00',
      endTime: '14:00',
      slotDuration: 30,
      isActive: true
    },
    {
      id: '7',
      day: 'Sunday',
      startTime: '',
      endTime: '',
      slotDuration: 30,
      isActive: false
    }
  ]);

  const handleToggleDay = (id: string) => {
    setSchedule(prev => prev.map(day => 
      day.id === id ? { ...day, isActive: !day.isActive } : day
    ));
  };

  const handleTimeChange = (id: string, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => prev.map(day => 
      day.id === id ? { ...day, [field]: value } : day
    ));
  };

  const handleSlotDurationChange = (id: string, value: number) => {
    setSchedule(prev => prev.map(day => 
      day.id === id ? { ...day, slotDuration: value } : day
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    console.log('Schedule update submitted:', schedule);
    setIsEditing(false);
  };

  return (
    <div className="schedule-page">
      <div className="page-header">
        <h1>My Schedule</h1>
        <button 
          className="btn btn-outline"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Schedule'}
        </button>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2>Weekly Availability</h2>
        </div>
        <div className="card-body">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="schedule-grid">
                {schedule.map(day => (
                  <div key={day.id} className="schedule-day">
                    <div className="day-header">
                      <h3>{day.day}</h3>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={day.isActive}
                          onChange={() => handleToggleDay(day.id)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    
                    {day.isActive && (
                      <div className="day-details">
                        <div className="time-inputs">
                          <div className="form-group">
                            <label htmlFor={`start-${day.id}`} className="form-label">Start Time</label>
                            <input
                              type="time"
                              id={`start-${day.id}`}
                              className="form-control"
                              value={day.startTime}
                              onChange={(e) => handleTimeChange(day.id, 'startTime', e.target.value)}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor={`end-${day.id}`} className="form-label">End Time</label>
                            <input
                              type="time"
                              id={`end-${day.id}`}
                              className="form-control"
                              value={day.endTime}
                              onChange={(e) => handleTimeChange(day.id, 'endTime', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor={`slot-${day.id}`} className="form-label">Slot Duration (minutes)</label>
                          <select
                            id={`slot-${day.id}`}
                            className="form-control"
                            value={day.slotDuration}
                            onChange={(e) => handleSlotDurationChange(day.id, parseInt(e.target.value))}
                          >
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>60 minutes</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Schedule
                </button>
              </div>
            </form>
          ) : (
            <div className="schedule-display">
              {schedule.filter(day => day.isActive).map(day => (
                <div key={day.id} className="schedule-item">
                  <div className="day-name">{day.day}</div>
                  <div className="day-hours">
                    {day.startTime} - {day.endTime}
                  </div>
                  <div className="slot-duration">
                    Slot: {day.slotDuration} min
                  </div>
                </div>
              ))}
              
              {schedule.filter(day => day.isActive).length === 0 && (
                <div className="empty-state">
                  <p>You haven't set any working hours yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;