import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../../../users/users.service';
import { jwtConstants } from '../../../auth/constants';
import { E_USER_ENTITY_KEYS } from '../../../db/entities/user.entity';

/**
 * JWT (JSON Web Token) Refresh Strategy
 *
 * The strategy will extract the refresh JWT from the request and verify that the signature is valid.
 * It will then invoke our validate() method passing the decoded token to it so that we can access associated user in our request handler.
 * If the token is invalid (e.g. because it has expired) the strategy will throw an error.
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.headers?.refresh;
        },
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: jwtConstants.refreshSecret,
      passReqToCallback: true,
    });
  }

  public async validate(request: Request, payload: any) {
    const refreshToken = request?.cookies?.Refresh || request?.headers?.refresh;
    const user = this.usersService.findWithRefreshToken(refreshToken, {
      [E_USER_ENTITY_KEYS.ID]: payload.userId,
    });

    if (!user) return false;

    return user;
  }
}
