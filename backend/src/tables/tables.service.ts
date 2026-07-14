import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.restaurantTable.create({ data });
  }

  async findByBranch(branchId: string) {
    return this.prisma.restaurantTable.findMany({
      where: { branchId, isActive: true },
      include: {
        floor: true,
        orders: {
          where: { status: { notIn: ['COMPLETED' as any, 'CANCELLED' as any, 'REFUNDED' as any] } },
          take: 1,
        },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.restaurantTable.update({ where: { id }, data });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.restaurantTable.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async createFloor(data: any) {
    return this.prisma.floorPlan.create({ data });
  }

  async getFloors(branchId: string) {
    return this.prisma.floorPlan.findMany({
      where: { branchId, isActive: true },
      include: { tables: true },
    });
  }

  async updateFloor(id: string, data: any) {
    return this.prisma.floorPlan.update({ where: { id }, data });
  }
}