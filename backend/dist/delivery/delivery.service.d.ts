export declare class DeliveryService {
    create(data: any): Promise<{
        message: string;
    }>;
    findById(id: string): Promise<null>;
    updateStatus(id: string, status: string): Promise<{
        message: string;
    }>;
}
