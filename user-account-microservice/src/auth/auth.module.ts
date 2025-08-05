import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './services/auth.service';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [JwtStrategy, AuthService, JwtInterceptor],
  exports: [JwtModule, AuthService, JwtInterceptor],
})
export class AuthModule {} 