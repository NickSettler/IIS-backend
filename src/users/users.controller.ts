import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public getAll() {
    return this.usersService.findAll();
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
