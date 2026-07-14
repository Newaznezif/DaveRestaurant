import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { method, url } = request;
    const correlationId = request.headers['x-correlation-id'] as string | undefined;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = ctx.getResponse<Response>();
          const duration = Date.now() - startTime;
          const level = response.statusCode >= 400 ? 'warn' : 'log';

          this.logger[level](
            `${method} ${url} ${response.statusCode} ${duration}ms`,
            correlationId ? { correlationId } : undefined,
          );
        },
        error: (error: Error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `${method} ${url} ${duration}ms - ${error.message}`,
            error.stack,
            correlationId ? { correlationId } : undefined,
          );
        },
      }),
    );
  }
}