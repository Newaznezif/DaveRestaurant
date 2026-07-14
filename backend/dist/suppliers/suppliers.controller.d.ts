import { SuppliersService } from './suppliers.service';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    create(orgId: string, data: any): Promise<{
        message: string;
    }>;
    findAll(orgId: string): Promise<never[]>;
}
