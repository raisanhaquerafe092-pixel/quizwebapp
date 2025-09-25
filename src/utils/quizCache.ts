/**
 * Quiz Cache Utility for PWA Offline Support
 * Provides caching functionality for quiz questions to enable offline mode
 */

export interface CachedQuizData {
  mcqQuestions: any[];
  shortQuestions: any[];
  longQuestions: any[];
  lastUpdated: number;
  classNameValue: string;
  subject: string;
}

const CACHE_PREFIX = 'quiz_cache_';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export class QuizCache {
  private static getCacheKey(classNameValue: string, subject: string): string {
    return `${CACHE_PREFIX}${classNameValue}_${subject}`.toLowerCase();
  }

  /**
   * Store quiz data in localStorage with timestamp
   */
  static async setQuizData(
    classNameValue: string,
    subject: string,
    mcqQuestions: any[],
    shortQuestions: any[],
    longQuestions: any[]
  ): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(classNameValue, subject);
      const cacheData: CachedQuizData = {
        mcqQuestions,
        shortQuestions,
        longQuestions,
        lastUpdated: Date.now(),
        classNameValue,
        subject
      };

      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache quiz data:', error);
    }
  }

  /**
   * Retrieve quiz data from localStorage if not expired
   */
  static async getQuizData(
    classNameValue: string,
    subject: string
  ): Promise<CachedQuizData | null> {
    try {
      const cacheKey = this.getCacheKey(classNameValue, subject);
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) {
        return null;
      }

      const cacheData: CachedQuizData = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - cacheData.lastUpdated > CACHE_EXPIRY_MS) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return cacheData;
    } catch (error) {
      console.error('Failed to retrieve cached quiz data:', error);
      return null;
    }
  }

  /**
   * Check if quiz data is available in cache
   */
  static async isCached(classNameValue: string, subject: string): Promise<boolean> {
    const cached = await this.getQuizData(classNameValue, subject);
    return cached !== null;
  }

  /**
   * Clear specific quiz cache
   */
  static async clearQuizData(classNameValue: string, subject: string): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(classNameValue, subject);
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Failed to clear cached quiz data:', error);
    }
  }

  /**
   * Clear all quiz caches
   */
  static async clearAllCache(): Promise<void> {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear all quiz cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    totalCached: number;
    cacheSize: string;
    oldestCache?: Date;
    newestCache?: Date;
  }> {
    try {
      let totalCached = 0;
      let totalSize = 0;
      let oldestTimestamp = Infinity;
      let newestTimestamp = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          totalCached++;
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += value.length * 2; // Approximate bytes (UTF-16)
            
            try {
              const cacheData: CachedQuizData = JSON.parse(value);
              if (cacheData.lastUpdated < oldestTimestamp) {
                oldestTimestamp = cacheData.lastUpdated;
              }
              if (cacheData.lastUpdated > newestTimestamp) {
                newestTimestamp = cacheData.lastUpdated;
              }
            } catch {
              // Invalid cache data, ignore
            }
          }
        }
      }

      return {
        totalCached,
        cacheSize: `${(totalSize / 1024).toFixed(2)} KB`,
        oldestCache: oldestTimestamp !== Infinity ? new Date(oldestTimestamp) : undefined,
        newestCache: newestTimestamp !== 0 ? new Date(newestTimestamp) : undefined
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {
        totalCached: 0,
        cacheSize: '0 KB'
      };
    }
  }

  /**
   * Check if device is online
   */
  static isOnline(): boolean {
    return navigator.onLine;
  }
}

export default QuizCache;