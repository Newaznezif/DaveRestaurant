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
var AuthService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_service_1 = require("../../config/config.service");
const token_service_1 = require("./token.service");
const security_service_1 = require("./security.service");
const password_service_1 = require("./password.service");
const email_service_1 = require("./email.service");
const redis_service_1 = require("./redis.service");
const client_1 = require("@prisma/client");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, configService, tokenService, securityService, passwordService, emailService, redisService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.tokenService = tokenService;
        this.securityService = securityService;
        this.passwordService = passwordService;
        this.emailService = emailService;
        this.redisService = redisService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordValidation = this.passwordService.validatePasswordStrength(dto.password);
        if (!passwordValidation.isValid) {
            throw new common_1.BadRequestException({
                message: 'Password does not meet security requirements',
                errors: passwordValidation.errors,
            });
        }
        const passwordHash = await this.passwordService.hashPassword(dto.password);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                phone: dto.phone,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                displayName: `${dto.firstName} ${dto.lastName || ''}`.trim(),
                role: dto.role || client_1.UserRole.CUSTOMER,
                organizationId: dto.organizationId,
                branchId: dto.branchId,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                displayName: true,
                role: true,
                isVerified: false,
                createdAt: true,
                organizationId: true,
                branchId: true,
            },
        });
        const verificationToken = this.passwordService.generateSecureToken(32);
        await this.emailService.sendEmailVerification(user.id, user.email, verificationToken);
        const tokens = await this.tokenService.generateTokens(user.id, user.email, user.role);
        await this.createSession(user.id, tokens.refreshToken, {
            userAgent: '',
            ipAddress: '',
        });
        await this.logAudit(user.id, 'REGISTER', 'User', user.id, { email: user.email });
        return {
            user,
            ...tokens,
            message: 'Registration successful. Please verify your email.',
        };
    }
    async login(dto) {
        const lockout = await this.securityService.checkAccountLockout(dto.email);
        if (lockout.isLocked) {
            await this.securityService.recordLoginAttempt(dto.email, dto.ipAddress, dto.userAgent, false, 'ACCOUNT_LOCKED');
            throw new common_1.UnauthorizedException({
                message: 'Account is temporarily locked',
                lockedUntil: lockout.lockedUntil,
            });
        }
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: {
                id: true,
                email: true,
                passwordHash: true,
                role: true,
                isActive: true,
                isVerified: true,
                isTwoFactorEnabled: true,
                firstName: true,
                lastName: true,
                avatar: true,
                organizationId: true,
                branchId: true,
            },
        });
        if (!user) {
            await this.securityService.recordLoginAttempt(dto.email, dto.ipAddress, dto.userAgent, false, 'INVALID_CREDENTIALS');
            await this.securityService.incrementFailedLoginAttempts(dto.email);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            await this.securityService.recordLoginAttempt(dto.email, dto.ipAddress, dto.userAgent, false, 'ACCOUNT_DEACTIVATED');
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const isPasswordValid = await this.passwordService.verifyPassword(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            await this.securityService.recordLoginAttempt(dto.email, dto.ipAddress, dto.userAgent, false, 'INVALID_PASSWORD');
            await this.securityService.incrementFailedLoginAttempts(dto.email);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.securityService.resetFailedLoginAttempts(dto.email);
        await this.securityService.recordLoginAttempt(dto.email, dto.ipAddress, dto.userAgent, true);
        if (user.isTwoFactorEnabled) {
            return {
                requiresTwoFactor: true,
                userId: user.id,
                message: '2FA verification required',
            };
        }
        const tokens = await this.tokenService.generateTokens(user.id, user.email, user.role);
        await this.createSession(user.id, tokens.refreshToken, {
            userAgent: dto.userAgent,
            ipAddress: dto.ipAddress,
        });
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        await this.logAudit(user.id, 'LOGIN', 'User', user.id, { email: user.email });
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                role: user.role,
                isVerified: user.isVerified,
                organizationId: user.organizationId,
                branchId: user.branchId,
            },
            ...tokens,
            message: 'Login successful',
        };
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = await this.tokenService.verifyRefreshToken(refreshToken);
            const session = await this.prisma.session.findFirst({
                where: {
                    refreshToken,
                    userId: payload.sub,
                    isActive: true,
                    expiresAt: { gt: new Date() },
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            });
            if (!session) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            await this.prisma.session.update({
                where: { id: session.id },
                data: { isActive: false },
            });
            const tokens = await this.tokenService.generateTokens(session.user.id, session.user.email, session.user.role);
            await this.createSession(session.user.id, tokens.refreshToken, {
                userAgent: '',
                ipAddress: '',
            });
            return tokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async logout(userId, refreshToken) {
        await this.tokenService.blacklistToken(refreshToken, userId, 'LOGOUT', '7d');
        await this.prisma.session.updateMany({
            where: {
                userId,
                refreshToken,
                isActive: true,
            },
            data: { isActive: false },
        });
        await this.logAudit(userId, 'LOGOUT', 'User', userId, {});
        return { message: 'Logged out successfully' };
    }
    async logoutAllSessions(userId) {
        await this.tokenService.blacklistAllUserTokens(userId, 'LOGOUT_ALL');
        await this.logAudit(userId, 'LOGOUT_ALL', 'User', userId, {});
        return { message: 'All sessions terminated' };
    }
    async getSessions(userId) {
        return this.prisma.session.findMany({
            where: {
                userId,
                isActive: true,
                expiresAt: { gt: new Date() },
            },
            select: {
                id: true,
                deviceInfo: true,
                ipAddress: true,
                userAgent: true,
                lastUsedAt: true,
                createdAt: true,
                expiresAt: true,
            },
            orderBy: { lastUsedAt: 'desc' },
        });
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                displayName: true,
                avatar: true,
                role: true,
                isVerified: true,
                isTwoFactorEnabled: true,
                lastLoginAt: true,
                createdAt: true,
                organization: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                branch: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                employee: {
                    select: {
                        employeeId: true,
                        position: true,
                        department: { select: { name: true } },
                    },
                },
                customer: {
                    select: {
                        id: true,
                        loyaltyPoints: true,
                        loyaltyTier: true,
                        totalOrders: true,
                        totalSpent: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateProfile(userId, data) {
        const updateData = {};
        if (data.firstName !== undefined)
            updateData.firstName = data.firstName;
        if (data.lastName !== undefined)
            updateData.lastName = data.lastName;
        if (data.phone !== undefined)
            updateData.phone = data.phone;
        if (data.avatar !== undefined)
            updateData.avatar = data.avatar;
        if (data.firstName || data.lastName) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            updateData.displayName = `${data.firstName || user?.firstName} ${data.lastName || user?.lastName}`.trim();
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                displayName: true,
                avatar: true,
                phone: true,
            },
        });
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { passwordHash: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isPasswordValid = await this.passwordService.verifyPassword(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const passwordValidation = this.passwordService.validatePasswordStrength(newPassword);
        if (!passwordValidation.isValid) {
            throw new common_1.BadRequestException({
                message: 'New password does not meet security requirements',
                errors: passwordValidation.errors,
            });
        }
        const passwordHash = await this.passwordService.hashPassword(newPassword);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
        await this.tokenService.blacklistAllUserTokens(userId, 'PASSWORD_CHANGE');
        await this.logAudit(userId, 'PASSWORD_CHANGE', 'User', userId, {});
        return { message: 'Password changed successfully' };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { message: 'If the email exists, a reset OTP has been sent.' };
        }
        const otp = this.passwordService.generateOTP(6);
        await this.redisService.storeOTP(`password_reset:${email}`, otp, 600);
        this.logger.log(`Password reset OTP for ${email}: ${otp}`);
        return { message: 'If the email exists, a reset OTP has been sent.' };
    }
    async resetPassword(email, otp, newPassword) {
        const storedOtp = await this.redisService.getOTP(`password_reset:${email}`);
        if (!storedOtp || storedOtp !== otp) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        await this.redisService.deleteOTP(`password_reset:${email}`);
        const passwordValidation = this.passwordService.validatePasswordStrength(newPassword);
        if (!passwordValidation.isValid) {
            throw new common_1.BadRequestException({
                message: 'Password does not meet security requirements',
                errors: passwordValidation.errors,
            });
        }
        const passwordHash = await this.passwordService.hashPassword(newPassword);
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user) {
            await this.prisma.user.update({
                where: { email },
                data: { passwordHash },
            });
            await this.tokenService.blacklistAllUserTokens(user.id, 'PASSWORD_RESET');
        }
        return { message: 'Password reset successfully' };
    }
    async verifyEmail(email, otp) {
        const storedOtp = await this.redisService.getOTP(`email_verification:${email}`);
        if (!storedOtp || storedOtp !== otp) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        await this.redisService.deleteOTP(`email_verification:${email}`);
        await this.prisma.user.update({
            where: { email },
            data: { isVerified: true },
        });
        return { message: 'Email verified successfully' };
    }
    async resendVerification(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isVerified) {
            return { message: 'Email is already verified' };
        }
        const otp = this.passwordService.generateOTP(6);
        await this.redisService.storeOTP(`email_verification:${email}`, otp, 600);
        this.logger.log(`New verification OTP for ${email}: ${otp}`);
        return { message: 'Verification email resent' };
    }
    async handleSocialLogin(profile) {
        let user = await this.prisma.user.findUnique({
            where: { email: profile.email },
        });
        if (!user) {
            const passwordHash = await this.passwordService.hashPassword(this.passwordService.generateSecureToken(32));
            user = await this.prisma.user.create({
                data: {
                    email: profile.email,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    displayName: `${profile.firstName} ${profile.lastName}`.trim(),
                    avatar: profile.avatar,
                    passwordHash,
                    isVerified: true,
                },
            });
        }
        await this.prisma.socialAccount.upsert({
            where: {
                provider_providerId: {
                    provider: profile.provider,
                    providerId: profile.providerId,
                },
            },
            update: { email: profile.email, avatar: profile.avatar },
            create: {
                userId: user.id,
                provider: profile.provider,
                providerId: profile.providerId,
                email: profile.email,
                name: `${profile.firstName} ${profile.lastName}`.trim(),
                avatar: profile.avatar,
            },
        });
        const tokens = await this.tokenService.generateTokens(user.id, user.email, user.role);
        await this.createSession(user.id, tokens.refreshToken, {
            userAgent: '',
            ipAddress: '',
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                role: user.role,
                isVerified: user.isVerified,
            },
            ...tokens,
        };
    }
    async createSession(userId, refreshToken, metadata) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        return this.prisma.session.create({
            data: {
                userId,
                token: this.passwordService.generateSecureToken(32),
                refreshToken,
                deviceInfo: metadata.userAgent?.substring(0, 255),
                ipAddress: metadata.ipAddress,
                expiresAt,
            },
        });
    }
    async logAudit(userId, action, entity, entityId, changes) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { organizationId: true },
            });
            await this.prisma.auditLog.create({
                data: {
                    userId,
                    action,
                    entity,
                    entityId,
                    changes: changes,
                    organizationId: user?.organizationId || 'system',
                },
            });
        }
        catch (error) {
            this.logger.error('Failed to create audit log', error);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService, typeof (_a = typeof config_service_1.ConfigService !== "undefined" && config_service_1.ConfigService) === "function" ? _a : Object, token_service_1.TokenService,
        security_service_1.SecurityService,
        password_service_1.PasswordService,
        email_service_1.EmailService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map