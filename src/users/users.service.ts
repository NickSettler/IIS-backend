import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../db/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Array<User>> {
    return this.usersRepository.find({
      relations: ['roles', 'roles.permissions'],
    });
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
