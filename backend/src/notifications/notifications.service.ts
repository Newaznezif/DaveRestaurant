import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async findAll(userId: string) {
    return [];
  }

  async findById(userId: string, id: string) {
    return null;
  }

  async markAsRead(userId: string, id: string) {
    return { message: 'Marked as read' };
  }
}