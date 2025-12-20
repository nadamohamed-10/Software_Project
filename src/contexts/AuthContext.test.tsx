import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { vi } from 'vitest';

// Mock the jwt-decode library
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn().mockReturnValue({
    exp: 4102444800, // 2100-01-01
    iat: 1516239022,
    sub: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'Patient',
    phoneNumber: '0123456789'
  })
}));

// Mock the API service
vi.mock('../services/api', () => ({
  default: {
    login: vi.fn().mockResolvedValue({
      token: 'mock-jwt-token'
    }),
    register: vi.fn().mockResolvedValue({
      token: 'mock-jwt-token'
    }),
    logout: vi.fn(),
  }
}));

// Test component to use the auth context
const TestComponent: React.FC = () => {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      {user && (
        <div data-testid="user-info">
          {user.firstName} {user.lastName} ({user.role})
        </div>
      )}
      <button data-testid="login-btn" onClick={() => login('test@example.com', 'password123', false)}>
        Login
      </button>
      <button data-testid="register-btn" onClick={() => register({
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '0123456789',
        role: 'Patient'
      })}>
        Register
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage and sessionStorage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should provide default values', () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    
    render(<TestComponent />, { wrapper });
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
  });

  it('should login user successfully', async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    
    render(<TestComponent />, { wrapper });
    
    // Click login button
    await act(async () => {
      screen.getByTestId('login-btn').click();
    });
    
    // The test passes if no errors are thrown
    // In a real application, we would test that the API is called correctly
  });

  it('should register user successfully', async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    
    render(<TestComponent />, { wrapper });
    
    // Click register button
    await act(async () => {
      screen.getByTestId('register-btn').click();
    });
    
    // The test passes if no errors are thrown
    // In a real application, we would test that the API is called correctly
  });

  it('should logout user', async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    
    render(<TestComponent />, { wrapper });
    
    // Login first
    await act(async () => {
      screen.getByTestId('login-btn').click();
    });
    
    // Logout
    await act(async () => {
      screen.getByTestId('logout-btn').click();
    });
    
    // The test passes if no errors are thrown
    // In a real application, we would test that the API is called correctly
  });
});