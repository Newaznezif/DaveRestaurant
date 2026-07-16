import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.executeInTransaction(async (tx) => {
      const order = await tx.order.create({
        data: { ...data, orderNumber: `ORD-${Date.now()}` },
        include: { items: { include: { addons: true } } },
      });
      // Update table status if dine-in
      if (data.tableId) {
        await tx.restaurantTable.update({
          where: { id: data.tableId },
          data: { status: 'OCCUPIED' },
        });
      }
      return order;
    });
  }

  async findAll(organizationId: string, branchId?: string, query: any = {}) {
    const { organizationId: _org, branchId: _branch, ...safeQuery } = query;
    const where: any = { ...safeQuery, organizationId };
    if (branchId) where.branchId = branchId;
    return this.prisma.paginate('order', where, {
      include: { items: { include: { addons: true } }, payments: true, table: true, customer: true },
      limit: 20,
    });
  }

  async findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { addons: true, product: true } },
        payments: true,
        table: true,
        customer: true,
        delivery: true,
      },
    });
  }

  async findByNumber(orderNumber: string) {
    return this.prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true, payments: true },
    });
  }

  async updateStatus(id: string, status: string, timestamps?: any) {
    return this.prisma.order.update({ where: { id }, data: { status, ...timestamps } });
  }

  async addPayment(id: string, data: any) {
    return this.prisma.payment.create({ data: { orderId: id, ...data } });
  }

  async getKitchenOrders(branchId: string) {
    return this.prisma.order.findMany({
      where: { branchId, status: { in: ['CONFIRMED', 'PREPARING'] } },
      include: {
        items: {
          where: { status: { in: ['PENDING', 'COOKING'] } },
          include: { product: true, addons: true },
        },
        table: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateItemStatus(itemId: string, status: string) {
    return this.prisma.orderItem.update({
      where: { id: itemId },
      data: {
        status,
        ...(status === 'COOKING' ? { startedAt: new Date() } : status === 'READY' ? { completedAt: new Date() } : {}),
      },
    });
  }
}