import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // 1. Try loading from localStorage first for immediate UI responsiveness
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        } catch (e) {
          localStorage.removeItem('userData');
        }
      }

      // 2. Verify with backend to ensure session is still valid
      try {
        const response = await axiosInstance.get('/auth/user');
        if (response.data) {
          const userData = {
            id: response.data._id || response.data.id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
            avatar: response.data.avatar
          };
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      } catch (error) {
        // Only logout if it's a 401 (Unauthorized)
        if (error.response?.status === 401) {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('userData');
        }
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData) => {
    // Standardize user data format
    const formattedUser = {
      id: userData._id || userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatar: userData.avatar
    };
    localStorage.setItem('userData', JSON.stringify(formattedUser));
    setUser(formattedUser);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear user data and authentication status regardless of success
      localStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (updatedData) => {
    setUser(currentUser => {
      if (!currentUser) return null; // Should not happen if authenticated
      const newUserData = { ...currentUser, ...updatedData };
      localStorage.setItem('userData', JSON.stringify(newUserData));
      return newUserData;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
