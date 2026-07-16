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
exports.CrmService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CrmService = class CrmService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(orgId) {
        return this.prisma.customer.findMany({
            where: { organizationId: orgId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(orgId, id) {
        const customer = await this.prisma.customer.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return customer;
    }
    async create(orgId, dto) {
        let loyaltyTierEnum = client_1.LoyaltyTier.BRONZE;
        if (dto.loyaltyTier && Object.values(client_1.LoyaltyTier).includes(dto.loyaltyTier)) {
            loyaltyTierEnum = dto.loyaltyTier;
        }
        return this.prisma.customer.create({
            data: {
                organizationId: orgId,
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                phone: dto.phone,
                loyaltyPoints: dto.loyaltyPoints || 0,
                loyaltyTier: loyaltyTierEnum,
            },
        });
    }
    async update(orgId, id, dto) {
        await this.findOne(orgId, id);
        const data = { ...dto };
        if (dto.loyaltyTier && Object.values(client_1.LoyaltyTier).includes(dto.loyaltyTier)) {
            data.loyaltyTier = dto.loyaltyTier;
        }
        return this.prisma.customer.update({
            where: { id },
            data,
        });
    }
    async remove(orgId, id) {
        await this.findOne(orgId, id);
        await this.prisma.customer.delete({
            where: { id },
        });
        return { success: true };
    }
    async updateLoyalty(orgId, id, points) {
        await this.findOne(orgId, id);
        return this.prisma.customer.update({
            where: { id },
            data: { loyaltyPoints: points },
        });
    }
};
exports.CrmService = CrmService;
exports.CrmService = CrmService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CrmService);
//# sourceMappingURL=crm.service.js.map