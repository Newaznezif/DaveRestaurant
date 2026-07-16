import { Controller, Get, Post, Patch, Delete, Query, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all inventory items' })
  async findAll(
    @CurrentUser('organizationId') orgId: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.inventoryService.findAll(orgId, branchId);
  }

  @Get('low-stock')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.RESTAURANT_OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get low-stock items' })
  async findLowStock(
    @CurrentUser('organizationId') orgId: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.inventoryService.findLowStock(orgId, branchId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inventory item by ID' })
  async findOne(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.inventoryService.findOne(orgId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create inventory item' })
  async create(
    @CurrentUser('organizationId') orgId: string,
    @Body() dto: CreateInventoryItemDto,
  ) {
    return this.inventoryService.create(orgId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update inventory item' })
  async update(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.update(orgId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete inventory item' })
  async remove(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.inventoryService.remove(orgId, id);
  }
}