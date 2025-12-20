import React, { useState, useEffect, useRef } from 'react';
import { useNotifications, NotificationType } from '../../contexts/NotificationContext';
import '../../styles/components/NotificationDropdown.css';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getTypeIcon = (type: NotificationType): string => {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'appointment': return '📅';
      case 'prescription': return '💊';
      case 'test-results': return '📊';
      case 'alert': return '⚠️';
      case 'reminder': return '⏰';
      case 'account': return '👤';
      default: return 'ℹ️';
    }
  };

  const getTypeClass = (type: NotificationType): string => {
    return `notification-item ${type}`;
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return notificationDate.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="dropdown-header">
        <h3>Notifications ({unreadCount})</h3>
        {notifications.length > 0 && (
          <button className="btn-clear-all" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="dropdown-content">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={getTypeClass(notification.type) + (notification.read ? ' read' : '')}
            >
              <div className="notification-icon">
                {getTypeIcon(notification.type)}
              </div>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <div className="notification-footer">
                  <span className="notification-time">
                    {formatDate(notification.timestamp)}
                  </span>
                  {!notification.read && (
                    <button 
                      className="btn-mark-read"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
              <button 
                className="btn-remove"
                onClick={() => removeNotification(notification.id)}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;