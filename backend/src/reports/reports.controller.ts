import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales/:orgId')
  @UseGuards(JwtAuthGuard)
  async getSalesReport(@CurrentUser('organizationId') orgId: string, @Param('orgId') orgIdParam: string) {
    return this.reportsService.getSalesReport(orgId || orgIdParam);
  }
}