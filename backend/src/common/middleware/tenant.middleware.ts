import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      organizationId?: string;
      branchId?: string;
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const organizationId = req.headers['x-organization-id'] as string | undefined;
    const branchId = req.headers['x-branch-id'] as string | undefined;

    if (organizationId) {
      req.organizationId = organizationId;
    }

    if (branchId) {
      req.branchId = branchId;
    }

    next();
  }
}