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
var InventoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryService = InventoryService_1 = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(InventoryService_1.name);
    }
    async findAll(organizationId, branchId) {
        return this.prisma.inventoryItem.findMany({
            where: {
                organizationId,
                ...(branchId ? { branchId } : {}),
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(orgId, id) {
        const item = await this.prisma.inventoryItem.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!item)
            throw new common_1.NotFoundException('Inventory item not found');
        return item;
    }
    async create(orgId, dto) {
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
    async update(orgId, id, dto) {
        await this.findOne(orgId, id);
        const { expiryDate, ...rest } = dto;
        const data = { ...rest };
        if (expiryDate)
            data.expiryDate = new Date(expiryDate);
        return this.prisma.inventoryItem.update({ where: { id }, data });
    }
    async remove(orgId, id) {
        await this.findOne(orgId, id);
        await this.prisma.inventoryItem.delete({ where: { id } });
        return { success: true };
    }
    async findLowStock(organizationId, branchId) {
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
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = InventoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map