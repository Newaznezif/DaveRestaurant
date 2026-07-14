import { PrismaService } from './prisma/prisma.service';
import { AppConfigService } from './config/config.service';
export declare class HealthController {
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    private readonly startTime;
    constructor(prisma: PrismaService, configService: AppConfigService);
    check(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        services: {
            database: {
                status: string;
                latency?: string;
                error?: string;
            } | {
                status: string;
                heapUsed: string;
                heapTotal: string;
                rss: string;
            } | {
                status: string;
                uptime: number;
                startedAt: string;
            };
            memory: {
                status: string;
                latency?: string;
                error?: string;
            } | {
                status: string;
                heapUsed: string;
                heapTotal: string;
                rss: string;
            } | {
                status: string;
                uptime: number;
                startedAt: string;
            };
            uptime: {
                status: string;
                latency?: string;
                error?: string;
            } | {
                status: string;
                heapUsed: string;
                heapTotal: string;
                rss: string;
            } | {
                status: string;
                uptime: number;
                startedAt: string;
            };
        };
        version: string;
        environment: string;
    }>;
    liveness(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
    }>;
    readiness(): Promise<{
        status: string;
        timestamp: string;
        services: {
            database: {
                status: string;
                latency?: string;
                error?: string;
            };
        };
    }>;
    private checkDatabase;
    private checkMemory;
    private checkUptime;
}
