import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import * as chalk from 'chalk';
import { AppConfigService } from '../config/config.service';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService implements LoggerService {
  private logger: WinstonLogger;
  private context?: string;

  constructor(private readonly configService: AppConfigService) {
    const isProduction = this.configService.isProduction;
    const logLevel = this.configService.logging.level;
    const logFormat = this.configService.logging.format;

    const winstonFormat =
      logFormat === 'json'
        ? format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            format.errors({ stack: true }),
            format.json(),
          )
        : format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            format.errors({ stack: true }),
            format.printf(({ timestamp, level, message, context, trace, ...meta }) => {
              const levelColor = this.getLevelColor(level);
              const contextStr = context ? chalk.cyan(`[${context}]`) : '';
              const traceStr = trace ? `\n${trace}` : '';
              const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
              return `${chalk.dim(timestamp as string)} ${levelColor(level.toUpperCase())} ${contextStr} ${message}${metaStr}${traceStr}`;
            }),
          );

    this.logger = createLogger({
      level: logLevel,
      format: winstonFormat,
      transports: [
        new transports.Console({
          silent: this.configService.isTest,
        }),
        ...(isProduction
          ? [
              new transports.File({
                filename: 'logs/error.log',
                level: 'error',
                maxsize: 10485760,
                maxFiles: 10,
              }),
              new transports.File({
                filename: 'logs/combined.log',
                maxsize: 10485760,
                maxFiles: 10,
              }),
            ]
          : []),
      ],
    });
  }

  private getLevelColor(level: string): chalk.ChalkFunction {
    switch (level) {
      case 'error':
        return chalk.red;
      case 'warn':
        return chalk.yellow;
      case 'info':
        return chalk.green;
      case 'debug':
        return chalk.blue;
      case 'verbose':
        return chalk.magenta;
      default:
        return chalk.white;
    }
  }

  setContext(context: string): void {
    this.context = context;
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.info(this.formatMessage(message), this.formatMeta(optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    const [trace, ...meta] = optionalParams;
    this.logger.error(this.formatMessage(message), {
      trace: trace instanceof Error ? trace.stack : trace,
      ...this.formatMeta(meta),
    });
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.warn(this.formatMessage(message), this.formatMeta(optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.debug(this.formatMessage(message), this.formatMeta(optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.verbose(this.formatMessage(message), this.formatMeta(optionalParams));
  }

  private formatMessage(message: unknown): string {
    if (typeof message === 'object') {
      try {
        return JSON.stringify(message);
      } catch {
        return String(message);
      }
    }
    return String(message);
  }

  private formatMeta(params: unknown[]): Record<string, unknown> {
    if (params.length === 0) return {};
    if (params.length === 1 && typeof params[0] === 'object') {
      return { context: this.context, ...(params[0] as Record<string, unknown>) };
    }
    return { context: this.context, meta: params };
  }

  logInfo(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, { context: this.context, ...meta });
  }

  logError(message: string, error?: Error | string, meta?: Record<string, unknown>): void {
    this.logger.error(message, {
      context: this.context,
      trace: error instanceof Error ? error.stack : error,
      ...meta,
    });
  }

  logWarn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, { context: this.context, ...meta });
  }

  logDebug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, { context: this.context, ...meta });
  }

  logVerbose(message: string, meta?: Record<string, unknown>): void {
    this.logger.verbose(message, { context: this.context, ...meta });
  }
}