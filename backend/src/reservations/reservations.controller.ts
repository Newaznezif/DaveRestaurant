import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly svc: ReservationsService) {}

  @Post()
  @Public()
  async create(@Body() data: any) {
    return this.svc.create(data);
  }

  @Get(':orgId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.RESTAURANT_OWNER, UserRole.MANAGER)
  async findAll(@Param('orgId') orgId: string, @Query() q: any) {
    return this.svc.findAll(orgId, q);
  }

  @Get('detail/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.MANAGER, UserRole.WAITER)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.svc.updateStatus(id, status);
  }

  @Get('date/:branchId/:date')
  @UseGuards(JwtAuthGuard)
  async getByDate(@Param('branchId') branchId: string, @Param('date') date: string) {
    return this.svc.getByDate(branchId, date);
  }
}