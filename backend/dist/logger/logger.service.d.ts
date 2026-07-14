import { LoggerService } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
export declare class AppLoggerService implements LoggerService {
    private readonly configService;
    private logger;
    private context?;
    constructor(configService: AppConfigService);
    private getLevelColor;
    setContext(context: string): void;
    log(message: unknown, ...optionalParams: unknown[]): void;
    error(message: unknown, ...optionalParams: unknown[]): void;
    warn(message: unknown, ...optionalParams: unknown[]): void;
    debug(message: unknown, ...optionalParams: unknown[]): void;
    verbose(message: unknown, ...optionalParams: unknown[]): void;
    private formatMessage;
    private formatMeta;
    logInfo(message: string, meta?: Record<string, unknown>): void;
    logError(message: string, error?: Error | string, meta?: Record<string, unknown>): void;
    logWarn(message: string, meta?: Record<string, unknown>): void;
    logDebug(message: string, meta?: Record<string, unknown>): void;
    logVerbose(message: string, meta?: Record<string, unknown>): void;
}
