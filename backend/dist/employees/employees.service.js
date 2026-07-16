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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const password_service_1 = require("../auth/services/password.service");
const client_1 = require("@prisma/client");
let EmployeesService = class EmployeesService {
    constructor(prisma, passwordService) {
        this.prisma = prisma;
        this.passwordService = passwordService;
    }
    async findAll(orgId) {
        return this.prisma.employee.findMany({
            where: { organizationId: orgId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                        isActive: true,
                    }
                },
                department: true,
                branch: true,
            },
        });
    }
    async findOne(orgId, id) {
        const employee = await this.prisma.employee.findFirst({
            where: { id, organizationId: orgId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                        isActive: true,
                    }
                },
                department: true,
                branch: true,
            },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        return employee;
    }
    async create(orgId, dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User with this email already exists');
        }
        const passwordHash = await this.passwordService.hashPassword('password123');
        const employeeId = 'EMP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        let roleEnum = client_1.UserRole.WAITER;
        if (dto.role && Object.values(client_1.UserRole).includes(dto.role)) {
            roleEnum = dto.role;
        }
        const result = await this.prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email: dto.email,
                    passwordHash,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    role: roleEnum,
                    organizationId: orgId,
                    branchId: dto.branchId,
                    isVerified: true,
                },
            });
            const employee = await prisma.employee.create({
                data: {
                    userId: user.id,
                    organizationId: orgId,
                    branchId: dto.branchId,
                    departmentId: dto.departmentId,
                    employeeId,
                    position: dto.position,
                    salary: dto.salary,
                    hourlyRate: dto.hourlyRate,
                    payType: dto.payType || 'SALARY',
                    employmentType: dto.employmentType || 'FULL_TIME',
                    isActive: true,
                },
                include: {
                    user: {
                        select: { id: true, firstName: true, lastName: true, email: true, role: true }
                    }
                }
            });
            return employee;
        });
        return result;
    }
    async update(orgId, id, dto) {
        const employee = await this.findOne(orgId, id);
        let roleEnum = undefined;
        if (dto.role && Object.values(client_1.UserRole).includes(dto.role)) {
            roleEnum = dto.role;
        }
        await this.prisma.$transaction(async (prisma) => {
            if (dto.firstName || dto.lastName || dto.email || roleEnum || dto.isActive !== undefined || dto.branchId) {
                await prisma.user.update({
                    where: { id: employee.userId },
                    data: {
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                        email: dto.email,
                        role: roleEnum,
                        isActive: dto.isActive,
                        branchId: dto.branchId,
                    },
                });
            }
            await prisma.employee.update({
                where: { id },
                data: {
                    branchId: dto.branchId,
                    departmentId: dto.departmentId,
                    position: dto.position,
                    salary: dto.salary,
                    hourlyRate: dto.hourlyRate,
                    payType: dto.payType,
                    employmentType: dto.employmentType,
                    isActive: dto.isActive,
                },
            });
        });
        return this.findOne(orgId, id);
    }
    async remove(orgId, id) {
        const employee = await this.findOne(orgId, id);
        await this.prisma.user.delete({
            where: { id: employee.userId },
        });
        return { success: true };
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        password_service_1.PasswordService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map