import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly svc: ReservationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all reservations' })
  async findAll(
    @CurrentUser('organizationId') orgId: string,
    @Query('branchId') branchId?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    return this.svc.findAll(orgId, { branchId, status, date });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation by ID' })
  async findOne(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.svc.findOne(orgId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a reservation' })
  async create(
    @CurrentUser('organizationId') orgId: string,
    @Body() dto: CreateReservationDto,
  ) {
    return this.svc.create(orgId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a reservation' })
  async update(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.svc.update(orgId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reservation' })
  async remove(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.svc.remove(orgId, id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update reservation status' })
  async updateStatus(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.svc.updateStatus(orgId, id, status);
  }

  @Get('by-date/:branchId/:date')
  @ApiOperation({ summary: 'Get reservations by branch and date' })
  async getByDate(
    @CurrentUser('organizationId') orgId: string,
    @Param('branchId') branchId: string,
    @Param('date') date: string,
  ) {
    return this.svc.getByDate(orgId, branchId, date);
  }
}