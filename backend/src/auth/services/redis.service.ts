import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);
  private redis: Redis | null = null;
  private isEnabled: boolean;
  private hasLoggedWarning: boolean = false;

  constructor() {
    this.isEnabled = process.env.REDIS_ENABLED !== 'false';
  }

  onModuleInit() {
    if (!this.isEnabled) {
      this.logger.warn('Redis is disabled (REDIS_ENABLED=false). Using fallback storage.');
      return;
    }

    try {
      this.redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      this.redis.on('connect', () => {
        this.logger.log('Connected to Redis');
        this.hasLoggedWarning = false;
      });

      this.redis.on('error', (error) => {
        if (!this.hasLoggedWarning) {
          this.logger.warn('Redis connection failed. Using fallback storage for OTPs and caching.');
          this.hasLoggedWarning = true;
        }
      });
    } catch (error) {
      this.logger.warn('Failed to initialize Redis. Using fallback storage.');
      this.redis = null;
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.redis) {
      return null;
    }
    try {
      return await this.redis.get(key);
    } catch (error) {
      if (!this.hasLoggedWarning) {
        this.logger.warn('Redis operation failed. Using fallback storage.');
        this.hasLoggedWarning = true;
      }
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.redis) {
      return;
    }
    try {
      if (ttl) {
        await this.redis.setex(key, ttl, value);
      } else {
        await this.redis.set(key, value);
      }
    } catch (error) {
      if (!this.hasLoggedWarning) {
        this.logger.warn('Redis operation failed. Using fallback storage.');
        this.hasLoggedWarning = true;
      }
    }
  }

  async del(key: string): Promise<void> {
    if (!this.redis) {
      return;
    }
    try {
      await this.redis.del(key);
    } catch (error) {
      if (!this.hasLoggedWarning) {
        this.logger.warn('Redis operation failed. Using fallback storage.');
        this.hasLoggedWarning = true;
      }
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.redis) {
      return false;
    }
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      if (!this.hasLoggedWarning) {
        this.logger.warn('Redis operation failed. Using fallback storage.');
        this.hasLoggedWarning = true;
      }
      return false;
    }
  }

  async incr(key: string): Promise<number> {
    if (!this.redis) {
      return 0;
    }
    try {
      return await this.redis.incr(key);
    } catch (error) {
      if (!this.hasLoggedWarning) {
        this.logger.warn('Redis operation failed. Using fallback storage.');
        this.hasLoggedWarning = true;
      }
      return 0;
    }
  }

  async expire(key: string, ttl: number): Promise<void> {
    if (!this.redis) {
      return;
    }
    try {
      await this.redis.expire(key, ttl);
    } catch (error) {
      if (!this.hasLoggedWarning) {
        this.logger.warn('Redis operation failed. Using fallback storage.');
        this.hasLoggedWarning = true;
      }
    }
  }

  async ttl(key: string): Promise<number> {
    if (!this.redis) {
      return -1;
    }
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      if (!this.hasLoggedWarning) {
        this.logger.warn('Redis operation failed. Using fallback storage.');
        this.hasLoggedWarning = true;
      }
      return -1;
    }
  }

  async storeOTP(key: string, otp: string, ttl: number = 600): Promise<void> {
    await this.set(`otp:${key}`, otp, ttl);
  }

  async getOTP(key: string): Promise<string | null> {
    return this.get(`otp:${key}`);
  }

  async deleteOTP(key: string): Promise<void> {
    await this.del(`otp:${key}`);
  }

  async incrementRateLimit(key: string, ttl: number): Promise<number> {
    const count = await this.incr(key);
    if (count === 1) {
      await this.expire(key, ttl);
    }
    return count;
  }

  async getRateLimit(key: string): Promise<number> {
    const value = await this.get(key);
    return value ? parseInt(value, 10) : 0;
  }

  async storeSession(sessionId: string, data: object, ttl: number): Promise<void> {
    await this.set(`session:${sessionId}`, JSON.stringify(data), ttl);
  }

  async getSession(sessionId: string): Promise<object | null> {
    const data = await this.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.del(`session:${sessionId}`);
  }

  async cacheGet(key: string): Promise<string | null> {
    return this.get(`cache:${key}`);
  }

  async cacheSet(key: string, value: string, ttl: number): Promise<void> {
    await this.set(`cache:${key}`, value, ttl);
  }

  async cacheDel(key: string): Promise<void> {
    await this.del(`cache:${key}`);
  }

  async flushAll(): Promise<void> {
    if (!this.redis) {
      return;
    }
    try {
      await this.redis.flushall();
    } catch (error) {
      if (!this.hasLoggedWarning) {
        this.logger.warn('Redis operation failed. Using fallback storage.');
        this.hasLoggedWarning = true;
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}