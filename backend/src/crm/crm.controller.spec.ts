import { Test, TestingModule } from '@nestjs/testing';
import { CrmController } from './crm.controller';
import { CrmService } from './crm.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { LoyaltyTier } from '@prisma/client';

describe('CrmController', () => {
  let controller: CrmController;
  let service: CrmService;

  const mockCustomer = {
    id: 'cust1',
    organizationId: 'org1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    phone: '1234567890',
    loyaltyPoints: 100,
    loyaltyTier: LoyaltyTier.BRONZE,
  };

  const mockCrmService = {
    findAll: jest.fn().mockResolvedValue([mockCustomer]),
    findOne: jest.fn().mockResolvedValue(mockCustomer),
    create: jest.fn().mockResolvedValue(mockCustomer),
    update: jest.fn().mockResolvedValue(mockCustomer),
    remove: jest.fn().mockResolvedValue({ success: true }),
    updateLoyalty: jest.fn().mockResolvedValue({ ...mockCustomer, loyaltyPoints: 200 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrmController],
      providers: [
        {
          provide: CrmService,
          useValue: mockCrmService,
        },
      ],
    }).compile();

    controller = module.get<CrmController>(CrmController);
    service = module.get<CrmService>(CrmService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all customers for current organization', async () => {
      const result = await controller.findAll('org1');

      expect(result).toEqual([mockCustomer]);
      expect(service.findAll).toHaveBeenCalledWith('org1');
    });
  });

  describe('findOne', () => {
    it('should return a customer by ID', async () => {
      const result = await controller.findOne('org1', 'cust1');

      expect(result).toEqual(mockCustomer);
      expect(service.findOne).toHaveBeenCalledWith('org1', 'cust1');
    });
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      const dto: CreateCustomerDto = {
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        phone: '1234567890',
        loyaltyPoints: 100,
        loyaltyTier: 'BRONZE',
      };

      const result = await controller.create('org1', dto);

      expect(result).toEqual(mockCustomer);
      expect(service.create).toHaveBeenCalledWith('org1', dto);
    });
  });

  describe('update', () => {
    it('should update a customer by ID', async () => {
      const dto: UpdateCustomerDto = {
        firstName: 'Alisha',
        loyaltyTier: 'SILVER',
      };

      const result = await controller.update('org1', 'cust1', dto);

      expect(result).toEqual(mockCustomer);
      expect(service.update).toHaveBeenCalledWith('org1', 'cust1', dto);
    });
  });

  describe('remove', () => {
    it('should delete a customer', async () => {
      const result = await controller.remove('org1', 'cust1');

      expect(result).toEqual({ success: true });
      expect(service.remove).toHaveBeenCalledWith('org1', 'cust1');
    });
  });

  describe('updateLoyalty', () => {
    it('should update loyalty points for a customer', async () => {
      const result = await controller.updateLoyalty('org1', 'cust1', 200);

      expect(result).toEqual({ ...mockCustomer, loyaltyPoints: 200 });
      expect(service.updateLoyalty).toHaveBeenCalledWith('org1', 'cust1', 200);
    });
  });
});
