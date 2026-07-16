import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(organizationId: string, branchId?: string): Promise<{
        revenue: {
            today: number;
        };
        orders: {
            total: number;
            today: number;
        };
        customers: {
            active: number;
        };
        inventory: {
            lowStockCount: number;
        };
        recentOrders: {
            customer: {
                user: {
                    displayName: string | null;
                    avatar: string | null;
                } | null;
            } | null;
            createdAt: Date;
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderNumber: string;
            totalAmount: number;
        }[];
        topProducts: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.OrderItemGroupByOutputType, "productId"[]> & {
            _sum: {
                quantity: number | null;
            };
        })[];
    }>;
}
