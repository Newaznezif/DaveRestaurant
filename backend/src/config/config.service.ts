import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  private readonly logger = new Logger(AppConfigService.name);

  constructor(private readonly configService: ConfigService) {
    this.logger.log(`Environment: ${this.nodeEnv}`);
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get port(): number {
    return this.configService.get<number>('PORT', 4000);
  }

  get apiPrefix(): string {
    return this.configService.get<string>('API_PREFIX', 'api');
  }

  get apiVersion(): string {
    return this.configService.get<string>('API_VERSION', 'v1');
  }

  get apiGlobalPrefix(): string {
    return `${this.apiPrefix}/${this.apiVersion}`;
  }

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL', '');
  }

  get redis(): { host: string; port: number; password: string } {
    return {
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD', ''),
    };
  }

  get jwt(): {
    accessSecret: string;
    refreshSecret: string;
    accessExpiry: string;
    refreshExpiry: string;
  } {
    return {
      accessSecret: this.configService.get<string>('JWT_ACCESS_SECRET', ''),
      refreshSecret: this.configService.get<string>('JWT_REFRESH_SECRET', ''),
      accessExpiry: this.configService.get<string>('JWT_ACCESS_EXPIRY', '15m'),
      refreshExpiry: this.configService.get<string>('JWT_REFRESH_EXPIRY', '7d'),
    };
  }

  get encryptionKey(): string {
    return this.configService.get<string>('ENCRYPTION_KEY', '');
  }

  get cors(): { origins: string[]; frontendUrl: string } {
    const originsStr = this.configService.get<string>('CORS_ORIGINS', 'http://localhost:3000');
    return {
      origins: originsStr.split(',').map((o) => o.trim()),
      frontendUrl: this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000'),
    };
  }

  get throttle(): { ttl: number; limit: number } {
    return {
      ttl: this.configService.get<number>('THROTTLE_TTL', 60000),
      limit: this.configService.get<number>('THROTTLE_LIMIT', 100),
    };
  }

  get logging(): { level: string; format: string } {
    return {
      level: this.configService.get<string>('LOG_LEVEL', 'debug'),
      format: this.configService.get<string>('LOG_FORMAT', 'json'),
    };
  }

  get swagger(): { enabled: boolean; title: string; description: string; version: string } {
    return {
      enabled: this.configService.get<boolean>('SWAGGER_ENABLED', true),
      title: this.configService.get<string>('SWAGGER_TITLE', 'DaveRestaurant API'),
      description: this.configService.get<string>(
        'SWAGGER_DESCRIPTION',
        'Enterprise Restaurant Management System API',
      ),
      version: this.configService.get<string>('SWAGGER_VERSION', '1.0'),
    };
  }

  get smtp(): {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  } {
    return {
      host: this.configService.get<string>('SMTP_HOST', 'smtp.mailtrap.io'),
      port: this.configService.get<number>('SMTP_PORT', 2525),
      user: this.configService.get<string>('SMTP_USER', ''),
      pass: this.configService.get<string>('SMTP_PASS', ''),
      from: this.configService.get<string>('SMTP_FROM', 'noreply@daverestaurant.com'),
    };
  }

  get storage(): { driver: string } {
    return {
      driver: this.configService.get<string>('STORAGE_DRIVER', 'local'),
    };
  }

  get upload(): { maxSize: number; allowedTypes: string[]; dest: string } {
    return {
      maxSize: this.configService.get<number>('UPLOAD_MAX_SIZE', 5242880),
      allowedTypes: this.configService
        .get<string>('UPLOAD_ALLOWED_TYPES', 'image/jpeg,image/png,image/webp,application/pdf')
        .split(','),
      dest: this.configService.get<string>('UPLOAD_DEST', './uploads'),
    };
  }
}