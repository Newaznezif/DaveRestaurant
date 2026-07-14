import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
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

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: AppConfigService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwt.accessSecret,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          isVerified: true,
          organizationId: true,
          branchId: true,
          firstName: true,
          lastName: true,
          avatar: true,
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
              isActive: true,
            },
          },
          branch: {
            select: {
              id: true,
              name: true,
              isActive: true,
            },
          },
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      if (user.organization && !user.organization.isActive) {
        throw new UnauthorizedException('Organization is deactivated');
      }

      if (user.branch && !user.branch.isActive) {
        throw new UnauthorizedException('Branch is deactivated');
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        organizationId: user.organizationId,
        branchId: user.branchId,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        organization: user.organization,
        branch: user.branch,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}