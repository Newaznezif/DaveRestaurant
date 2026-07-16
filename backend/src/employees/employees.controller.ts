import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@ApiTags('Employees')
@ApiBearerAuth()
@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all employees for organization' })
  async findAll(@CurrentUser('organizationId') orgId: string) {
    return this.employeesService.findAll(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  async findOne(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.employeesService.findOne(orgId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  async create(
    @CurrentUser('organizationId') orgId: string,
    @Body() createEmployeeDto: CreateEmployeeDto,
  ) {
    return this.employeesService.create(orgId, createEmployeeDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an employee' })
  async update(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(orgId, id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an employee' })
  async remove(
    @CurrentUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.employeesService.remove(orgId, id);
  }
}