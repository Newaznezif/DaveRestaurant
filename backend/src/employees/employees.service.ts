import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeesService {
  async findAll(orgId: string) {
    return [];
  }
}