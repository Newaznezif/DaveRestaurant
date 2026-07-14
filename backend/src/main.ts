import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { AppConfigService } from './config/config.service';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = new Logger('Bootstrap');
  const configService = app.get(AppConfigService);

  // Security headers
  app.use(helmet.default());

  // CORS configuration
  app.enableCors({
    origin: configService.cors.origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Organization-Id', 'X-Branch-Id', 'X-Correlation-Id'],
    exposedHeaders: ['X-Correlation-Id'],
  });

  // Compression
  app.use(compression());

  // Global API prefix with versioning
  app.setGlobalPrefix(configService.apiGlobalPrefix, {
    exclude: ['health', 'health/*', 'docs', 'docs/*'],
  });

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: configService.isProduction,
    }),
  );

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new TimeoutInterceptor(app.get(Reflector)),
  );

  // Swagger documentation
  if (configService.swagger.enabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(configService.swagger.title)
      .setDescription(configService.swagger.description)
      .setVersion(configService.swagger.version)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT access token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addApiKey(
        {
          type: 'apiKey',
          name: 'X-API-Key',
          in: 'header',
          description: 'API key for external service access',
        },
        'ApiKey',
      )
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

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
    logger.log(`Swagger docs available at /docs`);
  }

  // Start server
  const port = configService.port;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
  logger.log(`API available at http://localhost:${port}/${configService.apiGlobalPrefix}`);
  logger.log(`Environment: ${configService.nodeEnv}`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application', error.stack);
  process.exit(1);
});