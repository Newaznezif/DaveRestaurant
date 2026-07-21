import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MenuService', () => {
  let service: MenuService;
  let prisma: PrismaService;

  const mockCategory = {
    id: 'cat1',
    organizationId: 'org1',
    name: 'Starters',
    slug: 'starters-1234567890',
    description: 'Appetizers',
    isActive: true,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProduct = {
    id: 'prod1',
    organizationId: 'org1',
    categoryId: 'cat1',
    name: 'Bruschetta',
    slug: 'bruschetta-1234567890',
    price: 8.99,
    isActive: true,
    isAvailable: true,
  };

  const mockPrismaService: any = {
    menuCategory: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── getCategories ───────────────────────────────────────────────────────
  describe('getCategories', () => {
    it('should return all categories for organization ordered by sortOrder', async () => {
      mockPrismaService.menuCategory.findMany.mockResolvedValue([mockCategory]);

      const result = await service.getCategories('org1');

      expect(result).toEqual([mockCategory]);
      expect(prisma.menuCategory.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org1' },
        orderBy: { sortOrder: 'asc' },
        include: {
          products: {
            where: { isActive: true },
            include: { variants: true, addonGroups: { include: { items: true } } },
          },
          children: true,
        },
      });
    });
  });

  // ─── getCategory ─────────────────────────────────────────────────────────
  describe('getCategory', () => {
    it('should return a category if found in org', async () => {
      mockPrismaService.menuCategory.findFirst.mockResolvedValue(mockCategory);

      const result = await service.getCategory('org1', 'cat1');

      expect(result).toEqual(mockCategory);
      expect(prisma.menuCategory.findFirst).toHaveBeenCalledWith({
        where: { id: 'cat1', organizationId: 'org1' },
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      mockPrismaService.menuCategory.findFirst.mockResolvedValue(null);

      await expect(service.getCategory('org1', 'nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── createCategory ──────────────────────────────────────────────────────
  describe('createCategory', () => {
    const createDto = {
      name: 'Starters',
      description: 'Appetizers',
      isActive: true,
      sortOrder: 0,
    };

    it('should create a category with an auto-generated slug', async () => {
      mockPrismaService.menuCategory.create.mockResolvedValue(mockCategory);

      const result = await service.createCategory('org1', createDto);

      expect(result).toEqual(mockCategory);
      expect(prisma.menuCategory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            organizationId: 'org1',
            name: 'Starters',
            slug: expect.stringMatching(/^starters-\d+$/),
          }),
        }),
      );
    });
  });

  // ─── updateCategory ──────────────────────────────────────────────────────
  describe('updateCategory', () => {
    it('should update a category after verifying ownership', async () => {
      mockPrismaService.menuCategory.findFirst.mockResolvedValue(mockCategory);
      mockPrismaService.menuCategory.update.mockResolvedValue({
        ...mockCategory,
        name: 'Appetizers',
      });

      const result = await service.updateCategory('org1', 'cat1', { name: 'Appetizers' });

      expect(result.name).toBe('Appetizers');
      expect(prisma.menuCategory.update).toHaveBeenCalledWith({
        where: { id: 'cat1' },
        data: { name: 'Appetizers' },
      });
    });

    it('should throw NotFoundException if category does not belong to org', async () => {
      mockPrismaService.menuCategory.findFirst.mockResolvedValue(null);

      await expect(service.updateCategory('org1', 'wrong-cat', { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  // ─── deleteCategory ──────────────────────────────────────────────────────
  describe('deleteCategory', () => {
    it('should delete an empty category successfully', async () => {
      mockPrismaService.menuCategory.findFirst.mockResolvedValue(mockCategory);
      mockPrismaService.product.count.mockResolvedValue(0);
      mockPrismaService.menuCategory.delete.mockResolvedValue(mockCategory);

      const result = await service.deleteCategory('org1', 'cat1');

      expect(result).toEqual({ success: true });
      expect(prisma.product.count).toHaveBeenCalledWith({
        where: { categoryId: 'cat1' },
      });
      expect(prisma.menuCategory.delete).toHaveBeenCalledWith({ where: { id: 'cat1' } });
    });

    it('should throw BadRequestException if category still has products', async () => {
      mockPrismaService.menuCategory.findFirst.mockResolvedValue(mockCategory);
      mockPrismaService.product.count.mockResolvedValue(3);

      await expect(service.deleteCategory('org1', 'cat1')).rejects.toThrow(BadRequestException);
      expect(prisma.menuCategory.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if category not found', async () => {
      mockPrismaService.menuCategory.findFirst.mockResolvedValue(null);

      await expect(service.deleteCategory('org1', 'nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── getProducts ─────────────────────────────────────────────────────────
  describe('getProducts', () => {
    it('should return all products for organization', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);

      const result = await service.getProducts('org1');

      expect(result).toEqual([mockProduct]);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org1' },
        include: { variants: true, addonGroups: { include: { items: true } }, category: true },
        orderBy: { name: 'asc' },
      });
    });

    it('should filter products by categoryId if passed', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);

      const result = await service.getProducts('org1', 'cat1');

      expect(result).toEqual([mockProduct]);
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org1', categoryId: 'cat1' },
        include: { variants: true, addonGroups: { include: { items: true } }, category: true },
        orderBy: { name: 'asc' },
      });
    });
  });

  // ─── getProduct ──────────────────────────────────────────────────────────
  describe('getProduct', () => {
    it('should return product if owned by org', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);

      const result = await service.getProduct('org1', 'prod1');

      expect(result).toEqual(mockProduct);
      expect(prisma.product.findFirst).toHaveBeenCalledWith({
        where: { id: 'prod1', organizationId: 'org1' },
        include: { category: true },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(null);

      await expect(service.getProduct('org1', 'nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── createProduct ───────────────────────────────────────────────────────
  describe('createProduct', () => {
    const createDto = {
      name: 'Bruschetta',
      description: 'Toasted bread',
      price: 8.99,
      categoryId: 'cat1',
    };

    it('should create product with slug successfully', async () => {
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const result = await service.createProduct('org1', createDto);

      expect(result).toEqual(mockProduct);
      expect(prisma.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            organizationId: 'org1',
            name: 'Bruschetta',
            price: 8.99,
            categoryId: 'cat1',
            slug: expect.stringMatching(/^bruschetta-\d+$/),
          }),
        }),
      );
    });
  });

  // ─── updateProduct ───────────────────────────────────────────────────────
  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({
        ...mockProduct,
        price: 9.99,
      });

      const result = await service.updateProduct('org1', 'prod1', { price: 9.99 });

      expect(result.price).toBe(9.99);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'prod1' },
        data: { price: 9.99 },
      });
    });
  });

  // ─── deleteProduct ───────────────────────────────────────────────────────
  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);
      mockPrismaService.product.delete.mockResolvedValue(mockProduct);

      const result = await service.deleteProduct('org1', 'prod1');

      expect(result).toEqual({ success: true });
      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 'prod1' } });
    });
  });
});
