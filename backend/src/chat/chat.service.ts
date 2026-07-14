import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  async getMessages(roomId: string) {
    return [];
  }

  async sendMessage(roomId: string, message: any) {
    return { message: 'Message sent' };
  }
}