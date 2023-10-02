import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  public async getAll() {
    return this.usersService.findAll();
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
