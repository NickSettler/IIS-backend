import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { E_USER_ENTITY_KEYS, User } from '../db/entities/user.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { E_ROLE, E_ROLE_ENTITY_KEYS, Role } from '../db/entities/role.entity';
import {
  isEqual,
  unionWith,
  omit,
  differenceWith,
  map,
  assign,
  omitBy,
  isArray,
} from 'lodash';
import { isError } from '../utils/errors';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  /**
   * Find all users
   */
  public async findAll(): Promise<Array<User>> {
    return this.usersRepository.find({
      relations: [E_USER_ENTITY_KEYS.ROLES],
    });
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
    const user = this.usersRepository.create({
      ...createDto,
      ...(createDto[E_USER_ENTITY_KEYS.ROLES]?.length && {
        [E_USER_ENTITY_KEYS.ROLES]: map(
          createDto[E_USER_ENTITY_KEYS.ROLES],
          (r) => ({
            [E_ROLE_ENTITY_KEYS.NAME]: r,
          }),
        ),
      }),
    });

    return await this.usersRepository.save(user).catch((err: any) => {
      if (isError(err, 'UNIQUE_CONSTRAINT'))
        throw new ConflictException('User already exists');

      throw new InternalServerErrorException("Can't create user");
    });
  }

  /**
   * Update a user
   * @param id user id
   * @param updateDto user data
   */
  public async update(id: string, updateDto: UpdateUserDto) {
    const user: User = await this.usersRepository.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    assign(user, omitBy(updateDto, isArray));

    await this.usersRepository.save({
      ...user,
      ...(updateDto[E_USER_ENTITY_KEYS.ROLES]?.length && {
        [E_USER_ENTITY_KEYS.ROLES]: map(
          updateDto[E_USER_ENTITY_KEYS.ROLES],
          (r) => ({
            [E_ROLE_ENTITY_KEYS.NAME]: r,
          }),
        ),
      }),
    });

    return this.usersRepository.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: id,
      },
      relations: [
        E_USER_ENTITY_KEYS.ROLES,
        `${E_USER_ENTITY_KEYS.ROLES}.${E_ROLE_ENTITY_KEYS.PERMISSIONS}`,
      ],
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
    const user = await this.usersRepository.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.usersRepository.delete(id);
  }

  /**
   * Change roles of a user
   * @param id user id
   * @param roleName role name
   * @param action action to perform (ADD or REMOVE)
   */
  public async changeRoles(
    id: string,
    roleName: E_ROLE,
    action: 'ADD' | 'REMOVE',
  ) {
    const user = await this.usersRepository.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: id,
      },
      relations: [E_USER_ENTITY_KEYS.ROLES],
    });

    if (!user) throw new NotFoundException('User not found');

    const role = await this.rolesRepository.findOne({
      where: {
        [E_ROLE_ENTITY_KEYS.NAME]: roleName,
      },
    });

    if (!role) throw new NotFoundException('Role not found');

    const newRoles =
      action === 'ADD'
        ? unionWith(
            [
              ...map(user[E_USER_ENTITY_KEYS.ROLES], (r) =>
                omit(r, E_ROLE_ENTITY_KEYS.PERMISSIONS),
              ),
              {
                [E_ROLE_ENTITY_KEYS.NAME]: roleName,
              },
            ],
            isEqual,
          )
        : differenceWith(
            [
              ...map(user[E_USER_ENTITY_KEYS.ROLES], (r) =>
                omit(r, E_ROLE_ENTITY_KEYS.PERMISSIONS),
              ),
            ],
            [{ [E_ROLE_ENTITY_KEYS.NAME]: roleName }],
            isEqual,
          );

    await this.usersRepository.save({
      ...user,
      [E_USER_ENTITY_KEYS.ROLES]: newRoles,
    });

    return this.usersRepository.findOne({
      where: {
        [E_USER_ENTITY_KEYS.ID]: id,
      },
      relations: [
        E_USER_ENTITY_KEYS.ROLES,
        `${E_USER_ENTITY_KEYS.ROLES}.${E_ROLE_ENTITY_KEYS.PERMISSIONS}`,
      ],
    });
  }
}
