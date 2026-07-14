"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLoggerService = void 0;
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
const chalk = require("chalk");
const config_service_1 = require("../config/config.service");
let AppLoggerService = class AppLoggerService {
    constructor(configService) {
        this.configService = configService;
        const isProduction = this.configService.isProduction;
        const logLevel = this.configService.logging.level;
        const logFormat = this.configService.logging.format;
        const winstonFormat = logFormat === 'json'
            ? winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), winston_1.format.errors({ stack: true }), winston_1.format.json())
            : winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), winston_1.format.errors({ stack: true }), winston_1.format.printf(({ timestamp, level, message, context, trace, ...meta }) => {
                const levelColor = this.getLevelColor(level);
                const contextStr = context ? chalk.cyan(`[${context}]`) : '';
                const traceStr = trace ? `\n${trace}` : '';
                const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
                return `${chalk.dim(timestamp)} ${levelColor(level.toUpperCase())} ${contextStr} ${message}${metaStr}${traceStr}`;
            }));
        this.logger = (0, winston_1.createLogger)({
            level: logLevel,
            format: winstonFormat,
            transports: [
                new winston_1.transports.Console({
                    silent: this.configService.isTest,
                }),
                ...(isProduction
                    ? [
                        new winston_1.transports.File({
                            filename: 'logs/error.log',
                            level: 'error',
                            maxsize: 10485760,
                            maxFiles: 10,
                        }),
                        new winston_1.transports.File({
                            filename: 'logs/combined.log',
                            maxsize: 10485760,
                            maxFiles: 10,
                        }),
                    ]
                    : []),
            ],
        });
    }
    getLevelColor(level) {
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
    setContext(context) {
        this.context = context;
    }
    log(message, ...optionalParams) {
        this.logger.info(this.formatMessage(message), this.formatMeta(optionalParams));
    }
    error(message, ...optionalParams) {
        const [trace, ...meta] = optionalParams;
        this.logger.error(this.formatMessage(message), {
            trace: trace instanceof Error ? trace.stack : trace,
            ...this.formatMeta(meta),
        });
    }
    warn(message, ...optionalParams) {
        this.logger.warn(this.formatMessage(message), this.formatMeta(optionalParams));
    }
    debug(message, ...optionalParams) {
        this.logger.debug(this.formatMessage(message), this.formatMeta(optionalParams));
    }
    verbose(message, ...optionalParams) {
        this.logger.verbose(this.formatMessage(message), this.formatMeta(optionalParams));
    }
    formatMessage(message) {
        if (typeof message === 'object') {
            try {
                return JSON.stringify(message);
            }
            catch {
                return String(message);
            }
        }
        return String(message);
    }
    formatMeta(params) {
        if (params.length === 0)
            return {};
        if (params.length === 1 && typeof params[0] === 'object') {
            return { context: this.context, ...params[0] };
        }
        return { context: this.context, meta: params };
    }
    logInfo(message, meta) {
        this.logger.info(message, { context: this.context, ...meta });
    }
    logError(message, error, meta) {
        this.logger.error(message, {
            context: this.context,
            trace: error instanceof Error ? error.stack : error,
            ...meta,
        });
    }
    logWarn(message, meta) {
        this.logger.warn(message, { context: this.context, ...meta });
    }
    logDebug(message, meta) {
        this.logger.debug(message, { context: this.context, ...meta });
    }
    logVerbose(message, meta) {
        this.logger.verbose(message, { context: this.context, ...meta });
    }
};
exports.AppLoggerService = AppLoggerService;
exports.AppLoggerService = AppLoggerService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.TRANSIENT }),
    __metadata("design:paramtypes", [config_service_1.AppConfigService])
], AppLoggerService);
//# sourceMappingURL=logger.service.js.map