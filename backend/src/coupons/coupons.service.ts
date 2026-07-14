import { Injectable } from '@nestjs/common';

@Injectable()
export class CouponsService {
  async create(data: any) {
    return { message: 'Coupon created' };
  }

  async findAll(orgId: string) {
    return [];
  }
}