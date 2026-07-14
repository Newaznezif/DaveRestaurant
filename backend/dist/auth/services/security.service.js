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
var SecurityService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_service_1 = require("../../config/config.service");
let SecurityService = SecurityService_1 = class SecurityService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(SecurityService_1.name);
        this.maxLoginAttempts = 5;
        this.lockoutDuration = 30;
    }
    async recordLoginAttempt(email, ipAddress, userAgent, isSuccessful, failureReason) {
        await this.prisma.loginAttempt.create({
            data: {
                email,
                ipAddress,
                userAgent,
                isSuccessful,
                failureReason,
            },
        });
        const oneDayAgo = new Date();
        oneDayAgo.setHours(oneDayAgo.getHours() - 24);
        await this.prisma.loginAttempt.deleteMany({
            where: {
                attemptedAt: {
                    lt: oneDayAgo,
                },
            },
        });
    }
    async checkAccountLockout(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { lockedUntil: true, isActive: true },
        });
        if (!user) {
            return { isLocked: false };
        }
        if (!user.isActive) {
            return { isLocked: true, lockedUntil: new Date('2099-12-31') };
        }
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            return { isLocked: true, lockedUntil: user.lockedUntil };
        }
        const fifteenMinutesAgo = new Date();
        fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);
        const recentFailedAttempts = await this.prisma.loginAttempt.count({
            where: {
                email,
                isSuccessful: false,
                attemptedAt: {
                    gte: fifteenMinutesAgo,
                },
            },
        });
        if (recentFailedAttempts >= this.maxLoginAttempts) {
            const lockedUntil = new Date();
            lockedUntil.setMinutes(lockedUntil.getMinutes() + this.lockoutDuration);
            await this.prisma.user.update({
                where: { email },
                data: { lockedUntil },
            });
            this.logger.warn(`Account locked for ${email} until ${lockedUntil.toISOString()}`);
            return { isLocked: true, lockedUntil };
        }
        return { isLocked: false };
    }
    async resetFailedLoginAttempts(email) {
        await this.prisma.user.update({
            where: { email },
            data: {
                failedLoginAttempts: 0,
                lockedUntil: null,
            },
        });
    }
    async incrementFailedLoginAttempts(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { failedLoginAttempts: true },
        });
        if (!user) {
            return 0;
        }
        const newCount = user.failedLoginAttempts + 1;
        await this.prisma.user.update({
            where: { email },
            data: { failedLoginAttempts: newCount },
        });
        return newCount;
    }
    validatePasswordStrength(password) {
        const errors = [];
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    async isPasswordCompromised(password) {
        return false;
    }
    async getLoginAttemptsStats(email, hours = 24) {
        const since = new Date();
        since.setHours(since.getHours() - hours);
        const [total, successful, failed] = await Promise.all([
            this.prisma.loginAttempt.count({
                where: { email, attemptedAt: { gte: since } },
            }),
            this.prisma.loginAttempt.count({
                where: { email, isSuccessful: true, attemptedAt: { gte: since } },
            }),
            this.prisma.loginAttempt.count({
                where: { email, isSuccessful: false, attemptedAt: { gte: since } },
            }),
        ]);
        return {
            total,
            successful,
            failed,
            period: `${hours} hours`,
        };
    }
    async getSecurityStats(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        if (!user) {
            return null;
        }
        const [activeSessions, recentLogins, failedAttempts] = await Promise.all([
            this.prisma.session.count({
                where: { userId, isActive: true },
            }),
            this.prisma.loginAttempt.findMany({
                where: { email: user.email },
                take: 10,
                orderBy: { attemptedAt: 'desc' },
            }),
            this.prisma.loginAttempt.count({
                where: { email: user.email, isSuccessful: false },
            }),
        ]);
        return {
            activeSessions,
            recentLogins,
            failedAttempts,
        };
    }
};
exports.SecurityService = SecurityService;
exports.SecurityService = SecurityService = SecurityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, typeof (_a = typeof config_service_1.ConfigService !== "undefined" && config_service_1.ConfigService) === "function" ? _a : Object])
], SecurityService);
//# sourceMappingURL=security.service.js.map