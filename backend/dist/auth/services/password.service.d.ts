import { SecurityService } from './security.service';
export declare class PasswordService {
    private readonly securityService;
    private readonly logger;
    constructor(securityService: SecurityService);
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
    validatePasswordStrength(password: string): {
        isValid: boolean;
        errors: string[];
    };
    isPasswordCompromised(password: string): Promise<boolean>;
    generateSecureToken(length?: number): string;
    generateOTP(length?: number): string;
    hashPasswordWithArgon2(password: string): Promise<string>;
    verifyPasswordWithArgon2(password: string, hash: string): Promise<boolean>;
}
