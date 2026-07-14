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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = OrdersService_1 = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(OrdersService_1.name);
    }
    async create(data) {
        return this.prisma.executeInTransaction(async (tx) => {
            const order = await tx.order.create({
                data: { ...data, orderNumber: `ORD-${Date.now()}` },
                include: { items: { include: { addons: true } } },
            });
            if (data.tableId) {
                await tx.restaurantTable.update({
                    where: { id: data.tableId },
                    data: { status: 'OCCUPIED' },
                });
            }
            return order;
        });
    }
    async findAll(orgId, query = {}) {
        return this.prisma.paginate('order', { organizationId: orgId, ...query }, {
            include: { items: { include: { addons: true } }, payments: true, table: true, customer: true },
            limit: 20,
        });
    }
    async findById(id) {
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
    async findByNumber(orderNumber) {
        return this.prisma.order.findUnique({
            where: { orderNumber },
            include: { items: true, payments: true },
        });
    }
    async updateStatus(id, status, timestamps) {
        return this.prisma.order.update({ where: { id }, data: { status, ...timestamps } });
    }
    async addPayment(id, data) {
        return this.prisma.payment.create({ data: { orderId: id, ...data } });
    }
    async getKitchenOrders(branchId) {
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
    async updateItemStatus(itemId, status) {
        return this.prisma.orderItem.update({
            where: { id: itemId },
            data: {
                status,
                ...(status === 'COOKING' ? { startedAt: new Date() } : status === 'READY' ? { completedAt: new Date() } : {}),
            },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map