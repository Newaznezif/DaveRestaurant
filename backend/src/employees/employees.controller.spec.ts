import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UserRole } from '@prisma/client';

describe('EmployeesController', () => {
  let controller: EmployeesController;
  let service: EmployeesService;

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
    },
  };

  const mockEmployeesService = {
    findAll: jest.fn().mockResolvedValue([mockEmployee]),
    findOne: jest.fn().mockResolvedValue(mockEmployee),
    create: jest.fn().mockResolvedValue(mockEmployee),
    update: jest.fn().mockResolvedValue(mockEmployee),
    remove: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: mockEmployeesService,
        },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
    service = module.get<EmployeesService>(EmployeesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all employees for the current organization', async () => {
      const result = await controller.findAll('org1');

      expect(result).toEqual([mockEmployee]);
      expect(service.findAll).toHaveBeenCalledWith('org1');
    });
  });

  describe('findOne', () => {
    it('should return a single employee', async () => {
      const result = await controller.findOne('org1', 'emp1');

      expect(result).toEqual(mockEmployee);
      expect(service.findOne).toHaveBeenCalledWith('org1', 'emp1');
    });
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const dto: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'WAITER',
        position: 'Waiter',
        salary: 30000,
      };

      const result = await controller.create('org1', dto);

      expect(result).toEqual(mockEmployee);
      expect(service.create).toHaveBeenCalledWith('org1', dto);
    });
  });

  describe('update', () => {
    it('should update an existing employee', async () => {
      const dto: UpdateEmployeeDto = {
        position: 'Senior Waiter',
        salary: 35000,
      };

      const result = await controller.update('org1', 'emp1', dto);

      expect(result).toEqual(mockEmployee);
      expect(service.update).toHaveBeenCalledWith('org1', 'emp1', dto);
    });
  });

  describe('remove', () => {
    it('should delete an employee', async () => {
      const result = await controller.remove('org1', 'emp1');

      expect(result).toEqual({ success: true });
      expect(service.remove).toHaveBeenCalledWith('org1', 'emp1');
    });
  });
});
