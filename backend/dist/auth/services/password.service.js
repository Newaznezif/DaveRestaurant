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
var PasswordService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const common_1 = require("@nestjs/common");
const argon2 = require("argon2");
const security_service_1 = require("./security.service");
let PasswordService = PasswordService_1 = class PasswordService {
    constructor(securityService) {
        this.securityService = securityService;
        this.logger = new common_1.Logger(PasswordService_1.name);
    }
    async hashPassword(password) {
        try {
            return await argon2.hash(password, {
                type: argon2.argon2id,
                memoryCost: 65536,
                timeCost: 3,
                parallelism: 1,
            });
        }
        catch (error) {
            this.logger.error('Failed to hash password', error);
            throw new common_1.BadRequestException('Password hashing failed');
        }
    }
    async verifyPassword(password, hash) {
        try {
            return await argon2.verify(hash, password);
        }
        catch (error) {
            this.logger.error('Failed to verify password', error);
            return false;
        }
    }
    validatePasswordStrength(password) {
        return this.securityService.validatePasswordStrength(password);
    }
    async isPasswordCompromised(password) {
        return this.securityService.isPasswordCompromised(password);
    }
    generateSecureToken(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        const randomValues = new Uint8Array(length);
        crypto.getRandomValues(randomValues);
        for (let i = 0; i < length; i++) {
            token += chars[randomValues[i] % chars.length];
        }
        return token;
    }
    generateOTP(length = 6) {
        const chars = '0123456789';
        let otp = '';
        const randomValues = new Uint8Array(length);
        crypto.getRandomValues(randomValues);
        for (let i = 0; i < length; i++) {
            otp += chars[randomValues[i] % chars.length];
        }
        return otp;
    }
    async hashPasswordWithArgon2(password) {
        return this.hashPassword(password);
    }
    async verifyPasswordWithArgon2(password, hash) {
        return this.verifyPassword(password, hash);
    }
};
exports.PasswordService = PasswordService;
exports.PasswordService = PasswordService = PasswordService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [security_service_1.SecurityService])
], PasswordService);
//# sourceMappingURL=password.service.js.map