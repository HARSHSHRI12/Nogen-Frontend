import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom'; // Not needed as it's a tab now

const ProfileSettingsTab = () => {
  const { user } = useAuth();
  const { settings, loading, error, updateSettings, fetchSettings, hasLoaded } = useSettings();
  const [localSettings, setLocalSettings] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  // const navigate = useNavigate();

  // Removed auth redirect here because parent Profile component handles it.

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (user && user._id && !hasLoaded) {
      fetchSettings();
    }
  }, [user, fetchSettings, hasLoaded]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setLocalSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setLocalSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const result = await updateSettings(localSettings);
    setIsUpdating(false);

    if (result && result.success) {
      setLocalSettings(result.settings || localSettings);
      alert('Settings updated successfully!');
    } else {
      alert('Failed to update settings: ' + (result?.error || 'Unknown error'));
    }
  };

  if (loading && !settings) {
    return <div className="text-center py-12 text-gray-400">Loading settings...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500 font-semibold">Error: {error.message}</div>;
  }

  const currentSettings = localSettings || {};
  const notifications = currentSettings.notifications || {};

  return (
    <div className="settings-glass-form">
      <h3 className="section-title mb-6">User Preferences</h3>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Theme & Appearance */}
        <div className="info-item mb-4">
          <h4 className="text-lg font-medium text-white mb-4">Appearance</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <label htmlFor="theme">Theme Mode</label>
              <select
                id="theme"
                name="theme"
                value={currentSettings.theme || 'light'}
                onChange={handleChange}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="fontSize">Font Size</label>
              <select
                id="fontSize"
                name="fontSize"
                value={currentSettings.fontSize || 'medium'}
                onChange={handleChange}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="info-item mb-4">
          <h4 className="text-lg font-medium text-white mb-4">Notifications</h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="soundEffects"
                name="soundEffects"
                checked={currentSettings.soundEffects || false}
                onChange={handleChange}
              />
              <label htmlFor="soundEffects">Enable Sound Effects</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="notifications.email"
                name="notifications.email"
                checked={notifications.email || false}
                onChange={handleChange}
              />
              <label htmlFor="notifications.email">Email Notifications</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="notifications.inApp"
                name="notifications.inApp"
                checked={notifications.inApp || false}
                onChange={handleChange}
              />
              <label htmlFor="notifications.inApp">In-App Notifications</label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-700">
          <button
            type="submit"
            disabled={!user || !user._id || isUpdating}
            className="btn-settings-save"
          >
            {isUpdating ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettingsTab;
