import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Public()
  async create(@Body() data: any) {
    return this.ordersService.create(data);
  }

  @Get(':orgId')
  @UseGuards(JwtAuthGuard)
  async findAll(@Param('orgId') orgId: string, @Query() query: any) {
    return this.ordersService.findAll(orgId, query);
  }

  @Get('detail/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Get('number/:orderNumber')
  @Public()
  async findByNumber(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findByNumber(orderNumber);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.MANAGER, UserRole.WAITER)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }

  @Post(':id/payment')
  @UseGuards(JwtAuthGuard)
  async addPayment(@Param('id') id: string, @Body() data: any) {
    return this.ordersService.addPayment(id, data);
  }

  @Get('kitchen/:branchId')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.MANAGER, UserRole.KITCHEN_STAFF)
  async getKitchenOrders(@Param('branchId') branchId: string) {
    return this.ordersService.getKitchenOrders(branchId);
  }

  @Patch('items/:itemId/status')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.MANAGER, UserRole.KITCHEN_STAFF)
  async updateItemStatus(@Param('itemId') itemId: string, @Body('status') status: string) {
    return this.ordersService.updateItemStatus(itemId, status);
  }
}