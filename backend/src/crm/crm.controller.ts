import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CrmService } from './crm.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('Customers')
@ApiBearerAuth()
@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers for organization' })
  async findAll(@CurrentUser('organizationId') orgId: string) {
    return this.crmService.findAll(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  async findOne(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.crmService.findOne(orgId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  async create(
    @CurrentUser('organizationId') orgId: string,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    return this.crmService.create(orgId, createCustomerDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  async update(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.crmService.update(orgId, id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer' })
  async remove(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.crmService.remove(orgId, id);
  }

  @Patch(':id/loyalty')
  @ApiOperation({ summary: 'Update customer loyalty points' })
  async updateLoyalty(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
    @Body('points') points: number,
  ) {
    return this.crmService.updateLoyalty(orgId, id, points);
  }
}