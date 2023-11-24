import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { E_USER_ENTITY_KEYS, User } from '../db/entities/user.entity';
import { E_ROLE, E_ROLE_ENTITY_KEYS } from '../db/entities/role.entity';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Request } from 'express';
import DeleteAdminGuard from '../common/guards/delete-admin.guard';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { E_ACTION } from '../casl/actions';
import { handleCustomError, isCustomError, isError } from '../utils/errors';
import { filter } from 'lodash';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getAll(@Req() request: Request): Promise<Array<User>> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, User))
      throw new ForbiddenException("You don't have permission to read users");

    return filter(await this.usersService.findAll(), (user) =>
      rules.can(E_ACTION.READ, user),
    );
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  public async getMe(@Req() request: Request): Promise<User> {
    const user = request.user as User;

    return this.usersService.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: user[E_USER_ENTITY_KEYS.ID],
      },
      relations: [
        E_USER_ENTITY_KEYS.ROLES,
        `${E_USER_ENTITY_KEYS.ROLES}.${E_ROLE_ENTITY_KEYS.PERMISSIONS}`,
      ],
    });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  public async getOne(
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<User> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.READ, User))
      throw new ForbiddenException("You don't have permission to read users");

    const foundUser = await this.usersService.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: id,
      },
      relations: [
        E_USER_ENTITY_KEYS.ROLES,
        `${E_USER_ENTITY_KEYS.ROLES}.${E_ROLE_ENTITY_KEYS.PERMISSIONS}`,
      ],
    });

    if (!foundUser) throw new ForbiddenException('User not found');

    if (rules.cannot(E_ACTION.READ, foundUser))
      throw new ForbiddenException("You don't have permission to read users");

    return foundUser;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  public async create(
    @Req() request: Request,
    @Body() createDto: CreateUserDto,
  ): Promise<User> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.CREATE, User))
      throw new ForbiddenException("You don't have permission to create user");

    const createdUser = await this.usersService
      .create(createDto)
      .catch((err: any) => {
        if (isError(err, 'UNIQUE_CONSTRAINT'))
          throw new ConflictException('User already exists');
        else if (isCustomError(err))
          throw new HttpException(...handleCustomError(err));

        throw new InternalServerErrorException("Can't create user");
      });

    const foundUser = await this.usersService.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: createdUser[E_USER_ENTITY_KEYS.ID],
      },
      relations: [
        E_USER_ENTITY_KEYS.ROLES,
        `${E_USER_ENTITY_KEYS.ROLES}.${E_ROLE_ENTITY_KEYS.PERMISSIONS}`,
      ],
    });

    if (rules.cannot(E_ACTION.READ, foundUser))
      throw new ForbiddenException("You don't have permission to read users");

    return foundUser;
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  public async update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
  ): Promise<User> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.UPDATE, User))
      throw new ForbiddenException("You don't have permission to update user");

    const user = await this.usersService.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    if (rules.cannot(E_ACTION.UPDATE, user))
      throw new ForbiddenException("You don't have permission to update user");

    const updatedUser = await this.usersService
      .update(id, updateDto)
      .catch((err: any) => {
        if (isCustomError(err))
          throw new HttpException(...handleCustomError(err));

        throw new InternalServerErrorException("Can't update user");
      });

    const foundUser = await this.usersService.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: updatedUser[E_USER_ENTITY_KEYS.ID],
      },
      relations: [
        E_USER_ENTITY_KEYS.ROLES,
        `${E_USER_ENTITY_KEYS.ROLES}.${E_ROLE_ENTITY_KEYS.PERMISSIONS}`,
      ],
    });

    if (rules.cannot(E_ACTION.READ, foundUser))
      throw new ForbiddenException("You don't have permission to read users");

    return foundUser;
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, DeleteAdminGuard)
  public async delete(
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<void> {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.DELETE, User))
      throw new ForbiddenException("You don't have permission to delete user");

    const user = await this.usersService.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    if (rules.cannot(E_ACTION.DELETE, user))
      throw new ForbiddenException("You don't have permission to delete user");

    return this.usersService.delete(id).catch((err: any) => {
      if (isCustomError(err))
        throw new HttpException(...handleCustomError(err));

      throw new InternalServerErrorException("Can't update user");
    });
  }

  @Post('/:id/role/:roleName')
  @UseGuards(JwtAuthGuard)
  public async addRole(
    @Req() request: Request,
    @Param('id') id: string,
    @Param('roleName') roleName: E_ROLE,
  ): Promise<User> {
    await this.rolePreCheck(request, id);

    return this.usersService.changeRoles(id, roleName, 'ADD');
  }

  @Delete('/:id/role/:roleName')
  @UseGuards(JwtAuthGuard, DeleteAdminGuard)
  public async deleteRole(
    @Req() request: Request,
    @Param('id') id: string,
    @Param('roleName') roleName: E_ROLE,
  ): Promise<User> {
    await this.rolePreCheck(request, id);

    return this.usersService.changeRoles(id, roleName, 'REMOVE');
  }

  private async rolePreCheck(request: Request, id: string) {
    const rules = this.caslAbilityFactory.createForUser(request.user as User);

    if (rules.cannot(E_ACTION.UPDATE, User, E_USER_ENTITY_KEYS.ROLES))
      throw new ForbiddenException("You don't have permission to update user");

    const foundUser = await this.usersService.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: id,
      },
    });

    if (!foundUser) throw new NotFoundException('User not found');

    if (rules.cannot(E_ACTION.UPDATE, foundUser, E_USER_ENTITY_KEYS.ROLES))
      throw new ForbiddenException("You don't have permission to update user");
  }
}
