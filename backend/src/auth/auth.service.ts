import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        firstName: dto.firstName,
        lastName: dto.lastName,
        displayName: `${dto.firstName} ${dto.lastName || ''}`.trim(),
        passwordHash,
        role: dto.role || UserRole.CUSTOMER,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        role: true,
        isVerified: false,
        createdAt: true,
      },
    });

    // Generate verification OTP
    const otp = this.generateOTP();
    await this.storeOTP(user.email, otp, 'email_verification');

    // In production, send email with OTP
    this.logger.log(`Verification OTP for ${user.email}: ${otp}`);

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.createSession(user.id, tokens.refreshToken, {
      userAgent: '',
      ipAddress: '',
    });

    return {
      user,
      ...tokens,
      message: 'Registration successful. Please verify your email.',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        isActive: true,
        isVerified: true,
        isTwoFactorEnabled: true,
        firstName: true,
        lastName: true,
        avatar: true,
        organizationId: true,
        branchId: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isTwoFactorEnabled) {
      return {
        requiresTwoFactor: true,
        userId: user.id,
        message: '2FA verification required',
      };
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.createSession(user.id, tokens.refreshToken, {
      userAgent: dto.userAgent,
      ipAddress: dto.ipAddress,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await this.logAudit(user.id, 'LOGIN', 'User', user.id, { email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        organizationId: user.organizationId,
        branchId: user.branchId,
      },
      ...tokens,
      message: 'Login successful',
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key',
      });

      const session = await this.prisma.session.findFirst({
        where: {
          refreshToken,
          userId: payload.sub,
          isActive: true,
          expiresAt: { gt: new Date() },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

      if (!session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Deactivate old session
      await this.prisma.session.update({
        where: { id: session.id },
        data: { isActive: false },
      });

      const tokens = await this.generateTokens(
        session.user.id,
        session.user.email,
        session.user.role,
      );

      await this.createSession(session.user.id, tokens.refreshToken, {
        userAgent: '',
        ipAddress: '',
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string, refreshToken: string) {
    await this.prisma.session.updateMany({
      where: {
        userId,
        refreshToken,
        isActive: true,
      },
      data: { isActive: false },
    });

    await this.logAudit(userId, 'LOGOUT', 'User', userId, {});

    return { message: 'Logged out successfully' };
  }

  async logoutAllSessions(userId: string) {
    await this.prisma.session.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: { isActive: false },
    });

    return { message: 'All sessions terminated' };
  }

  async getSessions(userId: string) {
    return this.prisma.session.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        deviceInfo: true,
        ipAddress: true,
        userAgent: true,
        lastUsedAt: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { lastUsedAt: 'desc' },
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatar: true,
        role: true,
        isVerified: true,
        isTwoFactorEnabled: true,
        lastLoginAt: true,
        createdAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        employee: {
          select: {
            employeeId: true,
            position: true,
            department: { select: { name: true } },
          },
        },
        customer: {
          select: {
            id: true,
            loyaltyPoints: true,
            loyaltyTier: true,
            totalOrders: true,
            totalSpent: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string; phone?: string; avatar?: string },
  ) {
    const updateData: any = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.firstName || data.lastName) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      updateData.displayName = `${data.firstName || user?.firstName} ${data.lastName || user?.lastName}`.trim();
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatar: true,
        phone: true,
      },
    });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal whether email exists
      return { message: 'If the email exists, a reset OTP has been sent.' };
    }

    const otp = this.generateOTP();
    await this.storeOTP(email, otp, 'password_reset');

    // In production, send email
    this.logger.log(`Password reset OTP for ${email}: ${otp}`);

    return { message: 'If the email exists, a reset OTP has been sent.' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const isValid = await this.verifyOTP(email, otp, 'password_reset');
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    // Invalidate all sessions
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      await this.prisma.session.updateMany({
        where: { userId: user.id, isActive: true },
        data: { isActive: false },
      });
    }

    return { message: 'Password reset successfully' };
  }

  async verifyEmail(email: string, otp: string) {
    const isValid = await this.verifyOTP(email, otp, 'email_verification');
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    return { message: 'Email verified successfully' };
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      return { message: 'Email is already verified' };
    }

    const otp = this.generateOTP();
    await this.storeOTP(email, otp, 'email_verification');

    this.logger.log(`New verification OTP for ${email}: ${otp}`);

    return { message: 'Verification email resent' };
  }

  async handleSocialLogin(profile: {
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    provider: string;
    providerId: string;
  }) {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      const passwordHash = await bcrypt.hash(uuidv4(), 12);

      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          displayName: `${profile.firstName} ${profile.lastName}`.trim(),
          avatar: profile.avatar,
          passwordHash,
          isVerified: true,
        },
      });
    }

    // Link social account
    await this.prisma.socialAccount.upsert({
      where: {
        provider_providerId: {
          provider: profile.provider,
          providerId: profile.providerId,
        },
      },
      update: { email: profile.email, avatar: profile.avatar },
      create: {
        userId: user.id,
        provider: profile.provider,
        providerId: profile.providerId,
        email: profile.email,
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        avatar: profile.avatar,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.createSession(user.id, tokens.refreshToken, {
      userAgent: '',
      ipAddress: '',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
      },
      ...tokens,
    };
  }

  // Private helpers

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key',
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async createSession(
    userId: string,
    refreshToken: string,
    metadata: { userAgent?: string; ipAddress?: string },
  ) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    return this.prisma.session.create({
      data: {
        userId,
        token: uuidv4(),
        refreshToken,
        deviceInfo: metadata.userAgent?.substring(0, 255),
        ipAddress: metadata.ipAddress,
        expiresAt,
      },
    });
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async storeOTP(
    identifier: string,
    otp: string,
    type: string,
  ) {
    // In production, store in Redis with TTL
    // For now, store in memory (replace with Redis in production)
    const key = `otp:${type}:${identifier}`;
    // @ts-expect-error - in-memory store
    this.otpStore = this.otpStore || new Map();
    // @ts-expect-error - in-memory store
    this.otpStore.set(key, { otp, expiresAt: Date.now() + 600000 }); // 10 min
  }

  private async verifyOTP(
    identifier: string,
    otp: string,
    type: string,
  ): Promise<boolean> {
    const key = `otp:${type}:${identifier}`;
    // @ts-expect-error - in-memory store
    const stored = this.otpStore?.get(key);

    if (!stored) return false;
    if (Date.now() > stored.expiresAt) return false;
    if (stored.otp !== otp) return false;

    // @ts-expect-error - in-memory store
    this.otpStore?.delete(key);
    return true;
  }

  private async logAudit(
    userId: string,
    action: string,
    entity: string,
    entityId: string,
    changes: Record<string, unknown>,
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action,
          entity,
          entityId,
          changes: changes as any,
          organizationId: 'system',
        },
      });
    } catch (error) {
      this.logger.error('Failed to create audit log', error);
    }
  }
}