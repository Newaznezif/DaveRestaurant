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
exports.ReservationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reservations_service_1 = require("./reservations.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const create_reservation_dto_1 = require("./dto/create-reservation.dto");
const update_reservation_dto_1 = require("./dto/update-reservation.dto");
let ReservationsController = class ReservationsController {
    constructor(svc) {
        this.svc = svc;
    }
    async findAll(orgId, branchId, status, date) {
        return this.svc.findAll(orgId, { branchId, status, date });
    }
    async findOne(orgId, id) {
        return this.svc.findOne(orgId, id);
    }
    async create(orgId, dto) {
        return this.svc.create(orgId, dto);
    }
    async update(orgId, id, dto) {
        return this.svc.update(orgId, id, dto);
    }
    async remove(orgId, id) {
        return this.svc.remove(orgId, id);
    }
    async updateStatus(orgId, id, status) {
        return this.svc.updateStatus(orgId, id, status);
    }
    async getByDate(orgId, branchId, date) {
        return this.svc.getByDate(orgId, branchId, date);
    }
};
exports.ReservationsController = ReservationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all reservations' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Query)('branchId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reservation by ID' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a reservation' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_reservation_dto_1.CreateReservationDto]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a reservation' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_reservation_dto_1.UpdateReservationDto]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a reservation' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update reservation status' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('by-date/:branchId/:date'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reservations by branch and date' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('organizationId')),
    __param(1, (0, common_1.Param)('branchId')),
    __param(2, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReservationsController.prototype, "getByDate", null);
exports.ReservationsController = ReservationsController = __decorate([
    (0, swagger_1.ApiTags)('Reservations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('reservations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [reservations_service_1.ReservationsService])
], ReservationsController);
//# sourceMappingURL=reservations.controller.js.map