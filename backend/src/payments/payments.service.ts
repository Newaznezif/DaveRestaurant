import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  async findByOrder(orderId: string) {
    return [];
  }
}