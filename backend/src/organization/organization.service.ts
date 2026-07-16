import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.organization.create({ data });
  }

  async findAll() {
    return this.prisma.organization.findMany({
      include: { _count: { select: { branches: true, users: true } } },
    });
  }

  async findById(id: string) {
    return this.prisma.organization.findUnique({
      where: { id },
      include: { branches: true, subscription: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.organization.update({ where: { id }, data });
  }

  async findBySlug(slug: string) {
    return this.prisma.organization.findUnique({
      where: { slug },
      include: { branches: { where: { isActive: true } } },
    });
  }

  async delete(id: string) {
    return this.prisma.organization.delete({
      where: { id },
    });
  }
}