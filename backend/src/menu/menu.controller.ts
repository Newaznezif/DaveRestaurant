import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Public()
  @Get('categories/:orgId')
  async getCategories(@Param('orgId') orgId: string) {
    return this.menuService.getCategories(orgId);
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.MANAGER)
  async createCategory(@Body() data: any) {
    return this.menuService.createCategory(data);
  }

  @Public()
  @Get('products/:orgId')
  async getProducts(@Param('orgId') orgId: string, @Query('categoryId') categoryId?: string) {
    return this.menuService.getProducts(orgId, categoryId);
  }

  @Post('products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.MANAGER)
  async createProduct(@Body() data: any) {
    return this.menuService.createProduct(data);
  }
}