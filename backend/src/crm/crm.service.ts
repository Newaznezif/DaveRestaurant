import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { LoyaltyTier } from '@prisma/client';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  async findAll(orgId: string) {
    return this.prisma.customer.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(orgId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async create(orgId: string, dto: CreateCustomerDto) {
    let loyaltyTierEnum: LoyaltyTier = LoyaltyTier.BRONZE;
    if (dto.loyaltyTier && Object.values(LoyaltyTier).includes(dto.loyaltyTier as LoyaltyTier)) {
      loyaltyTierEnum = dto.loyaltyTier as LoyaltyTier;
    }

    return this.prisma.customer.create({
      data: {
        organizationId: orgId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        loyaltyPoints: dto.loyaltyPoints || 0,
        loyaltyTier: loyaltyTierEnum,
      },
    });
  }

  async update(orgId: string, id: string, dto: UpdateCustomerDto) {
    await this.findOne(orgId, id);

    const data: any = { ...dto };
    if (dto.loyaltyTier && Object.values(LoyaltyTier).includes(dto.loyaltyTier as LoyaltyTier)) {
      data.loyaltyTier = dto.loyaltyTier as LoyaltyTier;
    }

    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async remove(orgId: string, id: string) {
    await this.findOne(orgId, id);
    await this.prisma.customer.delete({
      where: { id },
    });
    return { success: true };
  }

  async updateLoyalty(orgId: string, id: string, points: number) {
    await this.findOne(orgId, id);
    return this.prisma.customer.update({
      where: { id },
      data: { loyaltyPoints: points },
    });
  }
}