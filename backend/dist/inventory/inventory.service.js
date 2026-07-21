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
const client_1 = require("@prisma/client");
const STOCK_IN_TYPES = [
    client_1.StockMovementType.PURCHASE,
    client_1.StockMovementType.TRANSFER_IN,
    client_1.StockMovementType.RETURN,
];
const STOCK_OUT_TYPES = [
    client_1.StockMovementType.SALE,
    client_1.StockMovementType.TRANSFER_OUT,
    client_1.StockMovementType.WASTE,
    client_1.StockMovementType.EXPIRY,
];
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
                isActive: true,
            },
            include: {
                branch: { select: { id: true, name: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(orgId, id) {
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
        await this.prisma.inventoryItem.update({
            where: { id },
            data: { isActive: false },
        });
        return { success: true };
    }
    async recordMovement(orgId, itemId, dto, userId) {
        const item = await this.findOne(orgId, itemId);
        return this.prisma.$transaction(async (tx) => {
            const current = item.quantity;
            let after;
            let quantity = dto.quantity;
            if (dto.type === client_1.StockMovementType.ADJUSTMENT) {
                after = quantity;
                quantity = Math.abs(after - current);
            }
            else if (STOCK_IN_TYPES.includes(dto.type)) {
                after = current + quantity;
            }
            else if (STOCK_OUT_TYPES.includes(dto.type)) {
                if (current < quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock. Available: ${current} ${item.unit}`);
                }
                after = current - quantity;
            }
            else {
                throw new common_1.BadRequestException(`Unknown movement type: ${dto.type}`);
            }
            await tx.inventoryItem.update({
                where: { id: itemId },
                data: { quantity: after },
            });
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
    async getMovements(orgId, itemId) {
        await this.findOne(orgId, itemId);
        return this.prisma.stockMovement.findMany({
            where: { inventoryId: itemId },
            orderBy: { createdAt: 'desc' },
        });
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