import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { StockMovementType } from '@prisma/client';

export class StockMovementDto {
  @IsEnum(StockMovementType)
  type: StockMovementType;

  @IsNumber()
  @Min(0.001)
  quantity: number;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
