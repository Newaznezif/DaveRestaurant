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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                phone: dto.phone,
                firstName: dto.firstName,
                lastName: dto.lastName,
                displayName: `${dto.firstName} ${dto.lastName || ''}`.trim(),
                passwordHash,
                role: dto.role || client_1.UserRole.CUSTOMER,
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
            },
        });
        const otp = this.generateOTP();
        await this.storeOTP(user.email, otp, 'email_verification');
        this.logger.log(`Verification OTP for ${user.email}: ${otp}`);
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.createSession(user.id, tokens.refreshToken, {
            userAgent: '',
            ipAddress: '',
        });
        return {
            user,
            ...tokens,
            message: 'Registration successful. Please verify your email.',
        };
    }
    async login(dto) {
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
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.isTwoFactorEnabled) {
            return {
                requiresTwoFactor: true,
                userId: user.id,
                message: '2FA verification required',
            };
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
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
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key',
            });
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
            const tokens = await this.generateTokens(session.user.id, session.user.email, session.user.role);
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
        await this.prisma.session.updateMany({
            where: {
                userId,
                isActive: true,
            },
            data: { isActive: false },
        });
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
        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const passwordHash = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
        return { message: 'Password changed successfully' };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { message: 'If the email exists, a reset OTP has been sent.' };
        }
        const otp = this.generateOTP();
        await this.storeOTP(email, otp, 'password_reset');
        this.logger.log(`Password reset OTP for ${email}: ${otp}`);
        return { message: 'If the email exists, a reset OTP has been sent.' };
    }
    async resetPassword(email, otp, newPassword) {
        const isValid = await this.verifyOTP(email, otp, 'password_reset');
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        const passwordHash = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({
            where: { email },
            data: { passwordHash },
        });
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user) {
            await this.prisma.session.updateMany({
                where: { userId: user.id, isActive: true },
                data: { isActive: false },
            });
        }
        return { message: 'Password reset successfully' };
    }
    async verifyEmail(email, otp) {
        const isValid = await this.verifyOTP(email, otp, 'email_verification');
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
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
        const otp = this.generateOTP();
        await this.storeOTP(email, otp, 'email_verification');
        this.logger.log(`New verification OTP for ${email}: ${otp}`);
        return { message: 'Verification email resent' };
    }
    async handleSocialLogin(profile) {
        let user = await this.prisma.user.findUnique({
            where: { email: profile.email },
        });
        if (!user) {
            const passwordHash = await bcrypt.hash((0, uuid_1.v4)(), 12);
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
        const tokens = await this.generateTokens(user.id, user.email, user.role);
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
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key',
                expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async createSession(userId, refreshToken, metadata) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        return this.prisma.session.create({
            data: {
                userId,
                token: (0, uuid_1.v4)(),
                refreshToken,
                deviceInfo: metadata.userAgent?.substring(0, 255),
                ipAddress: metadata.ipAddress,
                expiresAt,
            },
        });
    }
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async storeOTP(identifier, otp, type) {
        const key = `otp:${type}:${identifier}`;
        this.otpStore = this.otpStore || new Map();
        this.otpStore.set(key, { otp, expiresAt: Date.now() + 600000 });
    }
    async verifyOTP(identifier, otp, type) {
        const key = `otp:${type}:${identifier}`;
        const stored = this.otpStore?.get(key);
        if (!stored)
            return false;
        if (Date.now() > stored.expiresAt)
            return false;
        if (stored.otp !== otp)
            return false;
        this.otpStore?.delete(key);
        return true;
    }
    async logAudit(userId, action, entity, entityId, changes) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId,
                    action,
                    entity,
                    entityId,
                    changes: changes,
                    organizationId: 'system',
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
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map