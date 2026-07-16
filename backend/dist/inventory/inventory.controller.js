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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inventory_service_1 = require("./inventory.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const create_inventory_item_dto_1 = require("./dto/create-inventory-item.dto");
const update_inventory_item_dto_1 = require("./dto/update-inventory-item.dto");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async findAll(orgId, branchId) {
        return this.inventoryService.findAll(orgId, branchId);
    }
    async findLowStock(orgId, branchId) {
        return this.inventoryService.findLowStock(orgId, branchId);
    }
    async findOne(orgId, id) {
        return this.inventoryService.findOne(orgId, id);
    }
    async create(orgId, dto) {
        return this.inventoryService.create(orgId, dto);
    }
    async update(orgId, id, dto) {
        return this.inventoryService.update(orgId, id, dto);
    }
    async remove(orgId, id) {
        return this.inventoryService.remove(orgId, id);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all inventory items' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.RESTAURANT_OWNER, client_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get low-stock items' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findLowStock", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory item by ID' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create inventory item' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_inventory_item_dto_1.CreateInventoryItemDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update inventory item' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_inventory_item_dto_1.UpdateInventoryItemDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete inventory item' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "remove", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('Inventory'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('inventory'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map