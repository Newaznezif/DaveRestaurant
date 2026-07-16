import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(orgId: string, filters?: { branchId?: string; status?: string; date?: string }) {
    const where: any = { organizationId: orgId };
    if (filters?.branchId) where.branchId = filters.branchId;
    if (filters?.status) where.status = filters.status;
    if (filters?.date) where.date = new Date(filters.date);

    return this.prisma.reservation.findMany({
      where,
      include: { table: true, customer: true },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });
  }

  async findOne(orgId: string, id: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id, organizationId: orgId },
      include: { table: true, customer: true },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    return reservation;
  }

  async create(orgId: string, dto: CreateReservationDto) {
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

  async update(orgId: string, id: string, dto: UpdateReservationDto) {
    await this.findOne(orgId, id);
    const { date, status, ...rest } = dto as any;
    const data: any = { ...rest };
    if (date) data.date = new Date(date);
    if (status && Object.values(ReservationStatus).includes(status as ReservationStatus)) {
      data.status = status as ReservationStatus;
    }
    return this.prisma.reservation.update({
      where: { id },
      data,
      include: { table: true },
    });
  }

  async remove(orgId: string, id: string) {
    await this.findOne(orgId, id);
    await this.prisma.reservation.delete({ where: { id } });
    return { success: true };
  }

  async updateStatus(orgId: string, id: string, status: string) {
    await this.findOne(orgId, id);
    if (!Object.values(ReservationStatus).includes(status as ReservationStatus)) {
      throw new NotFoundException(`Invalid status: ${status}`);
    }
    return this.prisma.reservation.update({
      where: { id },
      data: { status: status as ReservationStatus },
    });
  }

  async getByDate(orgId: string, branchId: string, date: string) {
    return this.prisma.reservation.findMany({
      where: { organizationId: orgId, branchId, date: new Date(date) },
      include: { table: true },
      orderBy: { time: 'asc' },
    });
  }
}