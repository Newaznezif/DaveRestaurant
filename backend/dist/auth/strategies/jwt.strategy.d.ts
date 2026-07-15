import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AppConfigService } from '../../config/config.service';
import { TokenService } from '../services/token.service';
interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    organizationId?: string;
    branchId?: string;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    private readonly configService;
    private readonly tokenService;
    constructor(prisma: PrismaService, configService: AppConfigService, tokenService: TokenService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        organizationId: string | null;
        branchId: string | null;
        firstName: string | null;
        lastName: string | null;
        avatar: string | null;
        organization: {
            id: string;
            name: string;
            isActive: boolean;
            slug: string;
        } | null;
        branch: {
            id: string;
            name: string;
            isActive: boolean;
        } | null;
    }>;
}
export {};
