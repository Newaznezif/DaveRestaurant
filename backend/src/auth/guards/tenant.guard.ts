import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    if (user.role === 'SUPER_ADMIN') {
      request.tenant = {
        organizationId: user.organizationId,
        branchId: user.branchId,
      };
      return true;
    }

    const organizationId = request.headers['x-organization-id'] || request.body?.organizationId || user.organizationId;
    const branchId = request.headers['x-branch-id'] || request.body?.branchId || user.branchId;

    if (!organizationId) {
      throw new ForbiddenException('Organization context required');
    }

    if (user.organizationId && user.organizationId !== organizationId) {
      throw new ForbiddenException('Cross-tenant access denied');
    }

    if (branchId) {
      const branch = await this.prisma.branch.findFirst({
        where: {
          id: branchId,
          organizationId,
        },
      });

      if (!branch) {
        throw new ForbiddenException('Branch does not belong to organization');
      }

      if (user.branchId && user.branchId !== branchId) {
        throw new ForbiddenException('Cross-branch access denied');
      }
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true, isActive: true },
    });

    if (!organization) {
      throw new ForbiddenException('Organization not found');
    }

    if (!organization.isActive) {
      throw new ForbiddenException('Organization is deactivated');
    }

    request.tenant = {
      organizationId,
      branchId,
    };

    return true;
  }
}