import {
  setCache,
  getCache,
  removeCache,
  clearCache,
  getCacheSize,
  getCacheKeys,
  setLocalStorageCache,
  getLocalStorageCache,
  removeLocalStorageCache
} from './cache';

describe('Cache Utilities', () => {
  beforeEach(() => {
    // Clear all caches before each test
    clearCache();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('In-Memory Cache', () => {
    it('should set and get cache items', () => {
      setCache('test-key', 'test-value');
      expect(getCache('test-key')).toBe('test-value');
    });

    it('should return null for non-existent keys', () => {
      expect(getCache('non-existent-key')).toBeNull();
    });

    it('should remove cache items', () => {
      setCache('test-key', 'test-value');
      expect(getCache('test-key')).toBe('test-value');
      
      removeCache('test-key');
      expect(getCache('test-key')).toBeNull();
    });

    it('should clear all cache items', () => {
      setCache('key1', 'value1');
      setCache('key2', 'value2');
      
      expect(getCacheSize()).toBe(2);
      
      clearCache();
      expect(getCacheSize()).toBe(0);
    });

    it('should handle cache expiration', () => {
      // Set item with short TTL (10ms)
      setCache('expiring-key', 'expiring-value', 10);
      
      // Item should be available immediately
      expect(getCache('expiring-key')).toBe('expiring-value');
      
      // Wait for item to expire
      return new Promise(resolve => {
        setTimeout(() => {
          expect(getCache('expiring-key')).toBeNull();
          resolve(true);
        }, 20);
      });
    });

    it('should get cache size and keys', () => {
      setCache('key1', 'value1');
      setCache('key2', 'value2');
      
      expect(getCacheSize()).toBe(2);
      expect(getCacheKeys()).toEqual(expect.arrayContaining(['key1', 'key2']));
    });
  });

  describe('LocalStorage Cache', () => {
    it('should set and get localStorage cache items', () => {
      setLocalStorageCache('local-test-key', 'local-test-value');
      expect(getLocalStorageCache('local-test-key')).toBe('local-test-value');
    });

    it('should return null for non-existent localStorage keys', () => {
      expect(getLocalStorageCache('non-existent-local-key')).toBeNull();
    });

    it('should handle localStorage cache expiration', () => {
      // Set item with short TTL (10ms)
      setLocalStorageCache('local-expiring-key', 'local-expiring-value', 10);
      
      // Item should be available immediately
      expect(getLocalStorageCache('local-expiring-key')).toBe('local-expiring-value');
      
      // Wait for item to expire
      return new Promise(resolve => {
        setTimeout(() => {
          expect(getLocalStorageCache('local-expiring-key')).toBeNull();
          resolve(true);
        }, 20);
      });
    });

    it('should remove localStorage cache items', () => {
      setLocalStorageCache('local-remove-key', 'local-remove-value');
      expect(getLocalStorageCache('local-remove-key')).toBe('local-remove-value');
      
      removeLocalStorageCache('local-remove-key');
      expect(getLocalStorageCache('local-remove-key')).toBeNull();
    });
  });
});