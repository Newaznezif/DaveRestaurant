import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { NotFoundException } from '@nestjs/common';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  const mockReservation = {
    id: 'res1',
    organizationId: 'org1',
    branchId: 'branch1',
    customerName: 'John Doe',
    guests: 4,
    date: new Date('2026-08-01'),
    time: '19:00',
    status: 'PENDING',
  };

  const mockService = {
    findAll: jest.fn().mockResolvedValue([mockReservation]),
    findOne: jest.fn().mockResolvedValue(mockReservation),
    create: jest.fn().mockResolvedValue(mockReservation),
    update: jest.fn().mockResolvedValue(mockReservation),
    remove: jest.fn().mockResolvedValue({ success: true }),
    updateStatus: jest.fn().mockResolvedValue({ ...mockReservation, status: 'CONFIRMED' }),
    getByDate: jest.fn().mockResolvedValue([mockReservation]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        { provide: ReservationsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all reservations', async () => {
      const result = await controller.findAll('org1');
      expect(result).toEqual([mockReservation]);
      expect(service.findAll).toHaveBeenCalledWith('org1', {
        branchId: undefined,
        status: undefined,
        date: undefined,
      });
    });

    it('should pass branchId and status filters', async () => {
      const result = await controller.findAll('org1', 'branch1', 'PENDING');
      expect(service.findAll).toHaveBeenCalledWith('org1', {
        branchId: 'branch1',
        status: 'PENDING',
        date: undefined,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single reservation', async () => {
      const result = await controller.findOne('org1', 'res1');
      expect(result).toEqual(mockReservation);
      expect(service.findOne).toHaveBeenCalledWith('org1', 'res1');
    });
  });

  describe('create', () => {
    it('should create a reservation', async () => {
      const dto: CreateReservationDto = {
        branchId: 'branch1',
        customerName: 'John Doe',
        guests: 4,
        date: '2026-08-01',
        time: '19:00',
      };
      const result = await controller.create('org1', dto);
      expect(result).toEqual(mockReservation);
      expect(service.create).toHaveBeenCalledWith('org1', dto);
    });
  });

  describe('update', () => {
    it('should update a reservation', async () => {
      const dto: UpdateReservationDto = { guests: 6 };
      const result = await controller.update('org1', 'res1', dto);
      expect(result).toEqual(mockReservation);
      expect(service.update).toHaveBeenCalledWith('org1', 'res1', dto);
    });
  });

  describe('remove', () => {
    it('should delete a reservation', async () => {
      const result = await controller.remove('org1', 'res1');
      expect(result).toEqual({ success: true });
      expect(service.remove).toHaveBeenCalledWith('org1', 'res1');
    });

    it('should propagate NotFoundException from service', async () => {
      mockService.remove.mockRejectedValueOnce(new NotFoundException('Reservation not found'));
      await expect(controller.remove('org1', 'nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update reservation status to CONFIRMED', async () => {
      const result = await controller.updateStatus('org1', 'res1', 'CONFIRMED');
      expect(result.status).toBe('CONFIRMED');
      expect(service.updateStatus).toHaveBeenCalledWith('org1', 'res1', 'CONFIRMED');
    });
  });

  describe('getByDate', () => {
    it('should return reservations for a branch on a specific date', async () => {
      const result = await controller.getByDate('org1', 'branch1', '2026-08-01');
      expect(result).toEqual([mockReservation]);
      expect(service.getByDate).toHaveBeenCalledWith('org1', 'branch1', '2026-08-01');
    });
  });
});
