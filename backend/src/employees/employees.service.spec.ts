import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesService } from './employees.service';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../auth/services/password.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let prisma: PrismaService;
  let passwordService: PasswordService;

  const mockEmployee = {
    id: 'emp1',
    userId: 'user1',
    organizationId: 'org1',
    branchId: 'branch1',
    departmentId: 'dept1',
    employeeId: 'EMP-123456',
    position: 'Waiter',
    salary: 30000,
    hourlyRate: null,
    payType: 'SALARY',
    employmentType: 'FULL_TIME',
    isActive: true,
    user: {
      id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: UserRole.WAITER,
      isActive: true,
    },
    branch: { id: 'branch1', name: 'Main Branch' },
    department: { id: 'dept1', name: 'Front of House' },
  };

  const mockPrismaService: any = {
    employee: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  const mockPasswordService = {
    hashPassword: jest.fn().mockResolvedValue('hashedPasswordHash'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    prisma = module.get<PrismaService>(PrismaService);
    passwordService = module.get<PasswordService>(PasswordService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of employees for an organization', async () => {
      mockPrismaService.employee.findMany.mockResolvedValue([mockEmployee]);

      const result = await service.findAll('org1');

      expect(result).toEqual([mockEmployee]);
      expect(prisma.employee.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org1' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              isActive: true,
            },
          },
          department: true,
          branch: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single employee', async () => {
      mockPrismaService.employee.findFirst.mockResolvedValue(mockEmployee);

      const result = await service.findOne('org1', 'emp1');

      expect(result).toEqual(mockEmployee);
      expect(prisma.employee.findFirst).toHaveBeenCalledWith({
        where: { id: 'emp1', organizationId: 'org1' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              isActive: true,
            },
          },
          department: true,
          branch: true,
        },
      });
    });

    it('should throw NotFoundException if employee not found', async () => {
      mockPrismaService.employee.findFirst.mockResolvedValue(null);

      await expect(service.findOne('org1', 'emp2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const createDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'WAITER',
      position: 'Waiter',
      branchId: 'branch1',
      departmentId: 'dept1',
      salary: 30000,
      hourlyRate: undefined,
      payType: 'SALARY',
      employmentType: 'FULL_TIME',
    };

    it('should create a new employee successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({ id: 'user1' });
      mockPrismaService.employee.create.mockResolvedValue(mockEmployee);

      const result = await service.create('org1', createDto);

      expect(result).toEqual(mockEmployee);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(passwordService.hashPassword).toHaveBeenCalledWith('password123');
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'existingUser' });

      await expect(service.create('org1', createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    const updateDto = {
      firstName: 'Johnny',
      lastName: 'Doe',
      role: 'MANAGER',
      position: 'Senior Waiter',
      isActive: false,
    };

    it('should update employee and user successfully', async () => {
      mockPrismaService.employee.findFirst.mockResolvedValue(mockEmployee);
      mockPrismaService.user.update.mockResolvedValue({ id: 'user1' });
      mockPrismaService.employee.update.mockResolvedValue({
        ...mockEmployee,
        position: 'Senior Waiter',
        isActive: false,
        user: { ...mockEmployee.user, firstName: 'Johnny', role: UserRole.MANAGER },
      });

      const result = await service.update('org1', 'emp1', updateDto);

      expect(prisma.user.update).toHaveBeenCalled();
      expect(prisma.employee.update).toHaveBeenCalled();
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete user and trigger cascade delete for employee', async () => {
      mockPrismaService.employee.findFirst.mockResolvedValue(mockEmployee);
      mockPrismaService.user.delete.mockResolvedValue({ id: 'user1' });

      const result = await service.remove('org1', 'emp1');

      expect(result).toEqual({ success: true });
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'user1' },
      });
    });
  });
});
