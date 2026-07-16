import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateInventoryItemDto {
  @IsString()
  branchId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsString()
  unit: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minQuantity?: number;

  @IsOptional()
  @IsNumber()
  maxQuantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @IsOptional()
  @IsNumber()
  sellingPrice?: number;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
