import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  // Categories
  async getCategories(orgId: string) {
    return this.prisma.menuCategory.findMany({
      where: { organizationId: orgId },
      orderBy: { sortOrder: 'asc' },
      include: {
        products: {
          where: { isActive: true },
          include: { variants: true, addonGroups: { include: { items: true } } },
        },
        children: true,
      },
    });
  }

  async getCategory(orgId: string, id: string) {
    const category = await this.prisma.menuCategory.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async createCategory(orgId: string, dto: CreateCategoryDto) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    return this.prisma.menuCategory.create({
      data: { ...dto, organizationId: orgId, slug },
    });
  }

  async updateCategory(orgId: string, id: string, dto: UpdateCategoryDto) {
    await this.getCategory(orgId, id);
    return this.prisma.menuCategory.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCategory(orgId: string, id: string) {
    await this.getCategory(orgId, id);
    await this.prisma.menuCategory.delete({ where: { id } });
    return { success: true };
  }

  // Products
  async getProducts(orgId: string, categoryId?: string) {
    return this.prisma.product.findMany({
      where: { organizationId: orgId, ...(categoryId && { categoryId }) },
      include: { variants: true, addonGroups: { include: { items: true } }, category: true },
      orderBy: { name: 'asc' }
    });
  }

  async getProduct(orgId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, organizationId: orgId },
      include: { category: true }
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async createProduct(orgId: string, dto: CreateProductDto) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    return this.prisma.product.create({
      data: { ...dto, organizationId: orgId, slug },
    });
  }

  async updateProduct(orgId: string, id: string, dto: UpdateProductDto) {
    await this.getProduct(orgId, id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async deleteProduct(orgId: string, id: string) {
    await this.getProduct(orgId, id);
    await this.prisma.product.delete({ where: { id } });
    return { success: true };
  }
}