import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { SecurityService } from './services/security.service';
import { PasswordService } from './services/password.service';
import { EmailService } from './services/email.service';
import { RedisService } from './services/redis.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { AppConfigModule } from '../config/config.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    PrismaModule,
    AppConfigModule,
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    SecurityService,
    PasswordService,
    EmailService,
    RedisService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService, TokenService, SecurityService, PasswordService],
})
export class AuthModule {}