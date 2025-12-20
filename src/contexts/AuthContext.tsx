import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiService, { LoginRequest, RegisterRequest, AuthResponse } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Patient' | 'Doctor';
  phoneNumber: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isTokenValid: () => boolean;
}

interface RegisterData extends RegisterRequest {}

interface JwtPayload {
  exp: number;
  iat: number;
  sub: string;
  role: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing token on app load
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (storedToken) {
      // Check if it's a mock token
      if (storedToken.startsWith('mock_token_')) {
        // Extract email from mock token
        const parts = storedToken.split('_');
        const email = parts.slice(3).join('_');
        const mockUser: User = {
          id: email,
          email: email,
          firstName: email.split('@')[0] || 'Test',
          lastName: 'User',
          role: email.includes('doctor') ? 'Doctor' : 'Patient',
          phoneNumber: '555-0100',
        };
        setToken(storedToken);
        setUser(mockUser);
      } else if (isTokenValid(storedToken)) {
        setToken(storedToken);
        decodeAndSetUser(storedToken);
      }
    }
  }, []);

  const isTokenValid = (tokenToCheck: string): boolean => {
    try {
      // Mock tokens are always valid
      if (tokenToCheck.startsWith('mock_token_')) {
        return true;
      }
      const decoded: JwtPayload = jwtDecode(tokenToCheck);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  const decodeAndSetUser = (tokenToDecode: string) => {
    try {
      const decoded: JwtPayload = jwtDecode(tokenToDecode);
      const userData: User = {
        id: decoded.sub,
        email: decoded.sub, // Assuming sub contains email
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role as 'Patient' | 'Doctor',
        phoneNumber: decoded.phoneNumber,
      };
      setUser(userData);
    } catch (error) {
      console.error('Error decoding token:', error);
      logout();
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean): Promise<void> => {
    // TESTING MODE: Accept any email/password for demo purposes
    // Create a mock token with user data
    const mockUser: User = {
      id: email,
      email: email,
      firstName: email.split('@')[0] || 'Test',
      lastName: 'User',
      role: email.includes('doctor') ? 'Doctor' : 'Patient',
      phoneNumber: '555-0100',
    };
    
    // Create a simple mock token (not a real JWT, just for testing)
    const mockToken = `mock_token_${Date.now()}_${email}`;
    
    // Store token based on rememberMe preference
    if (rememberMe) {
      localStorage.setItem('token', mockToken);
    } else {
      sessionStorage.setItem('token', mockToken);
    }
    
    // Set state - this will make isAuthenticated true
    setToken(mockToken);
    setUser(mockUser);
    
    // Wait for next tick to ensure state is updated
    await new Promise(resolve => setTimeout(resolve, 0));
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      const registerData: RegisterRequest = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        ...(userData.role === 'Patient' && {
          gender: userData.gender,
          dateOfBirth: userData.dateOfBirth
        })
      };
      
      const response: AuthResponse = await apiService.register(registerData);
      
      setToken(response.token);
      decodeAndSetUser(response.token);
    } catch (error) {
      throw new Error((error as Error).message || 'Registration failed');
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    apiService.logout();
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
    isTokenValid: () => token ? isTokenValid(token) : false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};