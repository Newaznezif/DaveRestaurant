import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsString()
  categoryId: string;
}
