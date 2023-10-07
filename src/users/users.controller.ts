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
import RolesGuard from '../common/guards/roles.guard';
import { E_USER_ENTITY_KEYS, User } from '../db/entities/user.entity';
import { E_ROLE, E_ROLE_ENTITY_KEYS } from '../db/entities/role.entity';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { Roles } from '../common/decorators/roles.decorator';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(E_ROLE.ADMIN)
  public async getAll() {
    return this.usersService.findAll();
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  public async getMe(@Req() request: Request) {
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(E_ROLE.ADMIN)
  public async getOne(@Param('id') id: string) {
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(E_ROLE.ADMIN)
  public async create(@Body() createDto: CreateUserDto) {
    return this.usersService.create(createDto);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @Roles(E_ROLE.ADMIN)
  public async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateDto);
  }

  @Delete('/:id')
  @Roles(E_ROLE.ADMIN)
  public async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Post('/:id/role/:roleName')
  @Roles(E_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async addRole(
    @Param('id') id: string,
    @Param('roleName') roleName: string,
  ) {
    return this.usersService.changeRoles(id, roleName, 'ADD');
  }

  @Delete('/:id/role/:roleName')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(E_ROLE.ADMIN)
  public async deleteRole(
    @Param('id') id: string,
    @Param('roleName') roleName: string,
  ) {
    return this.usersService.changeRoles(id, roleName, 'REMOVE');
  }
}
