import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: AppConfigService,
  ) {}

  async sendEmailVerification(userId: string, email: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.prisma.emailVerificationToken.create({
      data: {
        userId,
        email,
        token,
        expiresAt,
      },
    });

    const verificationUrl = `${this.configService.cors.frontendUrl}/verify-email?token=${token}`;
    this.logger.log(`Email verification URL for ${email}: ${verificationUrl}`);
    
    return { message: 'Verification email sent', email };
  }

  async sendPasswordReset(userId: string, email: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.prisma.passwordResetToken.create({
      data: {
        userId,
        email,
        token,
        expiresAt,
      },
    });

    const resetUrl = `${this.configService.cors.frontendUrl}/reset-password?token=${token}`;
    this.logger.log(`Password reset URL for ${email}: ${resetUrl}`);
    
    return { message: 'Password reset email sent', email };
  }

  async verifyEmailToken(token: string): Promise<{ valid: boolean; email?: string }> {
    const tokenRecord = await this.prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.isUsed || tokenRecord.expiresAt < new Date()) {
      return { valid: false };
    }

    await this.prisma.emailVerificationToken.update({
      where: { token },
      data: { isUsed: true, usedAt: new Date() },
    });

    await this.prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { isVerified: true },
    });

    return { valid: true, email: tokenRecord.email };
  }

  async verifyPasswordResetToken(token: string): Promise<{ valid: boolean; userId?: string; email?: string }> {
    const tokenRecord = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!tokenRecord || tokenRecord.isUsed || tokenRecord.expiresAt < new Date()) {
      return { valid: false };
    }

    return { valid: true, userId: tokenRecord.userId, email: tokenRecord.email };
  }

  async markPasswordResetTokenAsUsed(token: string) {
    await this.prisma.passwordResetToken.update({
      where: { token },
      data: { isUsed: true, usedAt: new Date() },
    });
  }

  async cleanupExpiredTokens() {
    const now = new Date();

    const [emailTokens, resetTokens] = await Promise.all([
      this.prisma.emailVerificationToken.deleteMany({ where: { expiresAt: { lt: now } } }),
      this.prisma.passwordResetToken.deleteMany({ where: { expiresAt: { lt: now } } }),
    ]);

    return emailTokens.count + resetTokens.count;
  }
}