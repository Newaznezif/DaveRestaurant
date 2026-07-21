import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StockMovementType } from '@prisma/client';

describe('InventoryService', () => {
  let service: InventoryService;
  let prisma: PrismaService;

  const mockItem = {
    id: 'item1',
    organizationId: 'org1',
    branchId: 'branch1',
    name: 'Chicken Breast',
    sku: 'CHK-001',
    barcode: null,
    category: 'raw',
    unit: 'kg',
    quantity: 10,
    minQuantity: 2,
    maxQuantity: 50,
    costPrice: 5,
    sellingPrice: null,
    expiryDate: null,
    image: null,
    notes: null,
    isActive: true,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    branch: { id: 'branch1', name: 'Main Branch' },
    movements: [],
  };

  const mockMovement = {
    id: 'mov1',
    inventoryId: 'item1',
    type: StockMovementType.PURCHASE,
    quantity: 5,
    beforeQuantity: 10,
    afterQuantity: 15,
    reference: 'PO-001',
    notes: 'Stock refill',
    userId: null,
    metadata: {},
    createdAt: new Date(),
  };

  const mockPrisma: any = {
    inventoryItem: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    stockMovement: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn((fn) => fn(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── findAll ─────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return all active inventory items for org', async () => {
      mockPrisma.inventoryItem.findMany.mockResolvedValue([mockItem]);
      const result = await service.findAll('org1');
      expect(result).toEqual([mockItem]);
      expect(prisma.inventoryItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { organizationId: 'org1', isActive: true } }),
      );
    });

    it('should filter by branchId when provided', async () => {
      mockPrisma.inventoryItem.findMany.mockResolvedValue([mockItem]);
      await service.findAll('org1', 'branch1');
      expect(prisma.inventoryItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { organizationId: 'org1', branchId: 'branch1', isActive: true } }),
      );
    });
  });

  // ─── findOne ─────────────────────────────────────────────────────────────
  describe('findOne', () => {
    it('should return item with movements', async () => {
      mockPrisma.inventoryItem.findFirst.mockResolvedValue(mockItem);
      const result = await service.findOne('org1', 'item1');
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.inventoryItem.findFirst.mockResolvedValue(null);
      await expect(service.findOne('org1', 'nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── create ──────────────────────────────────────────────────────────────
  describe('create', () => {
    it('should create an inventory item with defaults', async () => {
      mockPrisma.inventoryItem.create.mockResolvedValue(mockItem);
      const dto = { branchId: 'branch1', name: 'Chicken Breast', unit: 'kg' };
      const result = await service.create('org1', dto as any);
      expect(result).toEqual(mockItem);
      expect(prisma.inventoryItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ organizationId: 'org1', quantity: 0, minQuantity: 0, costPrice: 0 }),
        }),
      );
    });
  });

  // ─── update ──────────────────────────────────────────────────────────────
  describe('update', () => {
    it('should update metadata after verifying ownership', async () => {
      mockPrisma.inventoryItem.findFirst.mockResolvedValue(mockItem);
      mockPrisma.inventoryItem.update.mockResolvedValue({ ...mockItem, notes: 'Updated' });
      const result = await service.update('org1', 'item1', { notes: 'Updated' } as any);
      expect(result.notes).toBe('Updated');
    });

    it('should throw NotFoundException if item not owned', async () => {
      mockPrisma.inventoryItem.findFirst.mockResolvedValue(null);
      await expect(service.update('org1', 'bad', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── remove (soft-delete) ────────────────────────────────────────────────
  describe('remove', () => {
    it('should soft-delete by setting isActive=false', async () => {
      mockPrisma.inventoryItem.findFirst.mockResolvedValue(mockItem);
      mockPrisma.inventoryItem.update.mockResolvedValue({ ...mockItem, isActive: false });
      const result = await service.remove('org1', 'item1');
      expect(result).toEqual({ success: true });
      expect(prisma.inventoryItem.update).toHaveBeenCalledWith({
        where: { id: 'item1' },
        data: { isActive: false },
      });
    });
  });

  // ─── recordMovement ──────────────────────────────────────────────────────
  describe('recordMovement', () => {
    it('should add quantity for PURCHASE movement', async () => {
      mockPrisma.inventoryItem.findFirst.mockResolvedValue(mockItem);
      mockPrisma.inventoryItem.update.mockResolvedValue({ ...mockItem, quantity: 15 });
      mockPrisma.stockMovement.create.mockResolvedValue(mockMovement);

      const result = await service.recordMovement('org1', 'item1', {
        type: StockMovementType.PURCHASE, quantity: 5, notes: 'Stock refill',
      });

      expect(result.item.quantity).toBe(15);
      expect(result.isLowStock).toBe(false);
      expect(prisma.inventoryItem.update).toHaveBeenCalledWith({
        where: { id: 'item1' },
        data: { quantity: 15 },
      });
    });

    it('should deduct quantity for SALE movement', async () => {
      mockPrisma.inventoryItem.findFirst.mockResolvedValue(mockItem);
      mockPrisma.inventoryItem.update.mockResolvedValue({ ...mockItem, quantity: 7 });
      mockPrisma.stockMovement.create.mockResolvedValue({ ...mockMovement, type: StockMovementType.SALE });

      const result = await service.recordMovement('org1', 'item1', {
        type: StockMovementType.SALE, quantity: 3,
      });

      expect(result.item.quantity).toBe(7);
    });

    it('should throw BadRequestException if insufficient stock on SALE', async () => {
      const lowItem = { ...mockItem, quantity: 1 };
      mockPrisma.inventoryItem.findFirst.mockResolvedValue(lowItem);

      await expect(
        service.recordMovement('org1', 'item1', { type: StockMovementType.SALE, quantity: 5 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should set absolute quantity for ADJUSTMENT', async () => {
      mockPrisma.inventoryItem.findFirst.mockResolvedValue(mockItem); // quantity=10
      mockPrisma.inventoryItem.update.mockResolvedValue({ ...mockItem, quantity: 8 });
      mockPrisma.stockMovement.create.mockResolvedValue({ ...mockMovement, type: StockMovementType.ADJUSTMENT });

      const result = await service.recordMovement('org1', 'item1', {
        type: StockMovementType.ADJUSTMENT, quantity: 8,
      });

      expect(result.item.quantity).toBe(8);
      expect(prisma.inventoryItem.update).toHaveBeenCalledWith({
        where: { id: 'item1' },
        data: { quantity: 8 },
      });
    });

    it('should flag isLowStock when quantity falls to minQuantity', async () => {
      mockPrisma.inventoryItem.findFirst.mockResolvedValue({ ...mockItem, quantity: 4 }); // min=2
      mockPrisma.inventoryItem.update.mockResolvedValue({ ...mockItem, quantity: 2 });
      mockPrisma.stockMovement.create.mockResolvedValue({ ...mockMovement, type: StockMovementType.SALE });

      const result = await service.recordMovement('org1', 'item1', {
        type: StockMovementType.SALE, quantity: 2,
      });

      expect(result.isLowStock).toBe(true);
    });
  });

  // ─── findLowStock ────────────────────────────────────────────────────────
  describe('findLowStock', () => {
    it('should return only items at or below minQuantity', async () => {
      const okItem = { ...mockItem, quantity: 10, minQuantity: 2 };
      const lowItem = { ...mockItem, id: 'item2', quantity: 1, minQuantity: 2 };
      mockPrisma.inventoryItem.findMany.mockResolvedValue([okItem, lowItem]);

      const result = await service.findLowStock('org1');

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('item2');
    });
  });

  // ─── getMovements ────────────────────────────────────────────────────────
  describe('getMovements', () => {
    it('should return movement history for an item', async () => {
      mockPrisma.inventoryItem.findFirst.mockResolvedValue(mockItem);
      mockPrisma.stockMovement.findMany.mockResolvedValue([mockMovement]);
      const result = await service.getMovements('org1', 'item1');
      expect(result).toEqual([mockMovement]);
      expect(prisma.stockMovement.findMany).toHaveBeenCalledWith({
        where: { inventoryId: 'item1' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
