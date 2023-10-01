import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../../../users/users.service';
import { E_USER_ENTITY_KEYS } from '../../../db/entities/user.entity';
import { jwtConstants } from '../../../auth/constants';
import { E_DB_TABLES } from '../../../db/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          return request?.cookies?.Authentication;
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
      relations: [E_DB_TABLES.ROLES],
    });
  }
}
