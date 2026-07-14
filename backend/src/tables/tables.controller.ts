import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Tables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.MANAGER)
  async create(@Body() data: any) {
    return this.tablesService.create(data);
  }

  @Get('branch/:branchId')
  async findByBranch(@Param('branchId') branchId: string) {
    return this.tablesService.findByBranch(branchId);
  }

  @Patch(':id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.MANAGER)
  async update(@Param('id') id: string, @Body() data: any) {
    return this.tablesService.update(id, data);
  }

  @Patch(':id/status')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.MANAGER, UserRole.WAITER)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.tablesService.updateStatus(id, status);
  }

  @Post('floors')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.MANAGER)
  async createFloor(@Body() data: any) {
    return this.tablesService.createFloor(data);
  }

  @Get('floors/:branchId')
  async getFloors(@Param('branchId') branchId: string) {
    return this.tablesService.getFloors(branchId);
  }

  @Patch('floors/:id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.MANAGER)
  async updateFloor(@Param('id') id: string, @Body() data: any) {
    return this.tablesService.updateFloor(id, data);
  }
}