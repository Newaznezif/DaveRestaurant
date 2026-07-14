import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AppConfigService } from '../../config/config.service';
import { TokenService } from '../services/token.service';
interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private readonly prisma;
    private readonly configService;
    private readonly tokenService;
    constructor(prisma: PrismaService, configService: AppConfigService, tokenService: TokenService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
}
export {};
