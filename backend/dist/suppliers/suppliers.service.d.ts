export declare class SuppliersService {
    create(orgId: string, data: any): Promise<{
        message: string;
    }>;
    findAll(orgId: string): Promise<never[]>;
}
