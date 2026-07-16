"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AnalyticsService_1.name);
    }
    async getDashboard(organizationId, branchId) {
        const branchFilter = branchId ? { branchId } : {};
        const orgBranchFilter = { organizationId, ...branchFilter };
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        try {
            const [todayRevenue, totalOrders, todayOrders, activeCustomers, lowStockItems, recentOrders, topProducts,] = await Promise.all([
                this.prisma.order.aggregate({
                    where: {
                        ...orgBranchFilter,
                        status: { in: ['DELIVERED', 'SERVED'] },
                        createdAt: { gte: todayStart, lte: todayEnd },
                    },
                    _sum: { totalAmount: true },
                }),
                this.prisma.order.count({
                    where: orgBranchFilter,
                }),
                this.prisma.order.count({
                    where: {
                        ...orgBranchFilter,
                        createdAt: { gte: todayStart, lte: todayEnd },
                    },
                }),
                this.prisma.order.findMany({
                    where: {
                        ...orgBranchFilter,
                        customerId: { not: null },
                        createdAt: { gte: thirtyDaysAgo },
                    },
                    select: { customerId: true },
                    distinct: ['customerId'],
                }),
                this.prisma.inventoryItem.count({
                    where: {
                        organizationId,
                        ...(branchId ? { branchId } : {}),
                        isActive: true,
                    },
                }).then(async () => {
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
        }
        catch (error) {
            this.logger.error('Error fetching dashboard analytics', error);
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map