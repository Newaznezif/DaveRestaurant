"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let RedisService = RedisService_1 = class RedisService {
    constructor() {
        this.logger = new common_1.Logger(RedisService_1.name);
        this.redis = null;
        this.hasLoggedWarning = false;
        this.isEnabled = process.env.REDIS_ENABLED !== 'false';
    }
    onModuleInit() {
        if (!this.isEnabled) {
            this.logger.warn('Redis is disabled (REDIS_ENABLED=false). Using fallback storage.');
            return;
        }
        try {
            this.redis = new ioredis_1.Redis({
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
        }
        catch (error) {
            this.logger.warn('Failed to initialize Redis. Using fallback storage.');
            this.redis = null;
        }
    }
    async get(key) {
        if (!this.redis) {
            return null;
        }
        try {
            return await this.redis.get(key);
        }
        catch (error) {
            if (!this.hasLoggedWarning) {
                this.logger.warn('Redis operation failed. Using fallback storage.');
                this.hasLoggedWarning = true;
            }
            return null;
        }
    }
    async set(key, value, ttl) {
        if (!this.redis) {
            return;
        }
        try {
            if (ttl) {
                await this.redis.setex(key, ttl, value);
            }
            else {
                await this.redis.set(key, value);
            }
        }
        catch (error) {
            if (!this.hasLoggedWarning) {
                this.logger.warn('Redis operation failed. Using fallback storage.');
                this.hasLoggedWarning = true;
            }
        }
    }
    async del(key) {
        if (!this.redis) {
            return;
        }
        try {
            await this.redis.del(key);
        }
        catch (error) {
            if (!this.hasLoggedWarning) {
                this.logger.warn('Redis operation failed. Using fallback storage.');
                this.hasLoggedWarning = true;
            }
        }
    }
    async exists(key) {
        if (!this.redis) {
            return false;
        }
        try {
            const result = await this.redis.exists(key);
            return result === 1;
        }
        catch (error) {
            if (!this.hasLoggedWarning) {
                this.logger.warn('Redis operation failed. Using fallback storage.');
                this.hasLoggedWarning = true;
            }
            return false;
        }
    }
    async incr(key) {
        if (!this.redis) {
            return 0;
        }
        try {
            return await this.redis.incr(key);
        }
        catch (error) {
            if (!this.hasLoggedWarning) {
                this.logger.warn('Redis operation failed. Using fallback storage.');
                this.hasLoggedWarning = true;
            }
            return 0;
        }
    }
    async expire(key, ttl) {
        if (!this.redis) {
            return;
        }
        try {
            await this.redis.expire(key, ttl);
        }
        catch (error) {
            if (!this.hasLoggedWarning) {
                this.logger.warn('Redis operation failed. Using fallback storage.');
                this.hasLoggedWarning = true;
            }
        }
    }
    async ttl(key) {
        if (!this.redis) {
            return -1;
        }
        try {
            return await this.redis.ttl(key);
        }
        catch (error) {
            if (!this.hasLoggedWarning) {
                this.logger.warn('Redis operation failed. Using fallback storage.');
                this.hasLoggedWarning = true;
            }
            return -1;
        }
    }
    async storeOTP(key, otp, ttl = 600) {
        await this.set(`otp:${key}`, otp, ttl);
    }
    async getOTP(key) {
        return this.get(`otp:${key}`);
    }
    async deleteOTP(key) {
        await this.del(`otp:${key}`);
    }
    async incrementRateLimit(key, ttl) {
        const count = await this.incr(key);
        if (count === 1) {
            await this.expire(key, ttl);
        }
        return count;
    }
    async getRateLimit(key) {
        const value = await this.get(key);
        return value ? parseInt(value, 10) : 0;
    }
    async storeSession(sessionId, data, ttl) {
        await this.set(`session:${sessionId}`, JSON.stringify(data), ttl);
    }
    async getSession(sessionId) {
        const data = await this.get(`session:${sessionId}`);
        return data ? JSON.parse(data) : null;
    }
    async deleteSession(sessionId) {
        await this.del(`session:${sessionId}`);
    }
    async cacheGet(key) {
        return this.get(`cache:${key}`);
    }
    async cacheSet(key, value, ttl) {
        await this.set(`cache:${key}`, value, ttl);
    }
    async cacheDel(key) {
        await this.del(`cache:${key}`);
    }
    async flushAll() {
        if (!this.redis) {
            return;
        }
        try {
            await this.redis.flushall();
        }
        catch (error) {
            if (!this.hasLoggedWarning) {
                this.logger.warn('Redis operation failed. Using fallback storage.');
                this.hasLoggedWarning = true;
            }
        }
    }
    async disconnect() {
        if (this.redis) {
            await this.redis.quit();
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RedisService);
//# sourceMappingURL=redis.service.js.map