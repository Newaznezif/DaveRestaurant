import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  async create(@Body() data: any) {
    return this.orgService.create(data);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  async findAll() {
    return this.orgService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.orgService.findById(id);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.orgService.findBySlug(slug);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.RESTAURANT_OWNER)
  async update(@Param('id') id: string, @Body() data: any) {
    return this.orgService.update(id, data);
  }
}