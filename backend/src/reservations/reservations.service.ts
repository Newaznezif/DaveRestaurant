import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.reservation.create({ data, include: { table: true } });
  }

  async findAll(orgId: string, query: any = {}) {
    return this.prisma.paginate('reservation', { organizationId: orgId, ...query }, {
      include: { table: true, customer: true },
      limit: 20,
    });
  }

  async findById(id: string) {
    return this.prisma.reservation.findUnique({
      where: { id },
      include: { table: true, customer: true },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.reservation.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async getByDate(branchId: string, date: string) {
    return this.prisma.reservation.findMany({
      where: { branchId, date: new Date(date) },
      include: { table: true },
      orderBy: { time: 'asc' },
    });
  }
}