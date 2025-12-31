import React, { createContext, useContext, useState, useCallback } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from './AuthContext';

export const SettingsContext = createContext();

// Default settings
const DEFAULT_SETTINGS = {
  theme: 'dark',
  fontSize: 'medium',
  textStyle: 'default'
};

export const SettingsProvider = ({ children }) => {
  const { user } = useAuth();

  // Initialize from localStorage if available, otherwise use DEFAULT_SETTINGS
  const getInitialSettings = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return { ...DEFAULT_SETTINGS, theme: savedTheme };
    }
    return DEFAULT_SETTINGS;
  };

  const [settings, setSettings] = useState(getInitialSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Fetch settings only when explicitly called
  const fetchSettings = useCallback(async () => {
    const userId = user?.id || user?._id;
    if (!user || !userId) {
      setError(new Error('User not authenticated'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`/settings/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Backend may return a document with a `settings` field or the settings object directly
      const data = response.data;
      setSettings((data && data.settings) ? data.settings : data || DEFAULT_SETTINGS);
      setHasLoaded(true);
      return true;
    } catch (err) {
      setError(err);
      setSettings(DEFAULT_SETTINGS);
      setHasLoaded(true);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateSettings = useCallback(async (newSettings) => {
    // Optimistic Update: Update local state immediately
    setSettings(newSettings);

    // Persist to localStorage for anonymous session
    if (newSettings.theme) {
      localStorage.setItem('theme', newSettings.theme);
    }

    const userId = user?.id || user?._id;
    if (!user || !userId) {
      // If not logged in, we just stick with local state update
      return { success: true, settings: newSettings };
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.put(
        `/settings/${userId}`,
        { settings: newSettings },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      const persistedSettings = data?.settings || data?.settings?.settings || newSettings;

      // Sync state with what backend actually saved
      setSettings(persistedSettings);
      return { success: true, settings: persistedSettings };
    } catch (err) {
      console.error('Failed to sync settings with backend:', err);
      // We don't revert state here because local session is still active
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        updateSettings,
        fetchSettings,
        hasLoaded
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};