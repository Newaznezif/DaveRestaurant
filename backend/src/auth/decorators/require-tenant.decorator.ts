import { SetMetadata } from '@nestjs/common';

export const TENANT_KEY = 'tenant';
export const RequireTenant = () => SetMetadata(TENANT_KEY, true);