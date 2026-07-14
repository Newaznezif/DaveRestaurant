import { DeliveryService } from './delivery.service';
export declare class DeliveryController {
    private readonly deliveryService;
    constructor(deliveryService: DeliveryService);
    create(data: any): Promise<{
        message: string;
    }>;
    findById(id: string): Promise<null>;
    updateStatus(id: string, status: string): Promise<{
        message: string;
    }>;
}
