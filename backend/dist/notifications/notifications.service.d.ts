export declare class NotificationsService {
    findAll(userId: string): Promise<never[]>;
    findById(userId: string, id: string): Promise<null>;
    markAsRead(userId: string, id: string): Promise<{
        message: string;
    }>;
}
