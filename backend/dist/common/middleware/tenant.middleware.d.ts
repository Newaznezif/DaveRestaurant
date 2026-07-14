import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            organizationId?: string;
            branchId?: string;
        }
    }
}
export declare class TenantMiddleware implements NestMiddleware {
    use(req: Request, _res: Response, next: NextFunction): void;
}
