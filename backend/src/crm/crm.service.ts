import { Injectable } from '@nestjs/common';

@Injectable()
export class CrmService {
  async getCustomers(userId: string) {
    return [];
  }
}