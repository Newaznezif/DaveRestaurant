import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@ApiTags('Suppliers')
@ApiBearerAuth()
@Controller('suppliers')
@UseGuards(JwtAuthGuard)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all suppliers' })
  async findAll(@CurrentUser('organizationId') orgId: string) {
    return this.suppliersService.findAll(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supplier by ID' })
  async findOne(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.suppliersService.findOne(orgId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a supplier' })
  async create(
    @CurrentUser('organizationId') orgId: string,
    @Body() dto: CreateSupplierDto,
  ) {
    return this.suppliersService.create(orgId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a supplier' })
  async update(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(orgId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a supplier' })
  async remove(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.suppliersService.remove(orgId, id);
  }
}