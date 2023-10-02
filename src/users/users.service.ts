import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { E_USER_ENTITY_KEYS, User } from '../db/entities/user.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './users.dto';
import { E_DB_ERROR_CODES } from '../db/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Find all users
   */
  public async findAll(): Promise<Array<User>> {
    return this.usersRepository.find();
  }

  /**
   * Find one user using options
   * @param options
   */
  public async findOne(options: FindOneOptions<User>): Promise<User | null> {
    return this.usersRepository.findOne(options);
  }

  /**
   * Find a user with refresh token using criteria
   * @param refreshToken refresh token user has
   * @param criteria criteria to find user
   */
  public async findWithRefreshToken(
    refreshToken: string,
    criteria: FindOptionsWhere<User>,
  ): Promise<User | false> {
    const user = await this.findOne({
      where: criteria,
    });

    if (!user) return false;

    if (user[E_USER_ENTITY_KEYS.REFRESH_TOKEN] === refreshToken) return user;
  }

  /**
   * Create a user
   * @param createDto user data
   */
  public async create(createDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createDto);

    return await this.usersRepository.save(user).catch((err: any) => {
      if (err.code === E_DB_ERROR_CODES.UNIQUE_CONSTRAINT)
        throw new ConflictException('User already exists');
      else throw new InternalServerErrorException("Can't create user");
    });
  }

  /**
   * Set refresh token for user
   * @param id user id
   * @param refreshToken refresh token
   */
  public async setRefreshToken(
    id: string,
    refreshToken: string,
  ): Promise<void> {
    await this.usersRepository.update(id, {
      [E_USER_ENTITY_KEYS.REFRESH_TOKEN]: refreshToken,
    });
  }

  /**
   * Delete a user
   * @param id user id
   */
  public async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
