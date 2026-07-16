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
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReservationsService = class ReservationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(orgId, filters) {
        const where = { organizationId: orgId };
        if (filters?.branchId)
            where.branchId = filters.branchId;
        if (filters?.status)
            where.status = filters.status;
        if (filters?.date)
            where.date = new Date(filters.date);
        return this.prisma.reservation.findMany({
            where,
            include: { table: true, customer: true },
            orderBy: [{ date: 'asc' }, { time: 'asc' }],
        });
    }
    async findOne(orgId, id) {
        const reservation = await this.prisma.reservation.findFirst({
            where: { id, organizationId: orgId },
            include: { table: true, customer: true },
        });
        if (!reservation)
            throw new common_1.NotFoundException('Reservation not found');
        return reservation;
    }
    async create(orgId, dto) {
        return this.prisma.reservation.create({
            data: {
                organizationId: orgId,
                branchId: dto.branchId,
                customerName: dto.customerName,
                customerEmail: dto.customerEmail,
                customerPhone: dto.customerPhone,
                guests: dto.guests,
                date: new Date(dto.date),
                time: dto.time,
                duration: dto.duration ?? 120,
                tableId: dto.tableId,
                customerId: dto.customerId,
                specialRequests: dto.specialRequests,
                occasion: dto.occasion,
                source: dto.source ?? 'website',
                notes: dto.notes,
            },
            include: { table: true },
        });
    }
    async update(orgId, id, dto) {
        await this.findOne(orgId, id);
        const { date, status, ...rest } = dto;
        const data = { ...rest };
        if (date)
            data.date = new Date(date);
        if (status && Object.values(client_1.ReservationStatus).includes(status)) {
            data.status = status;
        }
        return this.prisma.reservation.update({
            where: { id },
            data,
            include: { table: true },
        });
    }
    async remove(orgId, id) {
        await this.findOne(orgId, id);
        await this.prisma.reservation.delete({ where: { id } });
        return { success: true };
    }
    async updateStatus(orgId, id, status) {
        await this.findOne(orgId, id);
        if (!Object.values(client_1.ReservationStatus).includes(status)) {
            throw new common_1.NotFoundException(`Invalid status: ${status}`);
        }
        return this.prisma.reservation.update({
            where: { id },
            data: { status: status },
        });
    }
    async getByDate(orgId, branchId, date) {
        return this.prisma.reservation.findMany({
            where: { organizationId: orgId, branchId, date: new Date(date) },
            include: { table: true },
            orderBy: { time: 'asc' },
        });
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map