import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';

export const TIMEOUT_KEY = 'request_timeout';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly defaultTimeout = 30000; // 30 seconds

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const requestTimeout =
      this.reflector.get<number>(TIMEOUT_KEY, context.getHandler()) ||
      this.reflector.get<number>(TIMEOUT_KEY, context.getClass()) ||
      this.defaultTimeout;

    return next.handle().pipe(
      timeout(requestTimeout),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new RequestTimeoutException(
                `Request processing time exceeded ${requestTimeout}ms`,
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}