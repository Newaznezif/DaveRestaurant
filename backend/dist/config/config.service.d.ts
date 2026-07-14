import { ConfigService } from '@nestjs/config';
export declare class AppConfigService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    get nodeEnv(): string;
    get isProduction(): boolean;
    get isDevelopment(): boolean;
    get isTest(): boolean;
    get port(): number;
    get apiPrefix(): string;
    get apiVersion(): string;
    get apiGlobalPrefix(): string;
    get databaseUrl(): string;
    get redis(): {
        host: string;
        port: number;
        password: string;
    };
    get jwt(): {
        accessSecret: string;
        refreshSecret: string;
        accessExpiry: string;
        refreshExpiry: string;
    };
    get encryptionKey(): string;
    get cors(): {
        origins: string[];
        frontendUrl: string;
    };
    get throttle(): {
        ttl: number;
        limit: number;
    };
    get logging(): {
        level: string;
        format: string;
    };
    get swagger(): {
        enabled: boolean;
        title: string;
        description: string;
        version: string;
    };
    get smtp(): {
        host: string;
        port: number;
        user: string;
        pass: string;
        from: string;
    };
    get storage(): {
        driver: string;
    };
    get upload(): {
        maxSize: number;
        allowedTypes: string[];
        dest: string;
    };
}
