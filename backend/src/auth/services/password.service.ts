import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { SecurityService } from './security.service';

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  constructor(
    private readonly securityService: SecurityService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    try {
      return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 1,
      });
    } catch (error) {
      this.logger.error('Failed to hash password', error);
      throw new BadRequestException('Password hashing failed');
    }
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      this.logger.error('Failed to verify password', error);
      return false;
    }
  }

  validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    return this.securityService.validatePasswordStrength(password);
  }

  async isPasswordCompromised(password: string): Promise<boolean> {
    return this.securityService.isPasswordCompromised(password);
  }

  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      token += chars[randomValues[i] % chars.length];
    }
    
    return token;
  }

  generateOTP(length: number = 6): string {
    const chars = '0123456789';
    let otp = '';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      otp += chars[randomValues[i] % chars.length];
    }
    
    return otp;
  }

  async hashPasswordWithArgon2(password: string): Promise<string> {
    return this.hashPassword(password);
  }

  async verifyPasswordWithArgon2(password: string, hash: string): Promise<boolean> {
    return this.verifyPassword(password, hash);
  }
}