import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Menu')
@ApiBearerAuth()
@Controller('menu')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // --- Categories ---
  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  async getCategories(
    @Query('organizationId') orgIdQuery: string,
    @CurrentUser('organizationId') currentOrgId: string,
  ) {
    // For public endpoints, we rely on the query parameter. Otherwise use the current user's org.
    const orgId = currentOrgId || orgIdQuery;
    return this.menuService.getCategories(orgId);
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  async getCategory(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.menuService.getCategory(orgId, id);
  }

  @Post('categories')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new category' })
  async createCategory(
    @CurrentUser('organizationId') orgId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.menuService.createCategory(orgId, dto);
  }

  @Patch('categories/:id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update a category' })
  async updateCategory(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.menuService.updateCategory(orgId, id, dto);
  }

  @Delete('categories/:id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete a category' })
  async deleteCategory(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.menuService.deleteCategory(orgId, id);
  }

  // --- Products ---
  @Public()
  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  async getProducts(
    @Query('organizationId') orgIdQuery: string,
    @Query('categoryId') categoryId: string,
    @CurrentUser('organizationId') currentOrgId: string,
  ) {
    const orgId = currentOrgId || orgIdQuery;
    return this.menuService.getProducts(orgId, categoryId);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  async getProduct(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.menuService.getProduct(orgId, id);
  }

  @Post('products')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new product' })
  async createProduct(
    @CurrentUser('organizationId') orgId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.menuService.createProduct(orgId, dto);
  }

  @Patch('products/:id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update a product' })
  async updateProduct(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.menuService.updateProduct(orgId, id, dto);
  }

  @Delete('products/:id')
  @Roles(UserRole.RESTAURANT_OWNER, UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete a product' })
  async deleteProduct(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.menuService.deleteProduct(orgId, id);
  }
}