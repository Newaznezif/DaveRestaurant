import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { NotFoundException } from '@nestjs/common';
import { StockMovementType } from '@prisma/client';

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: InventoryService;

  const mockItem = {
    id: 'item1', organizationId: 'org1', branchId: 'branch1',
    name: 'Chicken Breast', unit: 'kg', quantity: 10,
    minQuantity: 2, costPrice: 5, isActive: true,
  };

  const mockMovement = {
    id: 'mov1', inventoryId: 'item1', type: StockMovementType.PURCHASE,
    quantity: 5, beforeQuantity: 10, afterQuantity: 15,
  };

  const mockService = {
    findAll: jest.fn().mockResolvedValue([mockItem]),
    findOne: jest.fn().mockResolvedValue(mockItem),
    create: jest.fn().mockResolvedValue(mockItem),
    update: jest.fn().mockResolvedValue(mockItem),
    remove: jest.fn().mockResolvedValue({ success: true }),
    findLowStock: jest.fn().mockResolvedValue([]),
    recordMovement: jest.fn().mockResolvedValue({ item: { ...mockItem, quantity: 15 }, movement: mockMovement, isLowStock: false }),
    getMovements: jest.fn().mockResolvedValue([mockMovement]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [{ provide: InventoryService, useValue: mockService }],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get<InventoryService>(InventoryService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all items for org', async () => {
      const result = await controller.findAll('org1');
      expect(result).toEqual([mockItem]);
      expect(service.findAll).toHaveBeenCalledWith('org1', undefined);
    });
    it('should pass branchId filter', async () => {
      await controller.findAll('org1', 'branch1');
      expect(service.findAll).toHaveBeenCalledWith('org1', 'branch1');
    });
  });

  describe('findOne', () => {
    it('should return single item with movements', async () => {
      const result = await controller.findOne('org1', 'item1');
      expect(result).toEqual(mockItem);
      expect(service.findOne).toHaveBeenCalledWith('org1', 'item1');
    });
  });

  describe('create', () => {
    it('should create an item', async () => {
      const dto = { branchId: 'branch1', name: 'Chicken Breast', unit: 'kg' };
      const result = await controller.create('org1', dto as any);
      expect(result).toEqual(mockItem);
      expect(service.create).toHaveBeenCalledWith('org1', dto);
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const dto = { notes: 'Refrigerate below 4°C' };
      const result = await controller.update('org1', 'item1', dto as any);
      expect(result).toEqual(mockItem);
      expect(service.update).toHaveBeenCalledWith('org1', 'item1', dto);
    });
  });

  describe('remove', () => {
    it('should soft-delete an item', async () => {
      const result = await controller.remove('org1', 'item1');
      expect(result).toEqual({ success: true });
      expect(service.remove).toHaveBeenCalledWith('org1', 'item1');
    });

    it('should propagate NotFoundException', async () => {
      mockService.remove.mockRejectedValueOnce(new NotFoundException('Not found'));
      await expect(controller.remove('org1', 'bad')).rejects.toThrow(NotFoundException);
    });
  });

  describe('recordMovement', () => {
    it('should record a PURCHASE stock movement', async () => {
      const dto = { type: StockMovementType.PURCHASE, quantity: 5 };
      const result = await controller.recordMovement('org1', 'user1', 'item1', dto as any);
      expect(result.item.quantity).toBe(15);
      expect(result.isLowStock).toBe(false);
      expect(service.recordMovement).toHaveBeenCalledWith('org1', 'item1', dto, 'user1');
    });
  });

  describe('getMovements', () => {
    it('should return movement history', async () => {
      const result = await controller.getMovements('org1', 'item1');
      expect(result).toEqual([mockMovement]);
      expect(service.getMovements).toHaveBeenCalledWith('org1', 'item1');
    });
  });

  describe('findLowStock', () => {
    it('should return low stock items', async () => {
      const result = await controller.findLowStock('org1');
      expect(result).toEqual([]);
      expect(service.findLowStock).toHaveBeenCalledWith('org1', undefined);
    });
  });
});
