import { CouponsService } from './coupons.service';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    create(data: any): Promise<{
        message: string;
    }>;
    findAll(orgId: string): Promise<never[]>;
}
