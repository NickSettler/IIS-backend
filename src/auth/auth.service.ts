import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { E_USER_ENTITY_KEYS, User } from '../db/entities/user.entity';
import { UsersService } from '../users/users.service';
import { compareSync } from 'bcrypt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOne({
      where: {
        [E_USER_ENTITY_KEYS.USERNAME]: username,
      },
    });

    if (user && compareSync(password, user[E_USER_ENTITY_KEYS.PASSWORD])) {
      return user;
    }

    return null;
  }

  public generateAccessTokenCookie(user: any) {
    const payload = { userId: user[E_USER_ENTITY_KEYS.ID] };

    const token = this.jwtService.sign(payload);

    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.tokenExpiresIn}`;

    return {
      cookie,
      token,
    };
  }

  public generateRefreshTokenCookie(user: any) {
    const payload = { userId: user[E_USER_ENTITY_KEYS.ID] };

    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: jwtConstants.refreshExpiresIn,
    });

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.refreshExpiresIn}`;

    return {
      cookie,
      token,
    };
  }
}
