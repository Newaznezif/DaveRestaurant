import { IsString, IsOptional, IsEmail, IsNumber } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  loyaltyPoints?: number;

  @IsOptional()
  @IsString()
  loyaltyTier?: string;
}
