import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { StockMovementDto } from './dto/stock-movement.dto';

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // ─── Item CRUD ────────────────────────────────────────────────────────────

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
  @ApiOperation({ summary: 'Get inventory item by ID (includes movement history)' })
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
  @ApiOperation({ summary: 'Update inventory item metadata' })
  async update(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.update(orgId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archive (soft-delete) an inventory item' })
  async remove(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.inventoryService.remove(orgId, id);
  }

  // ─── Stock Movements ─────────────────────────────────────────────────────

  @Post(':id/movements')
  @ApiOperation({ summary: 'Record a stock movement (stock-in, out, adjustment)' })
  async recordMovement(
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: StockMovementDto,
  ) {
    return this.inventoryService.recordMovement(orgId, id, dto, userId);
  }

  @Get(':id/movements')
  @ApiOperation({ summary: 'Get movement history for an inventory item' })
  async getMovements(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.inventoryService.getMovements(orgId, id);
  }
}