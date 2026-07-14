import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';
import { configValidationSchema } from './config.validation';

describe('AppConfigService', () => {
  let service: AppConfigService;

  beforeEach(async () => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.JWT_ACCESS_SECRET = 'a'.repeat(32);
    process.env.JWT_REFRESH_SECRET = 'b'.repeat(32);
    process.env.ENCRYPTION_KEY = 'c'.repeat(32);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validationSchema: configValidationSchema,
          validationOptions: { allowUnknown: true, abortEarly: false },
          ignoreEnvFile: true,
        }),
      ],
      providers: [AppConfigService],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
  });

  afterEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.JWT_ACCESS_SECRET;
    delete process.env.JWT_REFRESH_SECRET;
    delete process.env.ENCRYPTION_KEY;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return node environment', () => {
    expect(service.nodeEnv).toBeDefined();
  });

  it('should return port number', () => {
    expect(service.port).toBe(4000);
  });

  it('should return API global prefix', () => {
    expect(service.apiGlobalPrefix).toBe('api/v1');
  });

  it('should return JWT config', () => {
    const jwt = service.jwt;
    expect(jwt.accessSecret).toBe('a'.repeat(32));
    expect(jwt.refreshSecret).toBe('b'.repeat(32));
    expect(jwt.accessExpiry).toBe('15m');
    expect(jwt.refreshExpiry).toBe('7d');
  });

  it('should return CORS config', () => {
    const cors = service.cors;
    expect(cors.frontendUrl).toBe('http://localhost:3000');
    expect(Array.isArray(cors.origins)).toBe(true);
  });

  it('should return throttle config', () => {
    const throttle = service.throttle;
    expect(throttle.ttl).toBe(60000);
    expect(throttle.limit).toBe(100);
  });

  it('should return logging config', () => {
    const logging = service.logging;
    expect(logging.level).toBe('debug');
    expect(logging.format).toBe('json');
  });

  it('should detect development environment', () => {
    process.env.NODE_ENV = 'development';
    expect(service.isDevelopment).toBe(true);
    expect(service.isProduction).toBe(false);
    expect(service.isTest).toBe(false);
  });
});