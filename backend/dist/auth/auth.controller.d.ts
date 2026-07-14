import { AuthService } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
            organizationId: string | null;
            branchId: string | null;
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
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
    logout(user: any, refreshToken: string): Promise<{
        message: string;
    }>;
    logoutAll(user: any): Promise<{
        message: string;
    }>;
    getSessions(user: any): Promise<{
        createdAt: Date;
        id: string;
        expiresAt: Date;
        deviceInfo: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        lastUsedAt: Date;
    }[]>;
    getProfile(user: any): Promise<{
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
    updateProfile(user: any, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        phone: string | null;
        firstName: string | null;
        lastName: string | null;
        displayName: string | null;
        avatar: string | null;
    }>;
    changePassword(user: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
