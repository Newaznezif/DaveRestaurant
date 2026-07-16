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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const menu_service_1 = require("./menu.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
let MenuController = class MenuController {
    constructor(menuService) {
        this.menuService = menuService;
    }
    async getCategories(orgIdQuery, currentOrgId) {
        const orgId = currentOrgId || orgIdQuery;
        return this.menuService.getCategories(orgId);
    }
    async getCategory(orgId, id) {
        return this.menuService.getCategory(orgId, id);
    }
    async createCategory(orgId, dto) {
        return this.menuService.createCategory(orgId, dto);
    }
    async updateCategory(orgId, id, dto) {
        return this.menuService.updateCategory(orgId, id, dto);
    }
    async deleteCategory(orgId, id) {
        return this.menuService.deleteCategory(orgId, id);
    }
    async getProducts(orgIdQuery, categoryId, currentOrgId) {
        const orgId = currentOrgId || orgIdQuery;
        return this.menuService.getProducts(orgId, categoryId);
    }
    async getProduct(orgId, id) {
        return this.menuService.getProduct(orgId, id);
    }
    async createProduct(orgId, dto) {
        return this.menuService.createProduct(orgId, dto);
    }
    async updateProduct(orgId, id, dto) {
        return this.menuService.updateProduct(orgId, id, dto);
    }
    async deleteProduct(orgId, id) {
        return this.menuService.deleteProduct(orgId, id);
    }
};
exports.MenuController = MenuController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories' }),
    __param(0, (0, common_1.Query)('organizationId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category by ID' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "getCategory", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.RESTAURANT_OWNER, client_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new category' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.RESTAURANT_OWNER, client_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Update a category' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.RESTAURANT_OWNER, client_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a category' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "deleteCategory", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products' }),
    __param(0, (0, common_1.Query)('organizationId')),
    __param(1, (0, common_1.Query)('categoryId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product by ID' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Post)('products'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.RESTAURANT_OWNER, client_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Patch)('products/:id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.RESTAURANT_OWNER, client_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Update a product' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('products/:id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.RESTAURANT_OWNER, client_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a product' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "deleteProduct", null);
exports.MenuController = MenuController = __decorate([
    (0, swagger_1.ApiTags)('Menu'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('menu'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [menu_service_1.MenuService])
], MenuController);
//# sourceMappingURL=menu.controller.js.map