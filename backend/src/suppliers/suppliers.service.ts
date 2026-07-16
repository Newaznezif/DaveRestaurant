import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async findAll(orgId: string) {
    return this.prisma.supplier.findMany({
      where: { organizationId: orgId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(orgId: string, id: string) {
    const supplier = await this.prisma.supplier.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  async create(orgId: string, dto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: { ...dto, organizationId: orgId },
    });
  }

  async update(orgId: string, id: string, dto: UpdateSupplierDto) {
    await this.findOne(orgId, id);
    return this.prisma.supplier.update({ where: { id }, data: dto });
  }

  async remove(orgId: string, id: string) {
    await this.findOne(orgId, id);
    await this.prisma.supplier.delete({ where: { id } });
    return { success: true };
  }
}