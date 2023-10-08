import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { E_USER_ENTITY_KEYS, User } from '../db/entities/user.entity';
import { UsersService } from '../users/users.service';
import { compareSync } from 'bcrypt';
import { jwtConstants } from './constants';
import parse from 'parse-duration';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validate user by username and password
   * @param username username
   * @param password password
   */
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

  /**
   * Generate access token cookie
   * @param user user entity
   */
  public generateAccessTokenCookie(user: any) {
    const payload = { userId: user[E_USER_ENTITY_KEYS.ID] };

    const token = this.jwtService.sign(payload);

    const expires = new Date(
      Date.now() + parse(jwtConstants.tokenExpiresIn),
    ).toUTCString();

    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.tokenExpiresIn}; Expires=${expires}`;

    return {
      cookie,
      token,
    };
  }

  /**
   * Generate refresh token cookie
   * @param user user entity
   */
  public generateRefreshTokenCookie(user: any) {
    const payload = { userId: user[E_USER_ENTITY_KEYS.ID] };

    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: jwtConstants.refreshExpiresIn,
    });

    const expires = new Date(
      Date.now() + parse(jwtConstants.tokenExpiresIn),
    ).toUTCString();

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.refreshExpiresIn}; Expires=${expires}`;

    return {
      cookie,
      token,
    };
  }
}
