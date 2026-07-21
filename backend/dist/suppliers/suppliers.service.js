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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SuppliersService = class SuppliersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(orgId) {
        return this.prisma.supplier.findMany({
            where: { organizationId: orgId },
            include: {
                _count: { select: { purchaseOrders: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(orgId, id) {
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
        if (!supplier)
            throw new common_1.NotFoundException('Supplier not found');
        return supplier;
    }
    async create(orgId, dto) {
        return this.prisma.supplier.create({
            data: { ...dto, organizationId: orgId },
        });
    }
    async update(orgId, id, dto) {
        await this.findOne(orgId, id);
        return this.prisma.supplier.update({ where: { id }, data: dto });
    }
    async updateStatus(orgId, id, status) {
        await this.findOne(orgId, id);
        return this.prisma.supplier.update({ where: { id }, data: { status } });
    }
    async remove(orgId, id) {
        const supplier = await this.findOne(orgId, id);
        if (supplier._count?.purchaseOrders > 0) {
            await this.prisma.supplier.update({
                where: { id },
                data: { status: client_1.SupplierStatus.INACTIVE },
            });
            return { success: true, archived: true, message: 'Supplier has purchase orders — archived instead of deleted.' };
        }
        await this.prisma.supplier.delete({ where: { id } });
        return { success: true, archived: false };
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map