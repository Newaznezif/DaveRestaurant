import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { ReservationStatus } from '@prisma/client';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let prisma: PrismaService;

  const mockReservation = {
    id: 'res1',
    organizationId: 'org1',
    branchId: 'branch1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1234567890',
    guests: 4,
    date: new Date('2026-08-01'),
    time: '19:00',
    duration: 120,
    status: ReservationStatus.PENDING,
    tableId: null,
    customerId: null,
    specialRequests: null,
    occasion: null,
    source: 'website',
    notes: null,
    reminderSent: false,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService: any = {
    reservation: {
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
        ReservationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── findAll ─────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return all reservations for org', async () => {
      mockPrismaService.reservation.findMany.mockResolvedValue([mockReservation]);

      const result = await service.findAll('org1');

      expect(result).toEqual([mockReservation]);
      expect(prisma.reservation.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org1' },
        include: { table: true, customer: true },
        orderBy: [{ date: 'asc' }, { time: 'asc' }],
      });
    });

    it('should filter by branchId if provided', async () => {
      mockPrismaService.reservation.findMany.mockResolvedValue([mockReservation]);

      await service.findAll('org1', { branchId: 'branch1' });

      expect(prisma.reservation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ branchId: 'branch1' }),
        }),
      );
    });

    it('should filter by status if provided', async () => {
      mockPrismaService.reservation.findMany.mockResolvedValue([]);

      await service.findAll('org1', { status: 'CONFIRMED' });

      expect(prisma.reservation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'CONFIRMED' }),
        }),
      );
    });
  });

  // ─── findOne ─────────────────────────────────────────────────────────────
  describe('findOne', () => {
    it('should return a reservation if found', async () => {
      mockPrismaService.reservation.findFirst.mockResolvedValue(mockReservation);

      const result = await service.findOne('org1', 'res1');

      expect(result).toEqual(mockReservation);
      expect(prisma.reservation.findFirst).toHaveBeenCalledWith({
        where: { id: 'res1', organizationId: 'org1' },
        include: { table: true, customer: true },
      });
    });

    it('should throw NotFoundException if reservation not found', async () => {
      mockPrismaService.reservation.findFirst.mockResolvedValue(null);

      await expect(service.findOne('org1', 'nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── create ──────────────────────────────────────────────────────────────
  describe('create', () => {
    it('should create a reservation with default duration and source', async () => {
      mockPrismaService.reservation.create.mockResolvedValue(mockReservation);

      const dto = {
        branchId: 'branch1',
        customerName: 'John Doe',
        guests: 4,
        date: '2026-08-01',
        time: '19:00',
      };

      const result = await service.create('org1', dto as any);

      expect(result).toEqual(mockReservation);
      expect(prisma.reservation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            organizationId: 'org1',
            customerName: 'John Doe',
            guests: 4,
            duration: 120,
            source: 'website',
          }),
        }),
      );
    });
  });

  // ─── update ──────────────────────────────────────────────────────────────
  describe('update', () => {
    it('should update a reservation after verifying ownership', async () => {
      mockPrismaService.reservation.findFirst.mockResolvedValue(mockReservation);
      mockPrismaService.reservation.update.mockResolvedValue({
        ...mockReservation,
        guests: 6,
      });

      const result = await service.update('org1', 'res1', { guests: 6 } as any);

      expect(result.guests).toBe(6);
      expect(prisma.reservation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'res1' },
          data: expect.objectContaining({ guests: 6 }),
        }),
      );
    });

    it('should throw NotFoundException if reservation not found during update', async () => {
      mockPrismaService.reservation.findFirst.mockResolvedValue(null);

      await expect(service.update('org1', 'nonexistent', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── updateStatus ────────────────────────────────────────────────────────
  describe('updateStatus', () => {
    it('should update status to CONFIRMED', async () => {
      mockPrismaService.reservation.findFirst.mockResolvedValue(mockReservation);
      mockPrismaService.reservation.update.mockResolvedValue({
        ...mockReservation,
        status: ReservationStatus.CONFIRMED,
      });

      const result = await service.updateStatus('org1', 'res1', 'CONFIRMED');

      expect(result.status).toBe(ReservationStatus.CONFIRMED);
      expect(prisma.reservation.update).toHaveBeenCalledWith({
        where: { id: 'res1' },
        data: { status: ReservationStatus.CONFIRMED },
      });
    });

    it('should throw NotFoundException for invalid status', async () => {
      mockPrismaService.reservation.findFirst.mockResolvedValue(mockReservation);

      await expect(service.updateStatus('org1', 'res1', 'INVALID_STATUS')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── remove ──────────────────────────────────────────────────────────────
  describe('remove', () => {
    it('should delete reservation if owned by org', async () => {
      mockPrismaService.reservation.findFirst.mockResolvedValue(mockReservation);
      mockPrismaService.reservation.delete.mockResolvedValue(mockReservation);

      const result = await service.remove('org1', 'res1');

      expect(result).toEqual({ success: true });
      expect(prisma.reservation.delete).toHaveBeenCalledWith({ where: { id: 'res1' } });
    });

    it('should throw NotFoundException if reservation not found', async () => {
      mockPrismaService.reservation.findFirst.mockResolvedValue(null);

      await expect(service.remove('org1', 'nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
