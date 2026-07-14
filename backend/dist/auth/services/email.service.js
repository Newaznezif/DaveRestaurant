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
var EmailService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_service_1 = require("../../config/config.service");
let EmailService = EmailService_1 = class EmailService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
    }
    async sendEmailVerification(userId, email, token) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        await this.prisma.emailVerificationToken.create({
            data: {
                userId,
                email,
                token,
                expiresAt,
            },
        });
        const verificationUrl = `${this.configService.cors.frontendUrl}/verify-email?token=${token}`;
        this.logger.log(`Email verification URL for ${email}: ${verificationUrl}`);
        return { message: 'Verification email sent', email };
    }
    async sendPasswordReset(userId, email, token) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        await this.prisma.passwordResetToken.create({
            data: {
                userId,
                email,
                token,
                expiresAt,
            },
        });
        const resetUrl = `${this.configService.cors.frontendUrl}/reset-password?token=${token}`;
        this.logger.log(`Password reset URL for ${email}: ${resetUrl}`);
        return { message: 'Password reset email sent', email };
    }
    async verifyEmailToken(token) {
        const tokenRecord = await this.prisma.emailVerificationToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!tokenRecord || tokenRecord.isUsed || tokenRecord.expiresAt < new Date()) {
            return { valid: false };
        }
        await this.prisma.emailVerificationToken.update({
            where: { token },
            data: { isUsed: true, usedAt: new Date() },
        });
        await this.prisma.user.update({
            where: { id: tokenRecord.userId },
            data: { isVerified: true },
        });
        return { valid: true, email: tokenRecord.email };
    }
    async verifyPasswordResetToken(token) {
        const tokenRecord = await this.prisma.passwordResetToken.findUnique({
            where: { token },
        });
        if (!tokenRecord || tokenRecord.isUsed || tokenRecord.expiresAt < new Date()) {
            return { valid: false };
        }
        return { valid: true, userId: tokenRecord.userId, email: tokenRecord.email };
    }
    async markPasswordResetTokenAsUsed(token) {
        await this.prisma.passwordResetToken.update({
            where: { token },
            data: { isUsed: true, usedAt: new Date() },
        });
    }
    async cleanupExpiredTokens() {
        const now = new Date();
        const [emailTokens, resetTokens] = await Promise.all([
            this.prisma.emailVerificationToken.deleteMany({ where: { expiresAt: { lt: now } } }),
            this.prisma.passwordResetToken.deleteMany({ where: { expiresAt: { lt: now } } }),
        ]);
        return emailTokens.count + resetTokens.count;
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, typeof (_a = typeof config_service_1.ConfigService !== "undefined" && config_service_1.ConfigService) === "function" ? _a : Object])
], EmailService);
//# sourceMappingURL=email.service.js.map