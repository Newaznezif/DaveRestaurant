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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MenuService = class MenuService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCategories(orgId) {
        return this.prisma.menuCategory.findMany({
            where: { organizationId: orgId },
            orderBy: { sortOrder: 'asc' },
            include: {
                products: {
                    where: { isActive: true },
                    include: { variants: true, addonGroups: { include: { items: true } } },
                },
                children: true,
            },
        });
    }
    async getCategory(orgId, id) {
        const category = await this.prisma.menuCategory.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return category;
    }
    async createCategory(orgId, dto) {
        const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
        return this.prisma.menuCategory.create({
            data: { ...dto, organizationId: orgId, slug },
        });
    }
    async updateCategory(orgId, id, dto) {
        await this.getCategory(orgId, id);
        return this.prisma.menuCategory.update({
            where: { id },
            data: dto,
        });
    }
    async deleteCategory(orgId, id) {
        await this.getCategory(orgId, id);
        const productCount = await this.prisma.product.count({
            where: { categoryId: id },
        });
        if (productCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete category — it still contains ${productCount} product(s). Move or delete them first.`);
        }
        await this.prisma.menuCategory.delete({ where: { id } });
        return { success: true };
    }
    mapProduct(product) {
        if (!product)
            return null;
        return {
            ...product,
            cost: product.costPrice,
        };
    }
    async getProducts(orgId, categoryId) {
        const products = await this.prisma.product.findMany({
            where: { organizationId: orgId, ...(categoryId && { categoryId }) },
            include: { variants: true, addonGroups: { include: { items: true } }, category: true },
            orderBy: { name: 'asc' }
        });
        return products.map(p => this.mapProduct(p));
    }
    async getProduct(orgId, id) {
        const product = await this.prisma.product.findFirst({
            where: { id, organizationId: orgId },
            include: { category: true }
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return this.mapProduct(product);
    }
    async createProduct(orgId, dto) {
        const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
        const { cost, ...rest } = dto;
        const product = await this.prisma.product.create({
            data: { ...rest, costPrice: cost, organizationId: orgId, slug },
        });
        return this.mapProduct(product);
    }
    async updateProduct(orgId, id, dto) {
        await this.getProduct(orgId, id);
        const { cost, ...rest } = dto;
        const product = await this.prisma.product.update({
            where: { id },
            data: {
                ...rest,
                ...(cost !== undefined && { costPrice: cost }),
            },
        });
        return this.mapProduct(product);
    }
    async deleteProduct(orgId, id) {
        await this.getProduct(orgId, id);
        await this.prisma.product.delete({ where: { id } });
        return { success: true };
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map