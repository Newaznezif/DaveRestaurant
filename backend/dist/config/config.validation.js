"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configValidationSchema = void 0;
const Joi = require("joi");
exports.configValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'staging')
        .default('development'),
    PORT: Joi.number().port().default(4000),
    API_PREFIX: Joi.string().default('api'),
    API_VERSION: Joi.string().default('v1'),
    DATABASE_URL: Joi.string().required(),
    REDIS_HOST: Joi.string().default('localhost'),
    REDIS_PORT: Joi.number().port().default(6379),
    REDIS_PASSWORD: Joi.string().allow('').default(''),
    JWT_ACCESS_SECRET: Joi.string().min(32).required(),
    JWT_REFRESH_SECRET: Joi.string().min(32).required(),
    JWT_ACCESS_EXPIRY: Joi.string().default('15m'),
    JWT_REFRESH_EXPIRY: Joi.string().default('7d'),
    ENCRYPTION_KEY: Joi.string().min(32).required(),
    FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
    CORS_ORIGINS: Joi.string().default('http://localhost:3000'),
    THROTTLE_TTL: Joi.number().default(60000),
    THROTTLE_LIMIT: Joi.number().default(100),
    LOG_LEVEL: Joi.string()
        .valid('error', 'warn', 'info', 'debug', 'verbose')
        .default('debug'),
    LOG_FORMAT: Joi.string().valid('json', 'text').default('json'),
    SWAGGER_ENABLED: Joi.boolean().default(true),
    SWAGGER_TITLE: Joi.string().default('DaveRestaurant API'),
    SWAGGER_DESCRIPTION: Joi.string().default('Enterprise Restaurant Management System API'),
    SWAGGER_VERSION: Joi.string().default('1.0'),
    SMTP_HOST: Joi.string().default('smtp.mailtrap.io'),
    SMTP_PORT: Joi.number().port().default(2525),
    SMTP_USER: Joi.string().allow('').default(''),
    SMTP_PASS: Joi.string().allow('').default(''),
    SMTP_FROM: Joi.string().email().default('noreply@daverestaurant.com'),
    STORAGE_DRIVER: Joi.string().valid('local', 's3').default('local'),
    UPLOAD_MAX_SIZE: Joi.number().default(5242880),
    UPLOAD_ALLOWED_TYPES: Joi.string().default('image/jpeg,image/png,image/webp,application/pdf'),
    UPLOAD_DEST: Joi.string().default('./uploads'),
});
//# sourceMappingURL=config.validation.js.map