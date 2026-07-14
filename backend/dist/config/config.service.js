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
var AppConfigService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AppConfigService = AppConfigService_1 = class AppConfigService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(AppConfigService_1.name);
        this.logger.log(`Environment: ${this.nodeEnv}`);
    }
    get nodeEnv() {
        return this.configService.get('NODE_ENV', 'development');
    }
    get isProduction() {
        return this.nodeEnv === 'production';
    }
    get isDevelopment() {
        return this.nodeEnv === 'development';
    }
    get isTest() {
        return this.nodeEnv === 'test';
    }
    get port() {
        return this.configService.get('PORT', 4000);
    }
    get apiPrefix() {
        return this.configService.get('API_PREFIX', 'api');
    }
    get apiVersion() {
        return this.configService.get('API_VERSION', 'v1');
    }
    get apiGlobalPrefix() {
        return `${this.apiPrefix}/${this.apiVersion}`;
    }
    get databaseUrl() {
        return this.configService.get('DATABASE_URL', '');
    }
    get redis() {
        return {
            host: this.configService.get('REDIS_HOST', 'localhost'),
            port: this.configService.get('REDIS_PORT', 6379),
            password: this.configService.get('REDIS_PASSWORD', ''),
        };
    }
    get jwt() {
        return {
            accessSecret: this.configService.get('JWT_ACCESS_SECRET', ''),
            refreshSecret: this.configService.get('JWT_REFRESH_SECRET', ''),
            accessExpiry: this.configService.get('JWT_ACCESS_EXPIRY', '15m'),
            refreshExpiry: this.configService.get('JWT_REFRESH_EXPIRY', '7d'),
        };
    }
    get encryptionKey() {
        return this.configService.get('ENCRYPTION_KEY', '');
    }
    get cors() {
        const originsStr = this.configService.get('CORS_ORIGINS', 'http://localhost:3000');
        return {
            origins: originsStr.split(',').map((o) => o.trim()),
            frontendUrl: this.configService.get('FRONTEND_URL', 'http://localhost:3000'),
        };
    }
    get throttle() {
        return {
            ttl: this.configService.get('THROTTLE_TTL', 60000),
            limit: this.configService.get('THROTTLE_LIMIT', 100),
        };
    }
    get logging() {
        return {
            level: this.configService.get('LOG_LEVEL', 'debug'),
            format: this.configService.get('LOG_FORMAT', 'json'),
        };
    }
    get swagger() {
        return {
            enabled: this.configService.get('SWAGGER_ENABLED', true),
            title: this.configService.get('SWAGGER_TITLE', 'DaveRestaurant API'),
            description: this.configService.get('SWAGGER_DESCRIPTION', 'Enterprise Restaurant Management System API'),
            version: this.configService.get('SWAGGER_VERSION', '1.0'),
        };
    }
    get smtp() {
        return {
            host: this.configService.get('SMTP_HOST', 'smtp.mailtrap.io'),
            port: this.configService.get('SMTP_PORT', 2525),
            user: this.configService.get('SMTP_USER', ''),
            pass: this.configService.get('SMTP_PASS', ''),
            from: this.configService.get('SMTP_FROM', 'noreply@daverestaurant.com'),
        };
    }
    get storage() {
        return {
            driver: this.configService.get('STORAGE_DRIVER', 'local'),
        };
    }
    get upload() {
        return {
            maxSize: this.configService.get('UPLOAD_MAX_SIZE', 5242880),
            allowedTypes: this.configService
                .get('UPLOAD_ALLOWED_TYPES', 'image/jpeg,image/png,image/webp,application/pdf')
                .split(','),
            dest: this.configService.get('UPLOAD_DEST', './uploads'),
        };
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = AppConfigService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppConfigService);
//# sourceMappingURL=config.service.js.map