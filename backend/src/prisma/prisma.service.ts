import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connection established');

      // @ts-expect-error - Prisma client event typing
      this.$on('query', (e: { query: string; params: string; duration: number }) => {
        if (process.env.NODE_ENV === 'development') {
          this.logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms`);
        }
      });
    } catch (error) {
      this.logger.warn(`Database connection failed: ${error.message}`);
      this.logger.warn('Application will continue but database operations will fail until connection is established');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const modelNames = Object.keys(this).filter(
      (key) => key.startsWith('$') === false && key.startsWith('_') === false,
    );

    return Promise.all(
      modelNames.map((modelName) => {
        // @ts-expect-error - Dynamic model access
        return this[modelName].deleteMany();
      }),
    );
  }

  async executeInTransaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(fn);
  }

  async paginate<T>(
    model: string,
    query: Record<string, unknown>,
    options: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      include?: Record<string, unknown>;
    } = {},
  ): Promise<{
    data: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    const orderBy = options.sortBy
      ? { [options.sortBy]: options.sortOrder || 'asc' }
      : { createdAt: 'desc' as const };

    const [data, total] = await Promise.all([
      (this as any)[model].findMany({
        where: query,
        skip,
        take: limit,
        orderBy,
        include: options.include,
      }),
      (this as any)[model].count({ where: query }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as T[],
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}