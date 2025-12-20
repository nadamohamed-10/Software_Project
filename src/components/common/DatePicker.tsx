import React, { useState, useRef, useEffect } from 'react';
import '../../styles/components/DatePicker.css';

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value = '',
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Parse date string to Date object
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length !== 3) return null;
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  };

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = (): (number | null)[] => {
    const date = selectedDate ? parseDate(selectedDate) : new Date();
    if (!date) return Array(42).fill(null);

    const year = date.getFullYear();
    const month = date.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days: (number | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    // Fill remaining cells with null
    while (days.length < 42) {
      days.push(null);
    }
    
    return days;
  };

  // Helper: check min/max bounds
  const isWithinBounds = (date: Date): boolean => {
    const min = minDate ? parseDate(minDate) : null;
    const max = maxDate ? parseDate(maxDate) : null;
    if (min && date < min) return false;
    if (max && date > max) return false;
    return true;
  };

  // Handle date selection
  const handleDateSelect = (day: number | null) => {
    if (day === null) return;
    
    const date = selectedDate ? parseDate(selectedDate) : new Date();
    if (!date) return;
    
    const newDate = new Date(date.getFullYear(), date.getMonth(), day);
    if (!isWithinBounds(newDate)) return; // ignore out-of-range selection
    const formattedDate = formatDate(newDate);
    
    setSelectedDate(formattedDate);
    onChange(formattedDate);
    setIsOpen(false);
  };

  // Navigate to previous month
  const prevMonth = () => {
    const date = selectedDate ? parseDate(selectedDate) : new Date();
    if (!date) return;
    
    date.setMonth(date.getMonth() - 1);
    setSelectedDate(formatDate(date));
  };

  // Navigate to next month
  const nextMonth = () => {
    const date = selectedDate ? parseDate(selectedDate) : new Date();
    if (!date) return;
    
    date.setMonth(date.getMonth() + 1);
    setSelectedDate(formatDate(date));
  };

  // Get month name
  const getMonthName = (): string => {
    const date = selectedDate ? parseDate(selectedDate) : new Date();
    if (!date) return '';
    
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Check if a date is today
  const isToday = (day: number | null): boolean => {
    if (day === null) return false;
    
    const today = new Date();
    const selected = selectedDate ? parseDate(selectedDate) : new Date();
    if (!selected) return false;
    
    return (
      today.getDate() === day &&
      today.getMonth() === selected.getMonth() &&
      today.getFullYear() === selected.getFullYear()
    );
  };

  // Check if a date is selected
  const isSelected = (day: number | null): boolean => {
    if (day === null || !selectedDate) return false;
    
    const date = parseDate(selectedDate);
    if (!date) return false;
    
    return date.getDate() === day;
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="date-picker" ref={datePickerRef}>
      <div 
        className="date-picker-input"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedDate || <span className="placeholder">{placeholder}</span>}
        <span className="calendar-icon">📅</span>
      </div>
      
      {isOpen && (
        <div className="date-picker-calendar">
          <div className="calendar-header">
            <button className="nav-button" onClick={prevMonth}>‹</button>
            <div className="month-year">{getMonthName()}</div>
            <button className="nav-button" onClick={nextMonth}>›</button>
          </div>
          
          <div className="calendar-grid">
            {weekdays.map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
            
            {generateCalendarDays().map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${
                  day === null ? 'empty' : 
                  isSelected(day) ? 'selected' : 
                  isToday(day) ? 'today' : ''
                }`}
                onClick={() => handleDateSelect(day)}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;