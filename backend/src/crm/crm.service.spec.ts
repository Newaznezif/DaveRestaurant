import { Test, TestingModule } from '@nestjs/testing';
import { CrmService } from './crm.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { LoyaltyTier } from '@prisma/client';

describe('CrmService', () => {
  let service: CrmService;
  let prisma: PrismaService;

  const mockCustomer = {
    id: 'cust1',
    organizationId: 'org1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    phone: '1234567890',
    loyaltyPoints: 100,
    loyaltyTier: LoyaltyTier.BRONZE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService: any = {
    customer: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrmService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CrmService>(CrmService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all customers for an organization', async () => {
      mockPrismaService.customer.findMany.mockResolvedValue([mockCustomer]);

      const result = await service.findAll('org1');

      expect(result).toEqual([mockCustomer]);
      expect(prisma.customer.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org1' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single customer if owned by org', async () => {
      mockPrismaService.customer.findFirst.mockResolvedValue(mockCustomer);

      const result = await service.findOne('org1', 'cust1');

      expect(result).toEqual(mockCustomer);
      expect(prisma.customer.findFirst).toHaveBeenCalledWith({
        where: { id: 'cust1', organizationId: 'org1' },
      });
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockPrismaService.customer.findFirst.mockResolvedValue(null);

      await expect(service.findOne('org1', 'cust2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const createDto = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      phone: '1234567890',
      loyaltyPoints: 100,
      loyaltyTier: 'SILVER',
    };

    it('should create a customer successfully', async () => {
      mockPrismaService.customer.create.mockResolvedValue({
        ...mockCustomer,
        loyaltyTier: LoyaltyTier.SILVER,
      });

      const result = await service.create('org1', createDto);

      expect(result.loyaltyTier).toBe(LoyaltyTier.SILVER);
      expect(prisma.customer.create).toHaveBeenCalledWith({
        data: {
          organizationId: 'org1',
          firstName: 'Alice',
          lastName: 'Smith',
          email: 'alice@example.com',
          phone: '1234567890',
          loyaltyPoints: 100,
          loyaltyTier: LoyaltyTier.SILVER,
        },
      });
    });

    it('should default to BRONZE if invalid loyalty tier is passed', async () => {
      mockPrismaService.customer.create.mockResolvedValue({
        ...mockCustomer,
        loyaltyTier: LoyaltyTier.BRONZE,
      });

      const result = await service.create('org1', {
        ...createDto,
        loyaltyTier: 'INVALID_TIER',
      });

      expect(result.loyaltyTier).toBe(LoyaltyTier.BRONZE);
      expect(prisma.customer.create).toHaveBeenCalledWith({
        data: {
          organizationId: 'org1',
          firstName: 'Alice',
          lastName: 'Smith',
          email: 'alice@example.com',
          phone: '1234567890',
          loyaltyPoints: 100,
          loyaltyTier: LoyaltyTier.BRONZE,
        },
      });
    });
  });

  describe('update', () => {
    const updateDto = {
      firstName: 'Alisha',
      loyaltyTier: 'GOLD',
    };

    it('should update customer successfully', async () => {
      mockPrismaService.customer.findFirst.mockResolvedValue(mockCustomer);
      mockPrismaService.customer.update.mockResolvedValue({
        ...mockCustomer,
        firstName: 'Alisha',
        loyaltyTier: LoyaltyTier.GOLD,
      });

      const result = await service.update('org1', 'cust1', updateDto);

      expect(result.firstName).toBe('Alisha');
      expect(result.loyaltyTier).toBe(LoyaltyTier.GOLD);
      expect(prisma.customer.update).toHaveBeenCalledWith({
        where: { id: 'cust1' },
        data: {
          firstName: 'Alisha',
          loyaltyTier: LoyaltyTier.GOLD,
        },
      });
    });
  });

  describe('remove', () => {
    it('should delete customer successfully', async () => {
      mockPrismaService.customer.findFirst.mockResolvedValue(mockCustomer);
      mockPrismaService.customer.delete.mockResolvedValue(mockCustomer);

      const result = await service.remove('org1', 'cust1');

      expect(result).toEqual({ success: true });
      expect(prisma.customer.delete).toHaveBeenCalledWith({
        where: { id: 'cust1' },
      });
    });
  });

  describe('updateLoyalty', () => {
    it('should update loyalty points successfully', async () => {
      mockPrismaService.customer.findFirst.mockResolvedValue(mockCustomer);
      mockPrismaService.customer.update.mockResolvedValue({
        ...mockCustomer,
        loyaltyPoints: 500,
      });

      const result = await service.updateLoyalty('org1', 'cust1', 500);

      expect(result.loyaltyPoints).toBe(500);
      expect(prisma.customer.update).toHaveBeenCalledWith({
        where: { id: 'cust1' },
        data: { loyaltyPoints: 500 },
      });
    });
  });
});
