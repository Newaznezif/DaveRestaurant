import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../auth/services/password.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class EmployeesService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  async findAll(orgId: string) {
    return this.prisma.employee.findMany({
      where: { organizationId: orgId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
          }
        },
        department: true,
        branch: true,
      },
    });
  }

  async findOne(orgId: string, id: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, organizationId: orgId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
          }
        },
        department: true,
        branch: true,
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async create(orgId: string, dto: CreateEmployeeDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Default password for new employee
    const passwordHash = await this.passwordService.hashPassword('password123');
    const employeeId = 'EMP-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Map the string role to the UserRole enum, default to STAFF if not provided (fallback)
    let roleEnum: UserRole = UserRole.WAITER; // default reasonable role
    if (dto.role && Object.values(UserRole).includes(dto.role as UserRole)) {
      roleEnum = dto.role as UserRole;
    }

    const result = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: roleEnum,
          organizationId: orgId,
          branchId: dto.branchId,
          isVerified: true,
        },
      });

      const employee = await prisma.employee.create({
        data: {
          userId: user.id,
          organizationId: orgId,
          branchId: dto.branchId,
          departmentId: dto.departmentId,
          employeeId,
          position: dto.position,
          salary: dto.salary,
          hourlyRate: dto.hourlyRate,
          payType: dto.payType || 'SALARY',
          employmentType: dto.employmentType || 'FULL_TIME',
          isActive: true,
        },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true, role: true }
          }
        }
      });

      return employee;
    });

    return result;
  }

  async update(orgId: string, id: string, dto: UpdateEmployeeDto) {
    const employee = await this.findOne(orgId, id);

    let roleEnum: UserRole | undefined = undefined;
    if (dto.role && Object.values(UserRole).includes(dto.role as UserRole)) {
      roleEnum = dto.role as UserRole;
    }

    await this.prisma.$transaction(async (prisma) => {
      if (dto.firstName || dto.lastName || dto.email || roleEnum || dto.isActive !== undefined || dto.branchId) {
        await prisma.user.update({
          where: { id: employee.userId },
          data: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            role: roleEnum,
            isActive: dto.isActive,
            branchId: dto.branchId,
          },
        });
      }

      await prisma.employee.update({
        where: { id },
        data: {
          branchId: dto.branchId,
          departmentId: dto.departmentId,
          position: dto.position,
          salary: dto.salary,
          hourlyRate: dto.hourlyRate,
          payType: dto.payType,
          employmentType: dto.employmentType,
          isActive: dto.isActive,
        },
      });
    });

    return this.findOne(orgId, id);
  }

  async remove(orgId: string, id: string) {
    const employee = await this.findOne(orgId, id);
    
    await this.prisma.user.delete({
      where: { id: employee.userId },
    });

    return { success: true };
  }
}