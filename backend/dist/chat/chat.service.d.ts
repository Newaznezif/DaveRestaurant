export declare class ChatService {
    getMessages(roomId: string): Promise<never[]>;
    sendMessage(roomId: string, message: any): Promise<{
        message: string;
    }>;
}
