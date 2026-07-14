"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    constructor() {
        this.logger = new common_1.Logger(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const correlationId = request.headers['x-correlation-id'];
        let status;
        let message;
        let errors;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
            else if (typeof exceptionResponse === 'object') {
                const resp = exceptionResponse;
                message = resp.message || exception.message;
                if (Array.isArray(resp.message)) {
                    errors = resp.message.map((msg) => ({
                        message: msg,
                        code: 'VALIDATION_ERROR',
                    }));
                    message = 'Validation failed';
                }
                else if (resp.errors) {
                    errors = resp.errors;
                }
            }
            else {
                message = exception.message;
            }
        }
        else if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            status = common_1.HttpStatus.CONFLICT;
            message = 'Database constraint violation';
            switch (exception.code) {
                case 'P2002':
                    message = 'A record with this value already exists';
                    break;
                case 'P2025':
                    status = common_1.HttpStatus.NOT_FOUND;
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
                const meta = exception.meta;
                if (meta.target) {
                    errors = [{ message, code: exception.code }];
                }
            }
        }
        else if (exception instanceof client_1.Prisma.PrismaClientValidationError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            message = 'Invalid data provided';
        }
        else if (exception instanceof client_1.Prisma.PrismaClientInitializationError) {
            status = common_1.HttpStatus.SERVICE_UNAVAILABLE;
            message = 'Database connection failed';
        }
        else if (exception instanceof Error) {
            if (exception.name === 'JsonWebTokenError' || exception.name === 'TokenExpiredError') {
                status = common_1.HttpStatus.UNAUTHORIZED;
                message = exception.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token';
            }
            else if (exception.name === 'ThrottlerException') {
                status = common_1.HttpStatus.TOO_MANY_REQUESTS;
                message = 'Too many requests, please try again later';
            }
            else {
                status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                message = 'Internal server error';
            }
        }
        else {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
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
        if (status === common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(`Unhandled exception: ${exception instanceof Error ? exception.message : 'Unknown error'}`, exception instanceof Error ? exception.stack : undefined, { correlationId, path: request.url, method: request.method });
        }
        else {
            this.logger.warn(`Request error: ${status} - ${message}`, { correlationId, path: request.url, method: request.method });
        }
        response.status(status).json(errorResponse);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map