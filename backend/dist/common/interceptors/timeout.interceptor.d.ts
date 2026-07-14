import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
export declare const TIMEOUT_KEY = "request_timeout";
export declare class TimeoutInterceptor implements NestInterceptor {
    private readonly reflector;
    private readonly defaultTimeout;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
