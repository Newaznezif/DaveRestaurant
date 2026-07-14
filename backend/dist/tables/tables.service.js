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
exports.TablesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TablesService = class TablesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.restaurantTable.create({ data });
    }
    async findByBranch(branchId) {
        return this.prisma.restaurantTable.findMany({
            where: { branchId, isActive: true },
            include: {
                floor: true,
                orders: {
                    where: { status: { notIn: ['COMPLETED', 'CANCELLED', 'REFUNDED'] } },
                    take: 1,
                },
            },
        });
    }
    async update(id, data) {
        return this.prisma.restaurantTable.update({ where: { id }, data });
    }
    async updateStatus(id, status) {
        return this.prisma.restaurantTable.update({
            where: { id },
            data: { status: status },
        });
    }
    async createFloor(data) {
        return this.prisma.floorPlan.create({ data });
    }
    async getFloors(branchId) {
        return this.prisma.floorPlan.findMany({
            where: { branchId, isActive: true },
            include: { tables: true },
        });
    }
    async updateFloor(id, data) {
        return this.prisma.floorPlan.update({ where: { id }, data });
    }
};
exports.TablesService = TablesService;
exports.TablesService = TablesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TablesService);
//# sourceMappingURL=tables.service.js.map