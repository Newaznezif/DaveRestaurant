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
exports.PermissionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const require_permission_decorator_1 = require("../decorators/require-permission.decorator");
const prisma_service_1 = require("../../prisma/prisma.service");
let PermissionGuard = class PermissionGuard {
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(require_permission_decorator_1.PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (user.role === 'SUPER_ADMIN') {
            return true;
        }
        const userPermissions = await this.getUserPermissions(user.role);
        const hasAllPermissions = requiredPermissions.every((permission) => userPermissions.includes(permission));
        if (!hasAllPermissions) {
            throw new common_1.ForbiddenException(`Requires permissions: ${requiredPermissions.join(', ')}`);
        }
        return true;
    }
    async getUserPermissions(role) {
        const rolePermissions = await this.prisma.rolePermission.findMany({
            where: {
                role: role,
                isActive: true,
            },
            include: {
                permission: true,
            },
        });
        return rolePermissions.map((rp) => rp.permission.name);
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], PermissionGuard);
//# sourceMappingURL=permission.guard.js.map