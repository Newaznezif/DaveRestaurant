import { PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @IsOptional()
  @IsString()
  status?: string;
}
