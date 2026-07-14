import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';
import { AppConfigService } from './config/config.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('System')
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  private readonly startTime: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: AppConfigService,
  ) {
    this.startTime = Date.now();
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Check system health' })
  @ApiResponse({ status: 200, description: 'System is healthy' })
  @ApiResponse({ status: 503, description: 'System is unhealthy' })
  async check() {
    const services = await Promise.allSettled([
      this.checkDatabase(),
      this.checkMemory(),
      this.checkUptime(),
    ]);

    const [database, memory, uptime] = services.map((result) =>
      result.status === 'fulfilled' ? result.value : { status: 'unhealthy', error: 'Check failed' },
    );

    const isHealthy = [database, memory, uptime].every(
      (service) => service.status === 'healthy',
    );

    const healthStatus = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database,
        memory,
        uptime,
      },
      version: this.configService.swagger.version,
      environment: this.configService.nodeEnv,
    };

    if (!isHealthy) {
      this.logger.warn('Health check failed', JSON.stringify(healthStatus));
    }

    return healthStatus;
  }

  @Get('/live')
  @Public()
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiResponse({ status: 200, description: 'Application is alive' })
  async liveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('/ready')
  @Public()
  @ApiOperation({ summary: 'Readiness probe' })
  @ApiResponse({ status: 200, description: 'Application is ready' })
  @ApiResponse({ status: 503, description: 'Application is not ready' })
  async readiness() {
    const dbHealthy = await this.checkDatabase();
    const isReady = dbHealthy.status === 'healthy';

    return {
      status: isReady ? 'ready' : 'not ready',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy,
      },
    };
  }

  private async checkDatabase(): Promise<{ status: string; latency?: string; error?: string }> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;
      return { status: 'healthy', latency: `${latency}ms` };
    } catch (error) {
      this.logger.error('Database health check failed', error instanceof Error ? error.stack : error);
      return { status: 'unhealthy', error: 'Database connection failed' };
    }
  }

  private checkMemory(): { status: string; heapUsed: string; heapTotal: string; rss: string } {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    const rssMB = Math.round(memoryUsage.rss / 1024 / 1024);

    const isHealthy = heapUsedMB < 1024;

    return {
      status: isHealthy ? 'healthy' : 'warning',
      heapUsed: `${heapUsedMB}MB`,
      heapTotal: `${heapTotalMB}MB`,
      rss: `${rssMB}MB`,
    };
  }

  private checkUptime(): { status: string; uptime: number; startedAt: string } {
    const uptimeSeconds = process.uptime();
    return {
      status: 'healthy',
      uptime: uptimeSeconds,
      startedAt: new Date(this.startTime).toISOString(),
    };
  }
}