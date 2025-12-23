import React, { createContext, useContext, useState, useCallback } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from './AuthContext';

export const SettingsContext = createContext();

// Default settings
const DEFAULT_SETTINGS = {
  theme: 'light',
  fontSize: 'medium',
  textStyle: 'default'
};

export const SettingsProvider = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Fetch settings only when explicitly called
  const fetchSettings = useCallback(async () => {
    if (!user || !user.id) {
      setError(new Error('User not authenticated'));
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`/settings/${user.id}`, {
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
    if (!user || !user.id) {
      setError(new Error('User not authenticated'));
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Send the settings under a `settings` key to match backend expectation
      const response = await axiosInstance.put(
        `/settings/${user.id}`,
        { settings: newSettings },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      // Update local settings with the backend's persisted settings if provided
      const persistedSettings = data?.settings || data?.settings?.settings || newSettings;
      setSettings(persistedSettings);
      return { success: true, settings: persistedSettings };
    } catch (err) {
      setError(err);
      // Try to extract server message
      const message = err?.response?.data?.message || err.message || 'Unknown error';
      return { success: false, error: message };
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