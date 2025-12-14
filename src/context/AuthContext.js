import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate fetching user data from localStorage or an API
     const userData = localStorage.getItem('userData');
     if (userData) {
       try {
         const savedUser = JSON.parse(userData);
         if (savedUser) {
           setUser(savedUser);
         }
       } catch (error) {
         console.error('Failed to parse userData:', error);
         localStorage.removeItem('userData');
       }
     }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userData'); // Clear from localStorage when logging out
    localStorage.removeItem('token'); // Also remove the token
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
