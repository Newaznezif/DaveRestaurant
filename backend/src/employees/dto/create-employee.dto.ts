import { IsString, IsOptional, IsEmail, IsNumber, IsBoolean, IsEnum } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @IsOptional()
  @IsString()
  payType?: string; // e.g. SALARY, HOURLY

  @IsOptional()
  @IsString()
  employmentType?: string;

  @IsOptional()
  @IsString()
  role?: string; // UserRole enum e.g. MANAGER, WAITER
}
