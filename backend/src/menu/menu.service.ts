import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(data: any) {
    return this.prisma.menuCategory.create({ data });
  }

  async getCategories(orgId: string) {
    return this.prisma.menuCategory.findMany({
      where: { organizationId: orgId, isActive: true },
      include: {
        products: {
          where: { isActive: true },
          include: { variants: true, addonGroups: { include: { items: true } } },
        },
        children: true,
      },
    });
  }

  async createProduct(data: any) {
    return this.prisma.product.create({ data });
  }

  async getProducts(orgId: string, categoryId?: string) {
    return this.prisma.product.findMany({
      where: { organizationId: orgId, isActive: true, ...(categoryId && { categoryId }) },
      include: { variants: true, addonGroups: { include: { items: true } }, category: true },
    });
  }
}