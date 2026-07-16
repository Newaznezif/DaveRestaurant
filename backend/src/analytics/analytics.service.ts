import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(organizationId: string, branchId?: string) {
    const branchFilter = branchId ? { branchId } : {};
    const orgBranchFilter = { organizationId, ...branchFilter };

    // Today boundaries
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 30-day window
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      const [
        todayRevenue,
        totalOrders,
        todayOrders,
        activeCustomers,
        lowStockItems,
        recentOrders,
        topProducts,
      ] = await Promise.all([
        // Today's revenue from completed/paid orders
        this.prisma.order.aggregate({
          where: {
            ...orgBranchFilter,
            status: { in: ['DELIVERED', 'SERVED'] },
            createdAt: { gte: todayStart, lte: todayEnd },
          },
          _sum: { totalAmount: true },
        }),

        // Total orders count (all time for org)
        this.prisma.order.count({
          where: orgBranchFilter,
        }),

        // Today's orders
        this.prisma.order.count({
          where: {
            ...orgBranchFilter,
            createdAt: { gte: todayStart, lte: todayEnd },
          },
        }),

        // Distinct customers who ordered in last 30 days
        this.prisma.order.findMany({
          where: {
            ...orgBranchFilter,
            customerId: { not: null },
            createdAt: { gte: thirtyDaysAgo },
          },
          select: { customerId: true },
          distinct: ['customerId'],
        }),

        // Low-stock inventory items (quantity <= minQuantity)
        this.prisma.inventoryItem.count({
          where: {
            organizationId,
            ...(branchId ? { branchId } : {}),
            isActive: true,
          },
        }).then(async () => {
          // Use aggregation-safe approach
          const items = await this.prisma.inventoryItem.findMany({
            where: {
              organizationId,
              ...(branchId ? { branchId } : {}),
              isActive: true,
            },
            select: { quantity: true, minQuantity: true },
          });
          return items.filter((i) => i.quantity <= i.minQuantity).length;
        }),

        // Recent orders (last 10)
        this.prisma.order.findMany({
          where: orgBranchFilter,
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
            customer: {
              select: {
                user: { select: { displayName: true, avatar: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),

        // Top 5 products by order item quantity in last 30 days
        this.prisma.orderItem.groupBy({
          by: ['productId'],
          where: {
            order: {
              ...orgBranchFilter,
              createdAt: { gte: thirtyDaysAgo },
            },
          },
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 5,
        }),
      ]);

      return {
        revenue: {
          today: Number(todayRevenue?._sum?.totalAmount ?? 0),
        },
        orders: {
          total: totalOrders,
          today: todayOrders,
        },
        customers: {
          active: activeCustomers.length,
        },
        inventory: {
          lowStockCount: lowStockItems,
        },
        recentOrders,
        topProducts,
      };
    } catch (error) {
      this.logger.error('Error fetching dashboard analytics', error);
      // Return safe defaults on error
      return {
        revenue: { today: 0 },
        orders: { total: 0, today: 0 },
        customers: { active: 0 },
        inventory: { lowStockCount: 0 },
        recentOrders: [],
        topProducts: [],
      };
    }
  }
}