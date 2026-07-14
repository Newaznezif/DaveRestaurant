import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private redis: Redis;

  constructor() {
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
    });

    this.redis.on('error', (error) => {
      this.logger.error('Redis connection error', error);
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      this.logger.error(`Failed to get key ${key}`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redis.setex(key, ttl, value);
      } else {
        await this.redis.set(key, value);
      }
    } catch (error) {
      this.logger.error(`Failed to set key ${key}`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(`Failed to delete key ${key}`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to check if key ${key} exists`, error);
      return false;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      return await this.redis.incr(key);
    } catch (error) {
      this.logger.error(`Failed to increment key ${key}`, error);
      return 0;
    }
  }

  async expire(key: string, ttl: number): Promise<void> {
    try {
      await this.redis.expire(key, ttl);
    } catch (error) {
      this.logger.error(`Failed to set expiry for key ${key}`, error);
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      this.logger.error(`Failed to get TTL for key ${key}`, error);
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
    try {
      await this.redis.flushall();
    } catch (error) {
      this.logger.error('Failed to flush Redis', error);
    }
  }

  async disconnect(): Promise<void> {
    await this.redis.quit();
  }
}