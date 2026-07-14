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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_service_1 = require("../../config/config.service");
const token_service_1 = require("../services/token.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(prisma, configService, tokenService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.jwt.accessSecret,
        });
        this.prisma = prisma;
        this.configService = configService;
        this.tokenService = tokenService;
    }
    async validate(payload) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    isActive: true,
                    isVerified: true,
                    organizationId: true,
                    branchId: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            isActive: true,
                        },
                    },
                    branch: {
                        select: {
                            id: true,
                            name: true,
                            isActive: true,
                        },
                    },
                },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            if (!user.isActive) {
                throw new common_1.UnauthorizedException('Account is deactivated');
            }
            if (user.organization && !user.organization.isActive) {
                throw new common_1.UnauthorizedException('Organization is deactivated');
            }
            if (user.branch && !user.branch.isActive) {
                throw new common_1.UnauthorizedException('Branch is deactivated');
            }
            return {
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                organizationId: user.organizationId,
                branchId: user.branchId,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                organization: user.organization,
                branch: user.branch,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_service_1.AppConfigService,
        token_service_1.TokenService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map