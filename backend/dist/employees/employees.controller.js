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
exports.EmployeesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const employees_service_1 = require("./employees.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const create_employee_dto_1 = require("./dto/create-employee.dto");
const update_employee_dto_1 = require("./dto/update-employee.dto");
let EmployeesController = class EmployeesController {
    constructor(employeesService) {
        this.employeesService = employeesService;
    }
    async findAll(orgId) {
        return this.employeesService.findAll(orgId);
    }
    async findOne(orgId, id) {
        return this.employeesService.findOne(orgId, id);
    }
    async create(orgId, createEmployeeDto) {
        return this.employeesService.create(orgId, createEmployeeDto);
    }
    async update(orgId, id, updateEmployeeDto) {
        return this.employeesService.update(orgId, id, updateEmployeeDto);
    }
    async remove(orgId, id) {
        return this.employeesService.remove(orgId, id);
    }
};
exports.EmployeesController = EmployeesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all employees for organization' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an employee by ID' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new employee' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an employee' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_employee_dto_1.UpdateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an employee' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "remove", null);
exports.EmployeesController = EmployeesController = __decorate([
    (0, swagger_1.ApiTags)('Employees'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('employees'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService])
], EmployeesController);
//# sourceMappingURL=employees.controller.js.map