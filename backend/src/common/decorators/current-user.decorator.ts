import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  organizationId?: string;
  branchId?: string;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext): AuthenticatedUser | string | boolean | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedUser | undefined;

    if (!user) {
      return undefined;
    }

    if (data) {
      return user[data];
    }
    return user;
  },
);