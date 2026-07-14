import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Suppliers')
@ApiBearerAuth()
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser('organizationId') orgId: string, @Body() data: any) {
    return this.suppliersService.create(orgId, data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser('organizationId') orgId: string) {
    return this.suppliersService.findAll(orgId);
  }
}