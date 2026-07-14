import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from './prisma/prisma.service';
import { AppConfigService } from './config/config.service';
import { ConfigModule } from '@nestjs/config';

describe('HealthController', () => {
  let controller: HealthController;

  const mockPrismaService = {
    $queryRaw: jest.fn().mockResolvedValue([{ '1': 1 }]),
  };

  const mockConfigService = {
    nodeEnv: 'test',
    swagger: { version: '1.0' },
  };

  beforeEach(async () => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.JWT_ACCESS_SECRET = 'a'.repeat(32);
    process.env.JWT_REFRESH_SECRET = 'b'.repeat(32);
    process.env.ENCRYPTION_KEY = 'c'.repeat(32);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AppConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.JWT_ACCESS_SECRET;
    delete process.env.JWT_REFRESH_SECRET;
    delete process.env.ENCRYPTION_KEY;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return healthy status when all services are up', async () => {
    const result = await controller.check();
    expect(result.status).toBe('healthy');
    expect(result.services.database.status).toBe('healthy');
    expect(result.services.memory.status).toBe('healthy');
  });

  it('should return alive status for liveness probe', async () => {
    const result = await controller.liveness();
    expect(result.status).toBe('alive');
    expect(result.timestamp).toBeDefined();
  });

  it('should return ready status when database is connected', async () => {
    const result = await controller.readiness();
    expect(result.status).toBe('ready');
    expect(result.services.database.status).toBe('healthy');
  });
});