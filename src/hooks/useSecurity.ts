import { useState, useEffect } from 'react';
import { 
  sanitizeInput, 
  validateEmail, 
  validatePhoneNumber, 
  validateName, 
  validatePassword,
  validateDateFormat,
  sanitizeUrl,
  generateCSRFToken,
  storeCSRFToken,
  getCSRFToken,
  validateCSRFToken
} from '../utils/security';

// Custom hook for security-related functionality
export const useSecurity = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  // Initialize CSRF token
  useEffect(() => {
    const token = getCSRFToken() || generateCSRFToken();
    storeCSRFToken(token);
    setCsrfToken(token);
  }, []);

  // Sanitize user input
  const sanitize = (input: string): string => {
    return sanitizeInput(input);
  };

  // Validate form field
  const validateField = (
    fieldName: string, 
    value: string
  ): { isValid: boolean; message: string } => {
    switch (fieldName) {
      case 'email':
        return {
          isValid: validateEmail(value),
          message: validateEmail(value) ? '' : 'Please enter a valid email address'
        };
      
      case 'phone':
        return {
          isValid: validatePhoneNumber(value),
          message: validatePhoneNumber(value) ? '' : 'Please enter a valid Egyptian phone number'
        };
      
      case 'name':
        return {
          isValid: validateName(value),
          message: validateName(value) ? '' : 'Name must be 2-50 characters and contain only letters'
        };
      
      case 'password':
        return validatePassword(value);
      
      case 'date':
        return {
          isValid: validateDateFormat(value),
          message: validateDateFormat(value) ? '' : 'Please enter a valid date format'
        };
      
      default:
        return {
          isValid: true,
          message: ''
        };
    }
  };

  // Sanitize URL
  const sanitizeUrlInput = (url: string): string => {
    return sanitizeUrl(url);
  };

  // Get CSRF token
  const getCSRFTokenValue = (): string | null => {
    return csrfToken;
  };

  // Validate CSRF token
  const validateCSRF = (token: string): boolean => {
    return validateCSRFToken(token);
  };

  // Refresh CSRF token
  const refreshCSRFToken = (): string => {
    const newToken = generateCSRFToken();
    storeCSRFToken(newToken);
    setCsrfToken(newToken);
    return newToken;
  };

  return {
    sanitize,
    validateField,
    sanitizeUrlInput,
    getCSRFToken: getCSRFTokenValue,
    validateCSRF,
    refreshCSRFToken
  };
};