import {
  Body,
  Controller,
  Delete,
  Get,
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
import { E_ROLE_ENTITY_KEYS } from '../db/entities/role.entity';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Request } from 'express';
import DeleteAdminGuard from '../common/guards/delete-admin.guard';
import PermissionsGuard from '../common/guards/permissions.guard';
import { E_PERMISSION } from '../db/entities/permission.entity';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(E_PERMISSION.EDIT_USER)
  public async getAll(): Promise<Array<User>> {
    return this.usersService.findAll();
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(E_PERMISSION.EDIT_USER)
  public async getOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: id,
      },
      relations: [
        E_USER_ENTITY_KEYS.ROLES,
        `${E_USER_ENTITY_KEYS.ROLES}.${E_ROLE_ENTITY_KEYS.PERMISSIONS}`,
      ],
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @UsePipes(ValidationPipe)
  @Permissions(E_PERMISSION.EDIT_USER)
  public async create(@Body() createDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createDto);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @UsePipes(ValidationPipe)
  @Permissions(E_PERMISSION.EDIT_USER)
  public async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateDto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard, DeleteAdminGuard)
  @Permissions(E_PERMISSION.EDIT_USER)
  public async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }

  @Post('/:id/role/:roleName')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(E_PERMISSION.EDIT_USER)
  public async addRole(
    @Param('id') id: string,
    @Param('roleName') roleName: string,
  ): Promise<User> {
    return this.usersService.changeRoles(id, roleName, 'ADD');
  }

  @Delete('/:id/role/:roleName')
  @UseGuards(JwtAuthGuard, PermissionsGuard, DeleteAdminGuard)
  @Permissions(E_PERMISSION.EDIT_USER)
  public async deleteRole(
    @Param('id') id: string,
    @Param('roleName') roleName: string,
  ): Promise<User> {
    return this.usersService.changeRoles(id, roleName, 'REMOVE');
  }
}
