import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { FiBell, FiX, FiCheck, FiTrash2 } from 'react-icons/fi';
import './NotificationDropdown.css';
import { useSocket } from '../context/SocketContext';

const NotificationDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();

  // ... previous logic ...

  const fetchNotifications = async () => {
    // ... logic ...
    try {
      if (!user) return;
      setLoading(true);
      const response = await axiosInstance.get('/notifications?limit=10');
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (err) {
      console.error('❌ Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Initial fetch for count
      const initialFetch = async () => {
        try {
          const response = await axiosInstance.get('/notifications?limit=0');
          setUnreadCount(response.data.unreadCount);
        } catch (err) { }
      };
      initialFetch();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('new_notification', (notification) => {
        console.log('🔔 New real-time notification received:', notification);
        setNotifications(prev => [notification, ...prev].slice(0, 10));
        setUnreadCount(prev => prev + 1);

        // Optional: Browser notification or sound
        if (Notification.permission === 'granted') {
          new Notification(notification.title, { body: notification.message });
        }
      });

      return () => socket.off('new_notification');
    }
  }, [socket]);

  useEffect(() => {
    if (user && isOpen) {
      fetchNotifications();
    }
  }, [user, isOpen]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      if (!user) return; // Ensure user is logged in
      await axiosInstance.put(`/notifications/${notificationId}/read`, {}); // No manual Authorization header needed

      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('❌ Failed to mark as read:', err.message, err.response?.data);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      if (!user) return; // Ensure user is logged in
      await axiosInstance.delete(`/notifications/${notificationId}`); // No manual Authorization header needed

      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (err) {
      console.error('❌ Failed to delete notification:', err.message, err.response?.data);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      if (!user) return; // Ensure user is logged in
      await axiosInstance.put('/notifications/mark-all/read', {}); // No manual Authorization header needed

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('❌ Failed to mark all as read:', err.message, err.response?.data);
    }
  };

  const getIcon = (type) => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      achievement: '🏆',
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="notification-container">
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <FiBell size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-empty">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <FiBell size={32} opacity={0.5} />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif._id}
                  className={`notification-item ${!notif.read ? 'unread' : ''}`}
                >
                  <div className="notification-content">
                    <div className="notification-icon">{getIcon(notif.type)}</div>
                    <div className="notification-text">
                      <h4>{notif.title}</h4>
                      <p>{notif.message}</p>
                      <small>{new Date(notif.createdAt).toLocaleString()}</small>
                    </div>
                  </div>

                  <div className="notification-actions">
                    {!notif.read && (
                      <button
                        className="action-btn mark-btn"
                        onClick={() => handleMarkAsRead(notif._id)}
                        title="Mark as read"
                      >
                        <FiCheck size={16} />
                      </button>
                    )}
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(notif._id)}
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="notification-footer">
            <a href="/notifications" className="view-all-link">View All Notifications →</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
