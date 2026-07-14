import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  lastName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be valid',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  avatar?: string;
}