// Cache utility for performance optimization

// In-memory cache storage
const cacheStorage: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

// Default TTL (Time To Live) in milliseconds (5 minutes)
const DEFAULT_TTL = 5 * 60 * 1000;

// Set item in cache
export const setCache = (key: string, data: any, ttl: number = DEFAULT_TTL): void => {
  cacheStorage.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

// Get item from cache
export const getCache = (key: string): any => {
  const cachedItem = cacheStorage.get(key);
  
  if (!cachedItem) {
    return null;
  }
  
  // Check if item has expired
  if (Date.now() - cachedItem.timestamp > cachedItem.ttl) {
    // Remove expired item
    cacheStorage.delete(key);
    return null;
  }
  
  return cachedItem.data;
};

// Remove item from cache
export const removeCache = (key: string): void => {
  cacheStorage.delete(key);
};

// Clear all cache
export const clearCache = (): void => {
  cacheStorage.clear();
};

// Get cache size
export const getCacheSize = (): number => {
  return cacheStorage.size;
};

// Get cache keys
export const getCacheKeys = (): string[] => {
  return Array.from(cacheStorage.keys());
};

// Clean expired cache items
export const cleanExpiredCache = (): void => {
  const now = Date.now();
  const expiredKeys: string[] = [];
  
  cacheStorage.forEach((value, key) => {
    if (now - value.timestamp > value.ttl) {
      expiredKeys.push(key);
    }
  });
  
  expiredKeys.forEach(key => cacheStorage.delete(key));
};

// Periodically clean expired cache items (every 5 minutes)
setInterval(cleanExpiredCache, 5 * 60 * 1000);

// LocalStorage cache utilities
export const setLocalStorageCache = (key: string, data: any, ttl: number = DEFAULT_TTL): void => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (e) {
    console.warn('Failed to set localStorage cache:', e);
  }
};

export const getLocalStorageCache = (key: string): any => {
  try {
    const cachedItemStr = localStorage.getItem(key);
    
    if (!cachedItemStr) {
      return null;
    }
    
    const cachedItem = JSON.parse(cachedItemStr);
    
    // Check if item has expired
    if (Date.now() - cachedItem.timestamp > cachedItem.ttl) {
      // Remove expired item
      localStorage.removeItem(key);
      return null;
    }
    
    return cachedItem.data;
  } catch (e) {
    console.warn('Failed to get localStorage cache:', e);
    return null;
  }
};

export const removeLocalStorageCache = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('Failed to remove localStorage cache:', e);
  }
};

// SessionStorage cache utilities
export const setSessionStorageCache = (key: string, data: any, ttl: number = DEFAULT_TTL): void => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl
    };
    sessionStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (e) {
    console.warn('Failed to set sessionStorage cache:', e);
  }
};

export const getSessionStorageCache = (key: string): any => {
  try {
    const cachedItemStr = sessionStorage.getItem(key);
    
    if (!cachedItemStr) {
      return null;
    }
    
    const cachedItem = JSON.parse(cachedItemStr);
    
    // Check if item has expired
    if (Date.now() - cachedItem.timestamp > cachedItem.ttl) {
      // Remove expired item
      sessionStorage.removeItem(key);
      return null;
    }
    
    return cachedItem.data;
  } catch (e) {
    console.warn('Failed to get sessionStorage cache:', e);
    return null;
  }
};

export const removeSessionStorageCache = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (e) {
    console.warn('Failed to remove sessionStorage cache:', e);
  }
};