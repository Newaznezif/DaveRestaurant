import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '../../config/config.service';
export declare class SecurityService {
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    private readonly maxLoginAttempts;
    private readonly lockoutDuration;
    constructor(prisma: PrismaService, configService: ConfigService);
    recordLoginAttempt(email: string, ipAddress: string, userAgent: string, isSuccessful: boolean, failureReason?: string): Promise<void>;
    checkAccountLockout(email: string): Promise<{
        isLocked: boolean;
        lockedUntil?: Date;
    }>;
    resetFailedLoginAttempts(email: string): Promise<void>;
    incrementFailedLoginAttempts(email: string): Promise<number>;
    validatePasswordStrength(password: string): {
        isValid: boolean;
        errors: string[];
    };
    isPasswordCompromised(password: string): Promise<boolean>;
    getLoginAttemptsStats(email: string, hours?: number): Promise<{
        total: number;
        successful: number;
        failed: number;
        period: string;
    }>;
    getSecurityStats(userId: string): Promise<{
        activeSessions: number;
        recentLogins: {
            id: string;
            ipAddress: string | null;
            userAgent: string | null;
            email: string;
            isSuccessful: boolean;
            failureReason: string | null;
            attemptedAt: Date;
        }[];
        failedAttempts: number;
    } | null>;
}
