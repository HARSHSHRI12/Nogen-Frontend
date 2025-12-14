import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate fetching user data from localStorage or an API
     const userStr = localStorage.getItem('user');
     if (userStr) {
       try {
         const savedUser = JSON.parse(userStr);
         if (savedUser) {
           setUser(savedUser);
         }
       } catch (error) {
         console.error('Failed to parse user:', error);
         localStorage.removeItem('user');
       }
     }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear from localStorage when logging out
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
