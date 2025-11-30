import React, { createContext, ReactNode, useContext, useState } from 'react';

type AuthResult = { success: boolean; role?: string; error?: string };

type AuthContextType = {
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  isAuthenticated: boolean;
  userRole: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    // replace with real API call
    try {
      // example: determine role from email for testing
      const role = email.includes('doctor') ? 'doctor' : 'patient';
      setIsAuthenticated(true);
      setUserRole(role);
      return { success: true, role };
    } catch (err) {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};