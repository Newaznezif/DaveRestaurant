import { PrismaService } from '../../prisma/prisma.service';
import { AppConfigService } from '../../config/config.service';
export declare class EmailService {
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    constructor(prisma: PrismaService, configService: AppConfigService);
    sendEmailVerification(userId: string, email: string, token: string): Promise<{
        message: string;
        email: string;
    }>;
    sendPasswordReset(userId: string, email: string, token: string): Promise<{
        message: string;
        email: string;
    }>;
    verifyEmailToken(token: string): Promise<{
        valid: boolean;
        email?: string;
    }>;
    verifyPasswordResetToken(token: string): Promise<{
        valid: boolean;
        userId?: string;
        email?: string;
    }>;
    markPasswordResetTokenAsUsed(token: string): Promise<void>;
    cleanupExpiredTokens(): Promise<number>;
}
