import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BranchService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.branch.create({ data });
  }

  async findAll(orgId: string) {
    return this.prisma.branch.findMany({ where: { organizationId: orgId } });
  }

  async findById(id: string) {
    return this.prisma.branch.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tables: true, employees: true, orders: true },
        },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.branch.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.branch.update({ where: { id }, data: { isActive: false } });
  }
}