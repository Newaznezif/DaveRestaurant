import { OnModuleInit } from '@nestjs/common';
export declare class RedisService implements OnModuleInit {
    private readonly logger;
    private redis;
    private isEnabled;
    private hasLoggedWarning;
    constructor();
    onModuleInit(): void;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    incr(key: string): Promise<number>;
    expire(key: string, ttl: number): Promise<void>;
    ttl(key: string): Promise<number>;
    storeOTP(key: string, otp: string, ttl?: number): Promise<void>;
    getOTP(key: string): Promise<string | null>;
    deleteOTP(key: string): Promise<void>;
    incrementRateLimit(key: string, ttl: number): Promise<number>;
    getRateLimit(key: string): Promise<number>;
    storeSession(sessionId: string, data: object, ttl: number): Promise<void>;
    getSession(sessionId: string): Promise<object | null>;
    deleteSession(sessionId: string): Promise<void>;
    cacheGet(key: string): Promise<string | null>;
    cacheSet(key: string, value: string, ttl: number): Promise<void>;
    cacheDel(key: string): Promise<void>;
    flushAll(): Promise<void>;
    disconnect(): Promise<void>;
}
