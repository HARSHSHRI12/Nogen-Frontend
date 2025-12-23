import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './ProfileSettings.css';
import { FiToggle2, FiSave, FiAlertCircle } from 'react-icons/fi';

const ProfileSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const getToken = () => {
    const lsToken = localStorage.getItem("token");
    const ssToken = sessionStorage.getItem("token");
    
    let token = null;
    if (lsToken && typeof lsToken === 'string' && lsToken !== 'undefined' && lsToken.includes('.')) {
      token = lsToken;
    } else if (ssToken && typeof ssToken === 'string' && ssToken !== 'undefined' && ssToken.includes('.')) {
      token = ssToken;
    }
    return token;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = getToken();
        if (!token) {
          setMessage('Please login first');
          setMessageType('error');
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get('/settings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSettings(response.data);
        setMessage('');
      } catch (err) {
        console.error('❌ Failed to fetch settings:', err.message);
        setMessage('Failed to load settings');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSettings();
    }
  }, [user]);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const response = await axiosInstance.put('/settings', settings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(response.data);
      setMessage('✅ Settings saved successfully!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('❌ Failed to save settings:', err.message);
      setMessage('Failed to save settings');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="settings-loading">Loading settings...</div>;
  if (!settings) return <div className="settings-error">Failed to load settings</div>;

  return (
    <div className="profile-settings-container">
      <div className="settings-header">
        <h2>⚙️ System Settings</h2>
        <p>Customize your app experience</p>
      </div>

      {message && (
        <div className={`settings-message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="settings-grid">
        {/* Theme Settings */}
        <div className="settings-section">
          <h3>🎨 Appearance</h3>
          <div className="settings-item">
            <div className="settings-label">
              <span>Dark Mode</span>
              <small>Use dark theme across the app</small>
            </div>
            <button
              className={`toggle-switch ${settings.darkMode ? 'active' : ''}`}
              onClick={() => handleToggle('darkMode')}
            >
              <div className="toggle-circle"></div>
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-section">
          <h3>🔔 Notifications</h3>
          <div className="settings-item">
            <div className="settings-label">
              <span>Email Notifications</span>
              <small>Get email updates about your account</small>
            </div>
            <button
              className={`toggle-switch ${settings.emailNotifications ? 'active' : ''}`}
              onClick={() => handleToggle('emailNotifications')}
            >
              <div className="toggle-circle"></div>
            </button>
          </div>

          <div className="settings-item">
            <div className="settings-label">
              <span>Push Notifications</span>
              <small>Receive in-app notifications</small>
            </div>
            <button
              className={`toggle-switch ${settings.pushNotifications ? 'active' : ''}`}
              onClick={() => handleToggle('pushNotifications')}
            >
              <div className="toggle-circle"></div>
            </button>
          </div>

          <div className="settings-item">
            <div className="settings-label">
              <span>Newsletter</span>
              <small>Subscribe to our weekly newsletter</small>
            </div>
            <button
              className={`toggle-switch ${settings.newsLetterSubscribed ? 'active' : ''}`}
              onClick={() => handleToggle('newsLetterSubscribed')}
            >
              <div className="toggle-circle"></div>
            </button>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="settings-section">
          <h3>🔒 Privacy</h3>
          <div className="settings-item">
            <div className="settings-label">
              <span>Profile Visibility</span>
              <small>Who can see your profile</small>
            </div>
            <select
              value={settings.profileVisibility}
              onChange={(e) => handleSelectChange('profileVisibility', e.target.value)}
              className="settings-select"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="settings-item">
            <div className="settings-label">
              <span>Show Email Address</span>
              <small>Display email on your profile</small>
            </div>
            <button
              className={`toggle-switch ${settings.showEmail ? 'active' : ''}`}
              onClick={() => handleToggle('showEmail')}
            >
              <div className="toggle-circle"></div>
            </button>
          </div>

          <div className="settings-item">
            <div className="settings-label">
              <span>Two-Factor Authentication</span>
              <small>Add extra security to your account</small>
            </div>
            <button
              className={`toggle-switch ${settings.twoFactorAuth ? 'active' : ''}`}
              onClick={() => handleToggle('twoFactorAuth')}
            >
              <div className="toggle-circle"></div>
            </button>
          </div>
        </div>

        {/* Learning Settings */}
        <div className="settings-section">
          <h3>📚 Learning</h3>
          <div className="settings-item">
            <div className="settings-label">
              <span>Auto-play Videos</span>
              <small>Automatically play videos on pages</small>
            </div>
            <button
              className={`toggle-switch ${settings.autoPlayVideos ? 'active' : ''}`}
              onClick={() => handleToggle('autoPlayVideos')}
            >
              <div className="toggle-circle"></div>
            </button>
          </div>

          <div className="settings-item">
            <div className="settings-label">
              <span>Default Language</span>
              <small>Choose your preferred language</small>
            </div>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => handleSelectChange('defaultLanguage', e.target.value)}
              className="settings-select"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <button
          className="save-settings-btn"
          onClick={handleSave}
          disabled={saving}
        >
          <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
