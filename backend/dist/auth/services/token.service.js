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
var TokenService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_service_1 = require("../../config/config.service");
let TokenService = TokenService_1 = class TokenService {
    constructor(jwtService, prisma, configService) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(TokenService_1.name);
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.jwt.accessSecret,
                expiresIn: this.configService.jwt.accessExpiry,
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.jwt.refreshSecret,
                expiresIn: this.configService.jwt.refreshExpiry,
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async verifyAccessToken(token) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.jwt.accessSecret,
            });
            const blacklisted = await this.prisma.tokenBlacklist.findUnique({
                where: { token },
            });
            if (blacklisted) {
                throw new common_1.BadRequestException('Token has been revoked');
            }
            return payload;
        }
        catch (error) {
            this.logger.warn(`Invalid access token: ${error.message}`);
            throw new common_1.BadRequestException('Invalid or expired token');
        }
    }
    async verifyRefreshToken(token) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.jwt.refreshSecret,
            });
            const blacklisted = await this.prisma.tokenBlacklist.findUnique({
                where: { token },
            });
            if (blacklisted) {
                throw new common_1.BadRequestException('Refresh token has been revoked');
            }
            return payload;
        }
        catch (error) {
            this.logger.warn(`Invalid refresh token: ${error.message}`);
            throw new common_1.BadRequestException('Invalid or expired refresh token');
        }
    }
    async blacklistToken(token, userId, reason, expiresIn) {
        const expiresAt = new Date();
        const expiryMatch = expiresIn.match(/(\d+)([mhsd])/);
        if (expiryMatch) {
            const value = parseInt(expiryMatch[1]);
            const unit = expiryMatch[2];
            switch (unit) {
                case 's':
                    expiresAt.setSeconds(expiresAt.getSeconds() + value);
                    break;
                case 'm':
                    expiresAt.setMinutes(expiresAt.getMinutes() + value);
                    break;
                case 'h':
                    expiresAt.setHours(expiresAt.getHours() + value);
                    break;
                case 'd':
                    expiresAt.setDate(expiresAt.getDate() + value);
                    break;
            }
        }
        else {
            expiresAt.setHours(expiresAt.getHours() + 1);
        }
        await this.prisma.tokenBlacklist.create({
            data: {
                token,
                userId,
                reason,
                expiresAt,
            },
        });
        this.logger.log(`Token blacklisted for user ${userId}, reason: ${reason}`);
    }
    async blacklistAllUserTokens(userId, reason) {
        const sessions = await this.prisma.session.findMany({
            where: { userId, isActive: true },
            select: { token: true, refreshToken: true },
        });
        const now = new Date();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        const blacklistEntries = sessions.flatMap(session => [
            {
                token: session.token,
                userId,
                reason,
                expiresAt,
            },
            {
                token: session.refreshToken,
                userId,
                reason,
                expiresAt,
            },
        ]);
        if (blacklistEntries.length > 0) {
            await this.prisma.tokenBlacklist.createMany({
                data: blacklistEntries,
                skipDuplicates: true,
            });
        }
        await this.prisma.session.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false },
        });
        this.logger.log(`All tokens blacklisted for user ${userId}, reason: ${reason}`);
    }
    async cleanupExpiredTokens() {
        const result = await this.prisma.tokenBlacklist.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
        if (result.count > 0) {
            this.logger.log(`Cleaned up ${result.count} expired blacklisted tokens`);
        }
        return result.count;
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = TokenService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService, typeof (_a = typeof config_service_1.ConfigService !== "undefined" && config_service_1.ConfigService) === "function" ? _a : Object])
], TokenService);
//# sourceMappingURL=token.service.js.map