import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const correlationId = request.headers['x-correlation-id'] as string | undefined;

    let status: HttpStatus;
    let message: string;
    let errors: Array<{ field?: string; message: string; code?: string }> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string) || exception.message;

        if (Array.isArray(resp.message)) {
          errors = (resp.message as string[]).map((msg: string) => ({
            message: msg,
            code: 'VALIDATION_ERROR',
          }));
          message = 'Validation failed';
        } else if (resp.errors) {
          errors = resp.errors as Array<{ field?: string; message: string; code?: string }>;
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = HttpStatus.CONFLICT;
      message = 'Database constraint violation';

      switch (exception.code) {
        case 'P2002':
          message = 'A record with this value already exists';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          break;
        case 'P2003':
          message = 'Referenced record does not exist';
          break;
        case 'P2014':
          message = 'Required relation violation';
          break;
        default:
          message = `Database error: ${exception.code}`;
      }

      if (exception.meta && typeof exception.meta === 'object') {
        const meta = exception.meta as Record<string, unknown>;
        if (meta.target) {
          errors = [{ message, code: exception.code }];
        }
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid data provided';
    } else if (exception instanceof Prisma.PrismaClientInitializationError) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Database connection failed';
    } else if (exception instanceof Error) {
      if (exception.name === 'JsonWebTokenError' || exception.name === 'TokenExpiredError') {
        status = HttpStatus.UNAUTHORIZED;
        message = exception.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token';
      } else if (exception.name === 'ThrottlerException') {
        status = HttpStatus.TOO_MANY_REQUESTS;
        message = 'Too many requests, please try again later';
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal server error';
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(correlationId && { correlationId }),
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Unhandled exception: ${exception instanceof Error ? exception.message : 'Unknown error'}`,
        exception instanceof Error ? exception.stack : undefined,
        { correlationId, path: request.url, method: request.method },
      );
    } else {
      this.logger.warn(
        `Request error: ${status} - ${message}`,
        { correlationId, path: request.url, method: request.method },
      );
    }

    response.status(status).json(errorResponse);
  }
}