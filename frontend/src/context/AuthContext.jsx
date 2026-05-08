import { createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // No authentication required - freely accessible
  const value = {
    user: null,
    loading: false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
