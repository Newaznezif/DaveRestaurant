import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);
  private readonly maxLoginAttempts: number;
  private readonly lockoutDuration: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: AppConfigService,
  ) {
    this.maxLoginAttempts = 5;
    this.lockoutDuration = 30;
  }

  async recordLoginAttempt(email: string, ipAddress: string, userAgent: string, isSuccessful: boolean, failureReason?: string) {
    await this.prisma.loginAttempt.create({
      data: {
        email,
        ipAddress,
        userAgent,
        isSuccessful,
        failureReason,
      },
    });

    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    await this.prisma.loginAttempt.deleteMany({
      where: {
        attemptedAt: {
          lt: oneDayAgo,
        },
      },
    });
  }

  async checkAccountLockout(email: string): Promise<{ isLocked: boolean; lockedUntil?: Date }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { lockedUntil: true, isActive: true },
    });

    if (!user) {
      return { isLocked: false };
    }

    if (!user.isActive) {
      return { isLocked: true, lockedUntil: new Date('2099-12-31') };
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return { isLocked: true, lockedUntil: user.lockedUntil };
    }

    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

    const recentFailedAttempts = await this.prisma.loginAttempt.count({
      where: {
        email,
        isSuccessful: false,
        attemptedAt: {
          gte: fifteenMinutesAgo,
        },
      },
    });

    if (recentFailedAttempts >= this.maxLoginAttempts) {
      const lockedUntil = new Date();
      lockedUntil.setMinutes(lockedUntil.getMinutes() + this.lockoutDuration);
      
      await this.prisma.user.update({
        where: { email },
        data: { lockedUntil },
      });

      this.logger.warn(`Account locked for ${email} until ${lockedUntil.toISOString()}`);
      return { isLocked: true, lockedUntil };
    }

    return { isLocked: false };
  }

  async resetFailedLoginAttempts(email: string) {
    await this.prisma.user.update({
      where: { email },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  async incrementFailedLoginAttempts(email: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { failedLoginAttempts: true },
    });

    if (!user) {
      return 0;
    }

    const newCount = user.failedLoginAttempts + 1;

    await this.prisma.user.update({
      where: { email },
      data: { failedLoginAttempts: newCount },
    });

    return newCount;
  }

  validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async isPasswordCompromised(password: string): Promise<boolean> {
    return false;
  }

  async getLoginAttemptsStats(email: string, hours: number = 24) {
    const since = new Date();
    since.setHours(since.getHours() - hours);

    const [total, successful, failed] = await Promise.all([
      this.prisma.loginAttempt.count({
        where: { email, attemptedAt: { gte: since } },
      }),
      this.prisma.loginAttempt.count({
        where: { email, isSuccessful: true, attemptedAt: { gte: since } },
      }),
      this.prisma.loginAttempt.count({
        where: { email, isSuccessful: false, attemptedAt: { gte: since } },
      }),
    ]);

    return {
      total,
      successful,
      failed,
      period: `${hours} hours`,
    };
  }

  async getSecurityStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      return null;
    }

    const [activeSessions, recentLogins, failedAttempts] = await Promise.all([
      this.prisma.session.count({
        where: { userId, isActive: true },
      }),
      this.prisma.loginAttempt.findMany({
        where: { email: user.email },
        take: 10,
        orderBy: { attemptedAt: 'desc' },
      }),
      this.prisma.loginAttempt.count({
        where: { email: user.email, isSuccessful: false },
      }),
    ]);

    return {
      activeSessions,
      recentLogins,
      failedAttempts,
    };
  }
}