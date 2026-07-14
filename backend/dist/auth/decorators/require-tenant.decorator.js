"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireTenant = exports.TENANT_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.TENANT_KEY = 'tenant';
const RequireTenant = () => (0, common_1.SetMetadata)(exports.TENANT_KEY, true);
exports.RequireTenant = RequireTenant;
//# sourceMappingURL=require-tenant.decorator.js.map