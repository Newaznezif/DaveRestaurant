import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
          const paginatedData = data as { data: T; meta: unknown };
          return {
            success: true,
            statusCode,
            message: 'Success',
            data: paginatedData.data,
            meta: paginatedData.meta as ApiResponse<T>['meta'],
            timestamp: new Date().toISOString(),
            path,
          };
        }

        return {
          success: true,
          statusCode,
          message: 'Success',
          data: data ?? undefined,
          timestamp: new Date().toISOString(),
          path,
        };
      }),
    );
  }
}