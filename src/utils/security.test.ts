import {
  sanitizeInput,
  validateEmail,
  validatePhoneNumber,
  validateName,
  validatePassword,
  validateDateFormat,
  sanitizeUrl
} from './security';

describe('Security Utilities', () => {
  describe('sanitizeInput', () => {
    it('should sanitize HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello World';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('alert(&quot;xss&quot;)Hello World');
    });

    it('should return empty string for null input', () => {
      const sanitized = sanitizeInput(null as any);
      expect(sanitized).toBe('');
    });

    it('should return empty string for undefined input', () => {
      const sanitized = sanitizeInput(undefined as any);
      expect(sanitized).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email format', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject incorrect email format', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate correct Egyptian phone number format (+20)', () => {
      expect(validatePhoneNumber('+20123456789')).toBe(true);
    });

    it('should validate correct Egyptian phone number format (01)', () => {
      expect(validatePhoneNumber('01234567890')).toBe(true);
    });

    it('should reject incorrect phone number format', () => {
      expect(validatePhoneNumber('1234567890')).toBe(false);
      expect(validatePhoneNumber('+201234567890')).toBe(false);
      expect(validatePhoneNumber('012345678901')).toBe(false);
    });
  });

  describe('validateName', () => {
    it('should validate correct name format', () => {
      expect(validateName('John')).toBe(true);
      expect(validateName('John Doe')).toBe(true);
      expect(validateName('Mary Jane Watson')).toBe(true);
    });

    it('should reject incorrect name format', () => {
      expect(validateName('J')).toBe(false); // Too short
      expect(validateName('A'.repeat(51))).toBe(false); // Too long
      expect(validateName('John123')).toBe(false); // Contains numbers
      expect(validateName('John@Doe')).toBe(false); // Contains special characters
    });
  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const result = validatePassword('Password123');
      expect(result.isValid).toBe(true);
    });

    it('should reject weak passwords', () => {
      // Too short
      expect(validatePassword('Pass1').isValid).toBe(false);
      
      // No uppercase
      expect(validatePassword('password123').isValid).toBe(false);
      
      // No lowercase
      expect(validatePassword('PASSWORD123').isValid).toBe(false);
      
      // No digits
      expect(validatePassword('Password').isValid).toBe(false);
    });
  });

  describe('validateDateFormat', () => {
    it('should validate correct date formats', () => {
      expect(validateDateFormat('20/12/2025')).toBe(true); // DD/MM/YYYY
      expect(validateDateFormat('2025/12/20')).toBe(true); // YYYY/MM/DD
      expect(validateDateFormat('20-12-2025')).toBe(true); // DD-MM-YYYY
    });

    it('should reject incorrect date formats', () => {
      expect(validateDateFormat('2025-12-20')).toBe(false); // YYYY-MM-DD not supported
      expect(validateDateFormat('20/12/25')).toBe(false); // YY instead of YYYY
      expect(validateDateFormat('December 20, 2025')).toBe(false); // Text format
    });
  });

  describe('sanitizeUrl', () => {
    it('should allow valid HTTP URLs', () => {
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
    });

    it('should reject invalid URLs', () => {
      expect(sanitizeUrl('javascript:alert("xss")')).toBe('');
      expect(sanitizeUrl('ftp://example.com')).toBe('');
      expect(sanitizeUrl('invalid-url')).toBe('');
    });

    it('should return empty string for null/undefined', () => {
      expect(sanitizeUrl(null as any)).toBe('');
      expect(sanitizeUrl(undefined as any)).toBe('');
    });
  });
});