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
var HealthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("./prisma/prisma.service");
const config_service_1 = require("./config/config.service");
const public_decorator_1 = require("./common/decorators/public.decorator");
let HealthController = HealthController_1 = class HealthController {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(HealthController_1.name);
        this.startTime = Date.now();
    }
    async check() {
        const services = await Promise.allSettled([
            this.checkDatabase(),
            this.checkMemory(),
            this.checkUptime(),
        ]);
        const [database, memory, uptime] = services.map((result) => result.status === 'fulfilled' ? result.value : { status: 'unhealthy', error: 'Check failed' });
        const isHealthy = [database, memory, uptime].every((service) => service.status === 'healthy');
        const healthStatus = {
            status: isHealthy ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            services: {
                database,
                memory,
                uptime,
            },
            version: this.configService.swagger.version,
            environment: this.configService.nodeEnv,
        };
        if (!isHealthy) {
            this.logger.warn('Health check failed', JSON.stringify(healthStatus));
        }
        return healthStatus;
    }
    async liveness() {
        return {
            status: 'alive',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
    async readiness() {
        const dbHealthy = await this.checkDatabase();
        const isReady = dbHealthy.status === 'healthy';
        return {
            status: isReady ? 'ready' : 'not ready',
            timestamp: new Date().toISOString(),
            services: {
                database: dbHealthy,
            },
        };
    }
    async checkDatabase() {
        const start = Date.now();
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            const latency = Date.now() - start;
            return { status: 'healthy', latency: `${latency}ms` };
        }
        catch (error) {
            this.logger.error('Database health check failed', error instanceof Error ? error.stack : error);
            return { status: 'unhealthy', error: 'Database connection failed' };
        }
    }
    checkMemory() {
        const memoryUsage = process.memoryUsage();
        const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
        const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
        const rssMB = Math.round(memoryUsage.rss / 1024 / 1024);
        const isHealthy = heapUsedMB < 1024;
        return {
            status: isHealthy ? 'healthy' : 'warning',
            heapUsed: `${heapUsedMB}MB`,
            heapTotal: `${heapTotalMB}MB`,
            rss: `${rssMB}MB`,
        };
    }
    checkUptime() {
        const uptimeSeconds = process.uptime();
        return {
            status: 'healthy',
            uptime: uptimeSeconds,
            startedAt: new Date(this.startTime).toISOString(),
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check system health' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System is healthy' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'System is unhealthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('/live'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Liveness probe' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application is alive' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "liveness", null);
__decorate([
    (0, common_1.Get)('/ready'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Readiness probe' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application is ready' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Application is not ready' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "readiness", null);
exports.HealthController = HealthController = HealthController_1 = __decorate([
    (0, swagger_1.ApiTags)('System'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_service_1.AppConfigService])
], HealthController);
//# sourceMappingURL=health.controller.js.map