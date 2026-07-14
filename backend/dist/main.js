"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet = require("helmet");
const compression = require("compression");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const timeout_interceptor_1 = require("./common/interceptors/timeout.interceptor");
const config_service_1 = require("./config/config.service");
const core_2 = require("@nestjs/core");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    const logger = new common_1.Logger('Bootstrap');
    const configService = app.get(config_service_1.AppConfigService);
    app.use(helmet.default());
    app.enableCors({
        origin: configService.cors.origins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Organization-Id', 'X-Branch-Id', 'X-Correlation-Id'],
        exposedHeaders: ['X-Correlation-Id'],
    });
    app.use(compression());
    app.setGlobalPrefix(configService.apiGlobalPrefix, {
        exclude: ['health', 'health/*', 'docs', 'docs/*'],
    });
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        disableErrorMessages: configService.isProduction,
    }));
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new transform_interceptor_1.TransformInterceptor(), new timeout_interceptor_1.TimeoutInterceptor(app.get(core_2.Reflector)));
    if (configService.swagger.enabled) {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle(configService.swagger.title)
            .setDescription(configService.swagger.description)
            .setVersion(configService.swagger.version)
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT access token',
            in: 'header',
        }, 'JWT-auth')
            .addApiKey({
            type: 'apiKey',
            name: 'X-API-Key',
            in: 'header',
            description: 'API key for external service access',
        }, 'ApiKey')
            .addTag('Auth', 'Authentication endpoints')
            .addTag('Users', 'User management')
            .addTag('Organizations', 'Organization management')
            .addTag('Branches', 'Branch management')
            .addTag('Menu', 'Menu and product management')
            .addTag('Orders', 'Order management')
            .addTag('Tables', 'Table management')
            .addTag('Reservations', 'Reservation management')
            .addTag('Payments', 'Payment processing')
            .addTag('Inventory', 'Inventory management')
            .addTag('Suppliers', 'Supplier management')
            .addTag('Employees', 'Employee management')
            .addTag('Analytics', 'Analytics and reports')
            .addTag('Notifications', 'Notification management')
            .addTag('Delivery', 'Delivery management')
            .addTag('CRM', 'Customer relationship management')
            .addTag('System', 'System health and monitoring')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('docs', app, document);
        logger.log(`Swagger docs available at /docs`);
    }
    const port = configService.port;
    await app.listen(port);
    logger.log(`Server running on http://localhost:${port}`);
    logger.log(`API available at http://localhost:${port}/${configService.apiGlobalPrefix}`);
    logger.log(`Environment: ${configService.nodeEnv}`);
}
bootstrap().catch((error) => {
    const logger = new common_1.Logger('Bootstrap');
    logger.error('Failed to start application', error.stack);
    process.exit(1);
});
//# sourceMappingURL=main.js.map