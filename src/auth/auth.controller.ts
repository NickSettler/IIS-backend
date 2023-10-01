import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/users.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { AuthService } from './auth.service';
import { E_USER_ENTITY_KEYS, User } from '../db/entities/user.entity';
import parse from 'parse-duration';
import { jwtConstants } from './constants';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { hash } from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  private async signIn(@Req() request: Request, @Res() response: Response) {
    const accessCookie = this.authService.generateAccessTokenCookie(
      request.user,
    );
    const refreshCookie = this.authService.generateRefreshTokenCookie(
      request.user,
    );

    await this.usersService.setRefreshToken(
      (request.user as User)[E_USER_ENTITY_KEYS.ID],
      refreshCookie.token,
    );

    response.setHeader('Set-Cookie', [
      accessCookie.cookie,
      refreshCookie.cookie,
    ]);

    return response.send({
      accessToken: accessCookie.token,
      refreshToken: refreshCookie.token,
      expiresIn: parse(jwtConstants.tokenExpiresIn),
    });
  }

  @Post('sign-up')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  public async signUp(
    @Body() registerDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const password = await hash(registerDto[E_USER_ENTITY_KEYS.PASSWORD], 10);

    const user = await this.usersService.create({
      ...registerDto,
      [E_USER_ENTITY_KEYS.PASSWORD]: password,
    });

    const accessToken = this.authService.generateAccessTokenCookie(user);

    const refreshToken = this.authService.generateRefreshTokenCookie(user);

    response.setHeader('Set-Cookie', [accessToken.cookie, refreshToken.cookie]);

    await this.usersService.setRefreshToken(
      user[E_USER_ENTITY_KEYS.ID],
      refreshToken.token,
    );

    return response.send({
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      expiresIn: parse(jwtConstants.tokenExpiresIn),
    });
  }
}
