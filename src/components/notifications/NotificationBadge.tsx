import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import '../../styles/components/NotificationBadge.css';

interface NotificationBadgeProps {
  onClick: () => void;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ onClick }) => {
  const { unreadCount } = useNotifications();

  return (
    <div className="notification-badge" onClick={onClick}>
      <span className="bell-icon">🔔</span>
      {unreadCount > 0 && (
        <span className="badge-count">{unreadCount}</span>
      )}
    </div>
  );
};

export default NotificationBadge;