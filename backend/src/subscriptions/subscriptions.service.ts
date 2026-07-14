import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionsService {
  async findAll(orgId: string) {
    return [];
  }
}