import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierStatus } from '@prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async findAll(orgId: string) {
    return this.prisma.supplier.findMany({
      where: { organizationId: orgId },
      include: {
        _count: { select: { purchaseOrders: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(orgId: string, id: string) {
    const supplier = await this.prisma.supplier.findFirst({
      where: { id, organizationId: orgId },
      include: {
        purchaseOrders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
        },
        _count: { select: { purchaseOrders: true } },
      },
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

  async updateStatus(orgId: string, id: string, status: SupplierStatus) {
    await this.findOne(orgId, id);
    return this.prisma.supplier.update({ where: { id }, data: { status } });
  }

  async remove(orgId: string, id: string) {
    const supplier = await this.findOne(orgId, id);

    // Guard: block hard-delete if any purchase orders exist
    if ((supplier as any)._count?.purchaseOrders > 0) {
      // Soft-archive instead
      await this.prisma.supplier.update({
        where: { id },
        data: { status: SupplierStatus.INACTIVE },
      });
      return { success: true, archived: true, message: 'Supplier has purchase orders — archived instead of deleted.' };
    }

    await this.prisma.supplier.delete({ where: { id } });
    return { success: true, archived: false };
  }
}