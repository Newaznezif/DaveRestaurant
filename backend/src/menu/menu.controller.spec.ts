import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BadRequestException } from '@nestjs/common';

describe('MenuController — Categories', () => {
  let controller: MenuController;
  let service: MenuService;

  const mockCategory = {
    id: 'cat1',
    organizationId: 'org1',
    name: 'Starters',
    slug: 'starters-1234567890',
    description: 'Appetizers',
    isActive: true,
    sortOrder: 0,
  };

  const mockMenuService = {
    getCategories: jest.fn().mockResolvedValue([mockCategory]),
    getCategory: jest.fn().mockResolvedValue(mockCategory),
    createCategory: jest.fn().mockResolvedValue(mockCategory),
    updateCategory: jest.fn().mockResolvedValue(mockCategory),
    deleteCategory: jest.fn().mockResolvedValue({ success: true }),
    getProducts: jest.fn().mockResolvedValue([]),
    getProduct: jest.fn().mockResolvedValue({}),
    createProduct: jest.fn().mockResolvedValue({}),
    updateProduct: jest.fn().mockResolvedValue({}),
    deleteProduct: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        { provide: MenuService, useValue: mockMenuService },
      ],
    }).compile();

    controller = module.get<MenuController>(MenuController);
    service = module.get<MenuService>(MenuService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCategories', () => {
    it('should return categories for the current org (authenticated)', async () => {
      const result = await controller.getCategories("", 'org1');
      expect(result).toEqual([mockCategory]);
      expect(service.getCategories).toHaveBeenCalledWith('org1');
    });

    it('should fall back to query param orgId when not authenticated', async () => {
      const result = await controller.getCategories('org1', "");
      expect(result).toEqual([mockCategory]);
      expect(service.getCategories).toHaveBeenCalledWith('org1');
    });
  });

  describe('getCategory', () => {
    it('should return a single category', async () => {
      const result = await controller.getCategory('org1', 'cat1');
      expect(result).toEqual(mockCategory);
      expect(service.getCategory).toHaveBeenCalledWith('org1', 'cat1');
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const dto: CreateCategoryDto = {
        name: 'Starters',
        description: 'Appetizers',
        isActive: true,
        sortOrder: 0,
      };
      const result = await controller.createCategory('org1', dto);
      expect(result).toEqual(mockCategory);
      expect(service.createCategory).toHaveBeenCalledWith('org1', dto);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const dto: UpdateCategoryDto = { name: 'Appetizers' };
      const result = await controller.updateCategory('org1', 'cat1', dto);
      expect(result).toEqual(mockCategory);
      expect(service.updateCategory).toHaveBeenCalledWith('org1', 'cat1', dto);
    });
  });

  describe('deleteCategory', () => {
    it('should delete an empty category', async () => {
      const result = await controller.deleteCategory('org1', 'cat1');
      expect(result).toEqual({ success: true });
      expect(service.deleteCategory).toHaveBeenCalledWith('org1', 'cat1');
    });

    it('should propagate BadRequestException from service when category has products', async () => {
      mockMenuService.deleteCategory.mockRejectedValueOnce(
        new BadRequestException('Cannot delete category — it still contains 3 product(s).'),
      );
      await expect(controller.deleteCategory('org1', 'cat1')).rejects.toThrow(BadRequestException);
    });
  });

  // ─── Products Controller Tests ───────────────────────────────────────────
  describe('getProducts', () => {
    it('should get all products filtered by orgId', async () => {
      const result = await controller.getProducts('orgQuery', 'cat1', 'orgUser');
      expect(result).toBeDefined();
      expect(service.getProducts).toHaveBeenCalledWith('orgUser', 'cat1');
    });

    it('should fallback to orgId query parameter when user is not present', async () => {
      const result = await controller.getProducts('orgQuery', 'cat1', '');
      expect(result).toBeDefined();
      expect(service.getProducts).toHaveBeenCalledWith('orgQuery', 'cat1');
    });
  });

  describe('getProduct', () => {
    it('should return a single product by ID', async () => {
      const result = await controller.getProduct('org1', 'prod1');
      expect(result).toBeDefined();
      expect(service.getProduct).toHaveBeenCalledWith('org1', 'prod1');
    });
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const dto = {
        name: 'Bruschetta',
        price: 8.99,
        categoryId: 'cat1',
      };
      const result = await controller.createProduct('org1', dto);
      expect(result).toBeDefined();
      expect(service.createProduct).toHaveBeenCalledWith('org1', dto);
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const dto = { price: 9.99 };
      const result = await controller.updateProduct('org1', 'prod1', dto);
      expect(result).toBeDefined();
      expect(service.updateProduct).toHaveBeenCalledWith('org1', 'prod1', dto);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      const result = await controller.deleteProduct('org1', 'prod1');
      expect(result).toEqual({ success: true });
      expect(service.deleteProduct).toHaveBeenCalledWith('org1', 'prod1');
    });
  });
});
