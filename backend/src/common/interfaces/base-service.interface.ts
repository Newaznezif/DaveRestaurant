import { PaginationParams, PaginatedResult } from './pagination.interface';

export interface BaseService<T, CreateDto, UpdateDto, QueryDto> {
  create(data: CreateDto): Promise<T>;
  findById(id: string): Promise<T>;
  findAll(params: PaginationParams & QueryDto): Promise<PaginatedResult<T>>;
  update(id: string, data: UpdateDto): Promise<T>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
}

export interface TenantAwareService<T, CreateDto, UpdateDto, QueryDto>
  extends BaseService<T, CreateDto, UpdateDto, QueryDto> {
  findByOrganization(
    organizationId: string,
    params: PaginationParams & QueryDto,
  ): Promise<PaginatedResult<T>>;
  findByBranch(
    organizationId: string,
    branchId: string,
    params: PaginationParams & QueryDto,
  ): Promise<PaginatedResult<T>>;
}

export interface AuditEntry {
  userId: string;
  organizationId: string;
  action: string;
  entity: string;
  entityId: string;
  changes: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}