import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../../../users/users.service';
import { E_USER_ENTITY_KEYS } from '../../../db/entities/user.entity';
import { jwtConstants } from '../../../auth/constants';
import { E_ROLE_ENTITY_KEYS } from '../../../db/entities/role.entity';

/**
 * JWT (JSON Web Token) Strategy
 *
 * The strategy will extract the JWT from the request and verify that the signature is valid.
 * It will then invoke our validate() method passing the decoded token to it so that we can access associated user in our request handler.
 * If the token is invalid (e.g. because it has expired) the strategy will throw an error.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          return request.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.tokenSecret,
    });
  }

  public async validate(payload: any) {
    return this.usersService.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: payload.userId,
      },
      relations: [
        E_USER_ENTITY_KEYS.ROLES,
        `${E_USER_ENTITY_KEYS.ROLES}.${E_ROLE_ENTITY_KEYS.PERMISSIONS}`,
      ],
    });
  }
}
