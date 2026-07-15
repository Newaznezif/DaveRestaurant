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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'stdout', level: 'info' },
                { emit: 'stdout', level: 'warn' },
                { emit: 'stdout', level: 'error' },
            ],
            errorFormat: 'colorless',
        });
        this.logger = new common_1.Logger(PrismaService_1.name);
    }
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Database connection established');
            this.$on('query', (e) => {
                if (process.env.NODE_ENV === 'development') {
                    this.logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms`);
                }
            });
        }
        catch (error) {
            this.logger.warn(`Database connection failed: ${error.message}`);
            this.logger.warn('Application will continue but database operations will fail until connection is established');
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Database connection closed');
    }
    async cleanDatabase() {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Cannot clean database in production');
        }
        const modelNames = Object.keys(this).filter((key) => key.startsWith('$') === false && key.startsWith('_') === false);
        return Promise.all(modelNames.map((modelName) => {
            return this[modelName].deleteMany();
        }));
    }
    async executeInTransaction(fn) {
        return this.$transaction(fn);
    }
    async paginate(model, query, options = {}) {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;
        const orderBy = options.sortBy
            ? { [options.sortBy]: options.sortOrder || 'asc' }
            : { createdAt: 'desc' };
        const [data, total] = await Promise.all([
            this[model].findMany({
                where: query,
                skip,
                take: limit,
                orderBy,
                include: options.include,
            }),
            this[model].count({ where: query }),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            data: data,
            meta: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map