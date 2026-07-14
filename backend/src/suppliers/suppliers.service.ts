import { Injectable } from '@nestjs/common';

@Injectable()
export class SuppliersService {
  async create(orgId: string, data: any) {
    return { message: 'Supplier created' };
  }

  async findAll(orgId: string) {
    return [];
  }
}