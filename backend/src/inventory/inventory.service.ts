import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, branchId?: string) {
    return this.prisma.inventoryItem.findMany({
      where: {
        organizationId,
        ...(branchId ? { branchId } : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(orgId: string, id: string) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!item) throw new NotFoundException('Inventory item not found');
    return item;
  }

  async create(orgId: string, dto: CreateInventoryItemDto) {
    return this.prisma.inventoryItem.create({
      data: {
        organizationId: orgId,
        branchId: dto.branchId,
        name: dto.name,
        sku: dto.sku,
        barcode: dto.barcode,
        category: dto.category,
        unit: dto.unit,
        quantity: dto.quantity ?? 0,
        minQuantity: dto.minQuantity ?? 0,
        maxQuantity: dto.maxQuantity,
        costPrice: dto.costPrice ?? 0,
        sellingPrice: dto.sellingPrice,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
        notes: dto.notes,
      },
    });
  }

  async update(orgId: string, id: string, dto: UpdateInventoryItemDto) {
    await this.findOne(orgId, id);
    const { expiryDate, ...rest } = dto as any;
    const data: any = { ...rest };
    if (expiryDate) data.expiryDate = new Date(expiryDate);
    return this.prisma.inventoryItem.update({ where: { id }, data });
  }

  async remove(orgId: string, id: string) {
    await this.findOne(orgId, id);
    await this.prisma.inventoryItem.delete({ where: { id } });
    return { success: true };
  }

  async findLowStock(organizationId: string, branchId?: string) {
    const items = await this.prisma.inventoryItem.findMany({
      where: {
        organizationId,
        ...(branchId ? { branchId } : {}),
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        category: true,
        unit: true,
        quantity: true,
        minQuantity: true,
        branchId: true,
        branch: { select: { name: true } },
      },
      orderBy: { quantity: 'asc' },
    });

    return items.filter((item) => item.quantity <= item.minQuantity);
  }
}