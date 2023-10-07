import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import RolesGuard from '../common/guards/roles.guard';
import { E_USER_ENTITY_KEYS } from '../db/entities/user.entity';
import { E_ROLE_ENTITY_KEYS } from '../db/entities/role.entity';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async getAll() {
    return this.usersService.findAll();
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  public async getMe(@Param('id') id: string) {
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

  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  public async create(@Body() createDto: CreateUserDto) {
    return this.usersService.create(createDto);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  public async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateDto);
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Post('/:id/role/:roleName')
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async addRole(
    @Param('id') id: string,
    @Param('roleName') roleName: string,
  ) {
    return this.usersService.changeRoles(id, roleName, 'ADD');
  }

  @Delete('/:id/role/:roleName')
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async deleteRole(
    @Param('id') id: string,
    @Param('roleName') roleName: string,
  ) {
    return this.usersService.changeRoles(id, roleName, 'ADD');
  }
}
