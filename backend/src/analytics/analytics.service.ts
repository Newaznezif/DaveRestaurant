import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  async getDashboard(orgId: string) {
    return { message: 'Analytics dashboard - implementation pending' };
  }
}