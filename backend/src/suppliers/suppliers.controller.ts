import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierStatus } from '@prisma/client';

class UpdateSupplierStatusDto {
  @IsEnum(SupplierStatus)
  status: SupplierStatus;
}

@ApiTags('Suppliers')
@ApiBearerAuth()
@Controller('suppliers')
@UseGuards(JwtAuthGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all suppliers for the organization' })
  async findAll(@CurrentUser('organizationId') orgId: string) {
    return this.suppliersService.findAll(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supplier by ID (includes recent purchase orders)' })
  async findOne(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.suppliersService.findOne(orgId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new supplier' })
  async create(
    @CurrentUser('organizationId') orgId: string,
    @Body() dto: CreateSupplierDto,
  ) {
    return this.suppliersService.create(orgId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update supplier metadata' })
  async update(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(orgId, id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update supplier status (ACTIVE, INACTIVE, BLACKLISTED, PENDING)' })
  async updateStatus(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSupplierStatusDto,
  ) {
    return this.suppliersService.updateStatus(orgId, id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete supplier (archives if purchase orders exist)' })
  async remove(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.suppliersService.remove(orgId, id);
  }
}