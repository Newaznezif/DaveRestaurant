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
exports.TenantGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../prisma/prisma.service");
let TenantGuard = class TenantGuard {
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('Authentication required');
        }
        if (user.role === 'SUPER_ADMIN') {
            request.tenant = {
                organizationId: user.organizationId,
                branchId: user.branchId,
            };
            return true;
        }
        const organizationId = request.headers['x-organization-id'] || request.body?.organizationId || user.organizationId;
        const branchId = request.headers['x-branch-id'] || request.body?.branchId || user.branchId;
        if (!organizationId) {
            throw new common_1.ForbiddenException('Organization context required');
        }
        if (user.organizationId && user.organizationId !== organizationId) {
            throw new common_1.ForbiddenException('Cross-tenant access denied');
        }
        if (branchId) {
            const branch = await this.prisma.branch.findFirst({
                where: {
                    id: branchId,
                    organizationId,
                },
            });
            if (!branch) {
                throw new common_1.ForbiddenException('Branch does not belong to organization');
            }
            if (user.branchId && user.branchId !== branchId) {
                throw new common_1.ForbiddenException('Cross-branch access denied');
            }
        }
        const organization = await this.prisma.organization.findUnique({
            where: { id: organizationId },
            select: { id: true, isActive: true },
        });
        if (!organization) {
            throw new common_1.ForbiddenException('Organization not found');
        }
        if (!organization.isActive) {
            throw new common_1.ForbiddenException('Organization is deactivated');
        }
        request.tenant = {
            organizationId,
            branchId,
        };
        return true;
    }
};
exports.TenantGuard = TenantGuard;
exports.TenantGuard = TenantGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], TenantGuard);
//# sourceMappingURL=tenant.guard.js.map