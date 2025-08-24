export interface CachedUrlData {
  id: string;
  shortCode: string;
  originalUrl: string;
  userId: string;
  isProtected: boolean;
  notifyOnAccess: boolean;
  active: boolean;
  authorizedEmails?: string[];
  userEmail: string;
}

export class CacheService {
  private kv: KVNamespace;
  private URL_PREFIX = "url:";
  private HOT_URL_PREFIX = "hot:";
  private ACCESS_COUNT_PREFIX = "access_count:";
  private URL_TTL = 7200; // 2 hour
  private HOT_URL_TTL = 14400; // 4 hours

  constructor(kvNamespace: KVNamespace) {
    this.kv = kvNamespace;
  }

  async cacheUrl(shortCode: string, urlData: CachedUrlData): Promise<void> {
    try {
      const key = `${this.URL_PREFIX}${shortCode}`;
      await this.kv.put(key, JSON.stringify(urlData), {
        expirationTtl: this.URL_TTL,
      });

      console.log(`Cached URL: ${shortCode}`);
    } catch (error) {
      console.error("Error caching URL:", error);
    }
  }

  async getCachedUrl(shortCode: string): Promise<CachedUrlData | null> {
    try {
      const key = `${this.URL_PREFIX}${shortCode}`;
      const cached = await this.kv.get(key);

      if (cached) {
        console.log(`Cache HIT for URL: ${shortCode}`);
        return JSON.parse(cached);
      }

      console.log(`Cache MISS for URL: ${shortCode}`);
      return null;
    } catch (error) {
      console.error("Error getting cached URL:", error);
      return null;
    }
  }

  async invalidateUrl(shortCode: string): Promise<void> {
    try {
      const key = `${this.URL_PREFIX}${shortCode}`;
      await this.kv.delete(key);

      const hotKey = `${this.HOT_URL_PREFIX}${shortCode}`;
      await this.kv.delete(hotKey);

      const accessKey = `${this.ACCESS_COUNT_PREFIX}${shortCode}`;
      await this.kv.delete(accessKey);

      console.log(`Invalidated cache for URL: ${shortCode}`);
    } catch (error) {
      console.error("Error invalidating URL cache:", error);
    }
  }

  async markAsHotUrl(shortCode: string, urlData: CachedUrlData): Promise<void> {
    try {
      const hotKey = `${this.HOT_URL_PREFIX}${shortCode}`;
      await this.kv.put(hotKey, JSON.stringify(urlData), {
        expirationTtl: this.HOT_URL_TTL,
      });

      console.log(`Marked as hot URL: ${shortCode}`);
    } catch (error) {
      console.error("Error marking hot URL:", error);
    }
  }

  async getHotUrl(shortCode: string): Promise<CachedUrlData | null> {
    try {
      const hotKey = `${this.HOT_URL_PREFIX}${shortCode}`;
      const cached = await this.kv.get(hotKey);

      if (cached) {
        console.log(`Hot URL cache HIT: ${shortCode}`);
        return JSON.parse(cached);
      }

      return null;
    } catch (error) {
      console.error("Error getting hot URL:", error);
      return null;
    }
  }

  async incrementUrlAccess(shortCode: string): Promise<number> {
    try {
      const accessKey = `${this.ACCESS_COUNT_PREFIX}${shortCode}`;
      const current = await this.kv.get(accessKey);
      const count = current ? parseInt(current) + 1 : 1;

      await this.kv.put(accessKey, count.toString(), {
        expirationTtl: 86400, // 24 hours
      });

      // If accessed more than 10 times in the last hour, mark as hot
      if (count > 10) {
        const urlData = await this.getCachedUrl(shortCode);
        if (urlData) {
          await this.markAsHotUrl(shortCode, urlData);
        }
      }

      return count;
    } catch (error) {
      console.error("Error incrementing URL access:", error);
      return 0;
    }
  }
}
