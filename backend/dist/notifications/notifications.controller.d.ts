import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(userId: string): Promise<never[]>;
    findById(userId: string, id: string): Promise<null>;
    markAsRead(userId: string, id: string): Promise<{
        message: string;
    }>;
}
