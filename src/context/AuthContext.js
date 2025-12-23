import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Attempt to load user data from localStorage
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) { // Ensure user data is valid and has an ID
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        // Clear invalid data
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const login = (userData) => {
    // Store user data in localStorage (excluding tokens as they are HTTP-only)
    // The user object from the backend should already contain the 'id' (or '_id')
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear user data and authentication status
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
    // Backend will handle clearing HTTP-only cookies
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
