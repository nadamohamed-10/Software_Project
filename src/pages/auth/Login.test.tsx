import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { vi } from 'vitest';

// Mock the AuthContext
const mockLogin = vi.fn().mockResolvedValue(undefined);
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /login to your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should show error when login fails', async () => {
    // Mock the login function to simulate a failed login
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill in form with invalid credentials
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'invalid@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('should handle successful login', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill in form
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Should call login function
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123', false);
    });
  });

  it('should show loading state during login', async () => {
    // Override the mock to simulate a delayed login
    mockLogin.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(undefined), 100))
    );
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill in form
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Should show loading state immediately after click
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should link to register page', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const registerLink = screen.getByRole('link', { name: /register here/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});