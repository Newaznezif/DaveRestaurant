import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AppConfigService } from '../../config/config.service';
interface TokenPayload {
    sub: string;
    email: string;
    role: string;
    organizationId?: string;
    branchId?: string;
}
export declare class TokenService {
    private readonly jwtService;
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    constructor(jwtService: JwtService, prisma: PrismaService, configService: AppConfigService);
    generateTokens(userId: string, email: string, role: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyAccessToken(token: string): Promise<TokenPayload>;
    verifyRefreshToken(token: string): Promise<TokenPayload>;
    blacklistToken(token: string, userId: string, reason: string, expiresIn: string): Promise<void>;
    blacklistAllUserTokens(userId: string, reason: string): Promise<void>;
    cleanupExpiredTokens(): Promise<number>;
}
export {};
