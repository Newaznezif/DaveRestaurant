import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        message: string;
        accessToken: string;
        refreshToken: string;
        user: {
            createdAt: Date;
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            displayName: string | null;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    login(dto: LoginDto): Promise<{
        requiresTwoFactor: boolean;
        userId: string;
        message: string;
    } | {
        message: string;
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            isVerified: boolean;
            organizationId: string | null;
            branchId: string | null;
        };
        requiresTwoFactor?: undefined;
        userId?: undefined;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, refreshToken: string): Promise<{
        message: string;
    }>;
    logoutAllSessions(userId: string): Promise<{
        message: string;
    }>;
    getSessions(userId: string): Promise<{
        createdAt: Date;
        id: string;
        expiresAt: Date;
        deviceInfo: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        lastUsedAt: Date;
    }[]>;
    getProfile(userId: string): Promise<{
        organization: {
            id: string;
            name: string;
            slug: string;
        } | null;
        branch: {
            id: string;
            name: string;
        } | null;
        customer: {
            id: string;
            totalOrders: number;
            totalSpent: number;
            loyaltyPoints: number;
            loyaltyTier: import(".prisma/client").$Enums.LoyaltyTier;
        } | null;
        employee: {
            department: {
                name: string;
            } | null;
            employeeId: string;
            position: string | null;
        } | null;
        createdAt: Date;
        id: string;
        email: string;
        phone: string | null;
        firstName: string | null;
        lastName: string | null;
        displayName: string | null;
        avatar: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        isTwoFactorEnabled: boolean;
        lastLoginAt: Date | null;
    }>;
    updateProfile(userId: string, data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        avatar?: string;
    }): Promise<{
        id: string;
        email: string;
        phone: string | null;
        firstName: string | null;
        lastName: string | null;
        displayName: string | null;
        avatar: string | null;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(email: string, otp: string, newPassword: string): Promise<{
        message: string;
    }>;
    verifyEmail(email: string, otp: string): Promise<{
        message: string;
    }>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
    handleSocialLogin(profile: {
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        provider: string;
        providerId: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            isVerified: boolean;
        };
    }>;
    private generateTokens;
    private createSession;
    private generateOTP;
    private storeOTP;
    private verifyOTP;
    private logAudit;
}
