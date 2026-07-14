import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  async getSalesReport(orgId: string) {
    return [];
  }
}