import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { FiBell, FiX, FiCheck, FiTrash2 } from 'react-icons/fi';
import './NotificationDropdown.css';

const NotificationDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // getToken function is removed as tokens are HTTP-only cookies and not accessible by client-side JS.
  // axiosInstance is configured with withCredentials: true, so cookies are sent automatically.

  const fetchNotifications = async () => {
    try {
      // Ensure user is logged in before attempting to fetch notifications
      if (!user) return; 

      setLoading(true);
      const response = await axiosInstance.get('/notifications?limit=10'); // No manual Authorization header needed
      
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (err) {
      console.error('❌ Failed to fetch notifications:', err.message, err.response?.data);
      // Handle unauthorized errors, e.g., redirect to login or show a message
      if (err.response?.status === 401) {
        // Optionally, trigger a logout if the user is truly unauthorized
        // This component doesn't have direct access to logout, but a parent could handle it.
        console.warn("User unauthorized to fetch notifications. Session might be expired.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isOpen) { // Only fetch if user is logged in and dropdown is open
      fetchNotifications();
    }
  }, [user, isOpen]); // Depend on user and isOpen

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
