import { Injectable, Logger, BadRequestException } from '@nestjs/common';
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

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: AppConfigService,
  ) {}

  async generateTokens(
    userId: string,
    email: string,
    role: string,
    organizationId?: string | null,
    branchId?: string | null,
  ) {
    const payload: TokenPayload = {
      sub: userId,
      email,
      role,
      ...(organizationId ? { organizationId } : {}),
      ...(branchId ? { branchId } : {}),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.jwt.accessSecret,
        expiresIn: this.configService.jwt.accessExpiry,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.jwt.refreshSecret,
        expiresIn: this.configService.jwt.refreshExpiry,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.configService.jwt.accessSecret,
      });

      const blacklisted = await this.prisma.tokenBlacklist.findUnique({
        where: { token },
      });

      if (blacklisted) {
        throw new BadRequestException('Token has been revoked');
      }

      return payload;
    } catch (error) {
      this.logger.warn(`Invalid access token: ${error.message}`);
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.configService.jwt.refreshSecret,
      });

      const blacklisted = await this.prisma.tokenBlacklist.findUnique({
        where: { token },
      });

      if (blacklisted) {
        throw new BadRequestException('Refresh token has been revoked');
      }

      return payload;
    } catch (error) {
      this.logger.warn(`Invalid refresh token: ${error.message}`);
      throw new BadRequestException('Invalid or expired refresh token');
    }
  }

  async blacklistToken(token: string, userId: string, reason: string, expiresIn: string) {
    const expiresAt = new Date();
    const expiryMatch = expiresIn.match(/(\d+)([mhsd])/);
    
    if (expiryMatch) {
      const value = parseInt(expiryMatch[1]);
      const unit = expiryMatch[2];
      
      switch (unit) {
        case 's':
          expiresAt.setSeconds(expiresAt.getSeconds() + value);
          break;
        case 'm':
          expiresAt.setMinutes(expiresAt.getMinutes() + value);
          break;
        case 'h':
          expiresAt.setHours(expiresAt.getHours() + value);
          break;
        case 'd':
          expiresAt.setDate(expiresAt.getDate() + value);
          break;
      }
    } else {
      expiresAt.setHours(expiresAt.getHours() + 1);
    }

    await this.prisma.tokenBlacklist.create({
      data: {
        token,
        userId,
        reason,
        expiresAt,
      },
    });

    this.logger.log(`Token blacklisted for user ${userId}, reason: ${reason}`);
  }

  async blacklistAllUserTokens(userId: string, reason: string) {
    const sessions = await this.prisma.session.findMany({
      where: { userId, isActive: true },
      select: { token: true, refreshToken: true },
    });

    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const blacklistEntries = sessions.flatMap(session => [
      {
        token: session.token,
        userId,
        reason,
        expiresAt,
      },
      {
        token: session.refreshToken,
        userId,
        reason,
        expiresAt,
      },
    ]);

    if (blacklistEntries.length > 0) {
      await this.prisma.tokenBlacklist.createMany({
        data: blacklistEntries,
        skipDuplicates: true,
      });
    }

    await this.prisma.session.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });

    this.logger.log(`All tokens blacklisted for user ${userId}, reason: ${reason}`);
  }

  async cleanupExpiredTokens() {
    const result = await this.prisma.tokenBlacklist.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    if (result.count > 0) {
      this.logger.log(`Cleaned up ${result.count} expired blacklisted tokens`);
    }

    return result.count;
  }
}