import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoryService {
  async findAll(orgId: string) {
    return [];
  }
}