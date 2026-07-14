import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewsService {
  async create(userId: string, data: any) {
    return { message: 'Review created' };
  }

  async findByProduct(productId: string) {
    return [];
  }
}