"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const organization_module_1 = require("./organization/organization.module");
const branch_module_1 = require("./branch/branch.module");
const menu_module_1 = require("./menu/menu.module");
const orders_module_1 = require("./orders/orders.module");
const tables_module_1 = require("./tables/tables.module");
const reservations_module_1 = require("./reservations/reservations.module");
const payments_module_1 = require("./payments/payments.module");
const inventory_module_1 = require("./inventory/inventory.module");
const suppliers_module_1 = require("./suppliers/suppliers.module");
const employees_module_1 = require("./employees/employees.module");
const analytics_module_1 = require("./analytics/analytics.module");
const notifications_module_1 = require("./notifications/notifications.module");
const delivery_module_1 = require("./delivery/delivery.module");
const crm_module_1 = require("./crm/crm.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const coupons_module_1 = require("./coupons/coupons.module");
const reviews_module_1 = require("./reviews/reviews.module");
const reports_module_1 = require("./reports/reports.module");
const chat_module_1 = require("./chat/chat.module");
const config_module_1 = require("./config/config.module");
const logger_module_1 = require("./logger/logger.module");
const config_service_1 = require("./config/config.service");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const health_controller_1 = require("./health.controller");
const tenant_middleware_1 = require("./common/middleware/tenant.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(tenant_middleware_1.TenantMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.local'],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_module_1.AppConfigModule],
                inject: [config_service_1.AppConfigService],
                useFactory: (configService) => [
                    {
                        ttl: configService.throttle.ttl,
                        limit: configService.throttle.limit,
                    },
                ],
            }),
            config_module_1.AppConfigModule,
            logger_module_1.AppLoggerModule,
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            organization_module_1.OrganizationModule,
            branch_module_1.BranchModule,
            menu_module_1.MenuModule,
            orders_module_1.OrdersModule,
            tables_module_1.TablesModule,
            reservations_module_1.ReservationsModule,
            payments_module_1.PaymentsModule,
            inventory_module_1.InventoryModule,
            suppliers_module_1.SuppliersModule,
            employees_module_1.EmployeesModule,
            analytics_module_1.AnalyticsModule,
            notifications_module_1.NotificationsModule,
            delivery_module_1.DeliveryModule,
            crm_module_1.CrmModule,
            subscriptions_module_1.SubscriptionsModule,
            coupons_module_1.CouponsModule,
            reviews_module_1.ReviewsModule,
            reports_module_1.ReportsModule,
            chat_module_1.ChatModule,
        ],
        controllers: [health_controller_1.HealthController],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: all_exceptions_filter_1.AllExceptionsFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map