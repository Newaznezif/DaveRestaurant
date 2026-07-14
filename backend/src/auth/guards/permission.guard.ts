import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permission.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    const userPermissions = await this.getUserPermissions(user.role);

    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Requires permissions: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }

  private async getUserPermissions(role: string): Promise<string[]> {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: {
        role: role as any,
        isActive: true,
      },
      include: {
        permission: true,
      },
    });

    return rolePermissions.map((rp) => rp.permission.name);
  }
}