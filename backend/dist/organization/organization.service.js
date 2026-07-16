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
var OrganizationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrganizationService = OrganizationService_1 = class OrganizationService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(OrganizationService_1.name);
    }
    async create(data) {
        return this.prisma.organization.create({ data });
    }
    async findAll() {
        return this.prisma.organization.findMany({
            include: { _count: { select: { branches: true, users: true } } },
        });
    }
    async findById(id) {
        return this.prisma.organization.findUnique({
            where: { id },
            include: { branches: true, subscription: true },
        });
    }
    async update(id, data) {
        return this.prisma.organization.update({ where: { id }, data });
    }
    async findBySlug(slug) {
        return this.prisma.organization.findUnique({
            where: { slug },
            include: { branches: { where: { isActive: true } } },
        });
    }
    async delete(id) {
        return this.prisma.organization.delete({
            where: { id },
        });
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = OrganizationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrganizationService);
//# sourceMappingURL=organization.service.js.map