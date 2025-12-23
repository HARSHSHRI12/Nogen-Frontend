import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user } = useAuth();
  const { settings, loading, error, updateSettings, fetchSettings, hasLoaded } = useSettings();
  const [localSettings, setLocalSettings] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'student' && user.role !== 'teacher')) {
      navigate('/login');
    }
  }, [user, navigate]);

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
    return <div className="text-center py-12 text-gray-500">Loading settings...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500 font-semibold">Error: {error.message}</div>;
  }

  const currentSettings = localSettings || {};
  const notifications = currentSettings.notifications || {};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <h1 className="text-3xl font-semibold text-center mb-12 text-gray-800">
          User Settings
        </h1>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-8 space-y-10"
        >
          {/* Theme */}
          <div className="space-y-2">
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              value={currentSettings.theme || 'light'}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="soundEffects"
              name="soundEffects"
              checked={currentSettings.soundEffects || false}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="soundEffects" className="text-sm text-gray-700">
              Enable sound effects
            </label>
          </div>

          {/* Text Style */}
          <div className="space-y-2">
            <label htmlFor="textStyle" className="block text-sm font-medium text-gray-700">
              Text Style
            </label>
            <select
              id="textStyle"
              name="textStyle"
              value={currentSettings.textStyle || 'default'}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 px-3 py-2"
            >
              <option value="default">Default</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
            </select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">
              Font Size
            </label>
            <select
              id="fontSize"
              name="fontSize"
              value={currentSettings.fontSize || 'medium'}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500 px-3 py-2"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-800">Notifications</h3>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="notifications.email"
                name="notifications.email"
                checked={notifications.email || false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="notifications.email" className="text-sm text-gray-700">
                Email Notifications
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="notifications.inApp"
                name="notifications.inApp"
                checked={notifications.inApp || false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="notifications.inApp" className="text-sm text-gray-700">
                In-App Notifications
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => fetchSettings()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md border border-gray-300"
            >
              Load Settings
            </button>
            <button
              type="submit"
              disabled={!user || !user._id || isUpdating}
              className={`px-4 py-2 rounded-md text-white ${
                isUpdating
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isUpdating ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
