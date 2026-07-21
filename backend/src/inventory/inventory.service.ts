import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { StockMovementDto } from './dto/stock-movement.dto';
import { StockMovementType } from '@prisma/client';

const STOCK_IN_TYPES: StockMovementType[] = [
  StockMovementType.PURCHASE,
  StockMovementType.TRANSFER_IN,
  StockMovementType.RETURN,
];

const STOCK_OUT_TYPES: StockMovementType[] = [
  StockMovementType.SALE,
  StockMovementType.TRANSFER_OUT,
  StockMovementType.WASTE,
  StockMovementType.EXPIRY,
];

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Items ───────────────────────────────────────────────────────────────

  async findAll(organizationId: string, branchId?: string) {
    return this.prisma.inventoryItem.findMany({
      where: {
        organizationId,
        ...(branchId ? { branchId } : {}),
        isActive: true,
      },
      include: {
        branch: { select: { id: true, name: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(orgId: string, id: string) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { id, organizationId: orgId },
      include: {
        branch: { select: { id: true, name: true } },
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
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
    // Soft-delete
    await this.prisma.inventoryItem.update({
      where: { id },
      data: { isActive: false },
    });
    return { success: true };
  }

  // ─── Stock Movements ─────────────────────────────────────────────────────

  /**
   * Record a stock movement using a Prisma transaction to ensure atomicity.
   * ADJUSTMENT type sets quantity to an absolute value (delta = target - current).
   * All other types add (stock-in) or subtract (stock-out) from current quantity.
   */
  async recordMovement(
    orgId: string,
    itemId: string,
    dto: StockMovementDto,
    userId?: string,
  ) {
    const item = await this.findOne(orgId, itemId);

    return this.prisma.$transaction(async (tx) => {
      const current = item.quantity;
      let after: number;
      let quantity = dto.quantity;

      if (dto.type === StockMovementType.ADJUSTMENT) {
        // dto.quantity is the NEW absolute quantity, so delta = new - old
        after = quantity;
        quantity = Math.abs(after - current); // stored movement qty is always positive
      } else if (STOCK_IN_TYPES.includes(dto.type)) {
        after = current + quantity;
      } else if (STOCK_OUT_TYPES.includes(dto.type)) {
        if (current < quantity) {
          throw new BadRequestException(
            `Insufficient stock. Available: ${current} ${item.unit}`,
          );
        }
        after = current - quantity;
      } else {
        throw new BadRequestException(`Unknown movement type: ${dto.type}`);
      }

      // Update the quantity on the inventory item
      await tx.inventoryItem.update({
        where: { id: itemId },
        data: { quantity: after },
      });

      // Create the movement record
      const movement = await tx.stockMovement.create({
        data: {
          inventoryId: itemId,
          type: dto.type,
          quantity,
          beforeQuantity: current,
          afterQuantity: after,
          reference: dto.reference,
          notes: dto.notes,
          userId,
        },
      });

      return {
        item: { ...item, quantity: after },
        movement,
        isLowStock: after <= item.minQuantity,
      };
    });
  }

  async getMovements(orgId: string, itemId: string) {
    await this.findOne(orgId, itemId);
    return this.prisma.stockMovement.findMany({
      where: { inventoryId: itemId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Low Stock ───────────────────────────────────────────────────────────

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