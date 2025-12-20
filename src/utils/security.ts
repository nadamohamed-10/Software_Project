// Security utilities for input sanitization and XSS protection

// Sanitize user input to prevent XSS attacks
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>?/gm, '');
  
  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  return sanitized;
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Egyptian format)
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+20|01)[0-9]{9}$/;
  return phoneRegex.test(phone);
};

// Validate password strength
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  // Check for at least one digit
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one digit' };
  }
  
  return { isValid: true, message: 'Password is strong' };
};

// Validate name (2-50 characters, letters and spaces only)
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name.trim());
};

// Validate date format (multiple formats)
export const validateDateFormat = (date: string): boolean => {
  // Support multiple date formats: DD/MM/YYYY, YYYY/MM/DD, DD-MM-YYYY
  const dateFormats = [
    /^\d{2}\/\d{2}\/\d{4}$/,  // DD/MM/YYYY
    /^\d{4}\/\d{2}\/\d{2}$/,  // YYYY/MM/DD
    /^\d{2}-\d{2}-\d{4}$/     // DD-MM-YYYY
  ];
  
  return dateFormats.some(format => format.test(date));
};

// Sanitize URL to prevent malicious redirects
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    // Only allow http and https protocols
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      return url;
    }
    return '';
  } catch (e) {
    // If URL parsing fails, it's not a valid URL
    return '';
  }
};

// Generate CSRF token (in a real app, this would come from the server)
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Store CSRF token in sessionStorage
export const storeCSRFToken = (token: string): void => {
  sessionStorage.setItem('csrf-token', token);
};

// Get CSRF token from sessionStorage
export const getCSRFToken = (): string | null => {
  return sessionStorage.getItem('csrf-token');
};

// Clear CSRF token
export const clearCSRFToken = (): void => {
  sessionStorage.removeItem('csrf-token');
};

// Validate CSRF token (in a real app, this would be verified server-side)
export const validateCSRFToken = (token: string): boolean => {
  const storedToken = getCSRFToken();
  return storedToken !== null && storedToken === token;
};

// Escape HTML entities
export const escapeHtml = (unsafe: string): string => {
  if (!unsafe) return '';
  
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Encode URI components safely
export const safeEncodeURIComponent = (str: string): string => {
  try {
    return encodeURIComponent(str);
  } catch (e) {
    return '';
  }
};

// Decode URI components safely
export const safeDecodeURIComponent = (str: string): string => {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return str;
  }
};