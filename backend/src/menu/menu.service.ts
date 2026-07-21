import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    const productCount = await this.prisma.product.count({
      where: { categoryId: id },
    });
    if (productCount > 0) {
      throw new BadRequestException(
        `Cannot delete category — it still contains ${productCount} product(s). Move or delete them first.`,
      );
    }
    await this.prisma.menuCategory.delete({ where: { id } });
    return { success: true };
  }

  private mapProduct(product: any) {
    if (!product) return null;
    return {
      ...product,
      cost: product.costPrice,
    };
  }

  // Products
  async getProducts(orgId: string, categoryId?: string) {
    const products = await this.prisma.product.findMany({
      where: { organizationId: orgId, ...(categoryId && { categoryId }) },
      include: { variants: true, addonGroups: { include: { items: true } }, category: true },
      orderBy: { name: 'asc' }
    });
    return products.map(p => this.mapProduct(p));
  }

  async getProduct(orgId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, organizationId: orgId },
      include: { category: true }
    });
    if (!product) throw new NotFoundException('Product not found');
    return this.mapProduct(product);
  }

  async createProduct(orgId: string, dto: CreateProductDto) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const { cost, ...rest } = dto;
    const product = await this.prisma.product.create({
      data: { ...rest, costPrice: cost, organizationId: orgId, slug },
    });
    return this.mapProduct(product);
  }

  async updateProduct(orgId: string, id: string, dto: UpdateProductDto) {
    await this.getProduct(orgId, id);
    const { cost, ...rest } = dto;
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(cost !== undefined && { costPrice: cost }),
      },
    });
    return this.mapProduct(product);
  }

  async deleteProduct(orgId: string, id: string) {
    await this.getProduct(orgId, id);
    await this.prisma.product.delete({ where: { id } });
    return { success: true };
  }
}