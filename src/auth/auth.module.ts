import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtRefreshStrategy } from '../common/guards/strategies/jwt-refresh.strategy';
import { JwtStrategy } from '../common/guards/strategies/jwt.strategy';
import { LocalStrategy } from '../common/guards/strategies/local.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.tokenSecret,
      signOptions: {
        expiresIn: jwtConstants.tokenExpiresIn,
      },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    SessionSerializer,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
