import { Injectable } from '@nestjs/common';

@Injectable()
export class DeliveryService {
  async create(data: any) {
    return { message: 'Delivery created' };
  }

  async findById(id: string) {
    return null;
  }

  async updateStatus(id: string, status: string) {
    return { message: 'Status updated' };
  }
}