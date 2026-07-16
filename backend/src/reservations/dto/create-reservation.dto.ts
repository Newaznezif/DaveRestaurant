import { IsString, IsOptional, IsEmail, IsInt, IsDateString, Min } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  branchId: string;

  @IsString()
  customerName: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsInt()
  @Min(1)
  guests: number;

  @IsString()
  date: string; // ISO date string

  @IsString()
  time: string; // HH:mm

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsString()
  tableId?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsString()
  occasion?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
