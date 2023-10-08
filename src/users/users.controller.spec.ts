import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { E_USER_ENTITY_KEYS, User } from '../db/entities/user.entity';
import { E_ROLE, E_ROLE_ENTITY_KEYS, Role } from '../db/entities/role.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { Permission } from '../db/entities/permission.entity';
import { filter, map, omit, values } from 'lodash';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { createRequest } from 'node-mocks-http';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { expectOnlyNested, expectWithoutNested } from '../../test/helpers';

describe('UsersController', () => {
  let connection: DataSource;

  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;

  let usersController: UsersController;

  const roles = map(values(E_ROLE), (r) => ({
    [E_ROLE_ENTITY_KEYS.NAME]: r,
    [E_ROLE_ENTITY_KEYS.PERMISSIONS]: [],
  }));

  const user: DeepPartial<User> = {
    [E_USER_ENTITY_KEYS.ID]: '88888888-8888-8888-8888-888888888888',
    [E_USER_ENTITY_KEYS.USERNAME]: 'user',
    [E_USER_ENTITY_KEYS.PASSWORD]: 'pass',
    [E_USER_ENTITY_KEYS.FIRST_NAME]: 'name',
    [E_USER_ENTITY_KEYS.LAST_NAME]: 'surname',
    [E_USER_ENTITY_KEYS.REFRESH_TOKEN]: 'token',
    [E_USER_ENTITY_KEYS.ROLES]: roles,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [User, Role, Permission],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([User, Role, Permission]),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    connection = await module.resolve(DataSource);

    userRepository = connection.getRepository(User);
    roleRepository = connection.getRepository(Role);

    usersController = module.get<UsersController>(UsersController);

    await roleRepository.save(roles);
    await userRepository.save(userRepository.create(user));
  });

  afterEach(async () => {
    await userRepository.clear();
    await roleRepository.clear();

    await connection.destroy();
  });

  describe('Find', () => {
    it('should return an array of users', async () => {
      const result = map(await usersController.getAll(), (u) =>
        plainToInstance(User, u),
      );

      const expected = plainToInstance(
        User,
        omit(user, [E_USER_ENTITY_KEYS.ROLES]),
      );

      expect(result).toHaveLength(1);

      expect(result).toEqual([expected]);
    });

    it('should return a user', async () => {
      const result = plainToInstance(
        User,
        await usersController.getOne(user[E_USER_ENTITY_KEYS.ID]),
      );

      const expected = plainToInstance(User, user);

      expectWithoutNested(result, expected, [E_USER_ENTITY_KEYS.ROLES]);

      expectOnlyNested(result, expected, {
        [E_USER_ENTITY_KEYS.ROLES]: E_ROLE_ENTITY_KEYS.NAME,
      });
    });

    it('should return a logged in user', async () => {
      const request = createRequest({
        user,
      });

      const result = instanceToPlain(await usersController.getMe(request));

      const expected = plainToInstance(User, user);

      expectWithoutNested(result, expected, [E_USER_ENTITY_KEYS.ROLES]);

      expectOnlyNested(result, expected, {
        [E_USER_ENTITY_KEYS.ROLES]: E_ROLE_ENTITY_KEYS.NAME,
      });
    });
  });

  describe('Create', () => {
    it('should create a user', async () => {
      const newUser = {
        [E_USER_ENTITY_KEYS.USERNAME]: 'test1',
        [E_USER_ENTITY_KEYS.PASSWORD]: 'test',
        [E_USER_ENTITY_KEYS.FIRST_NAME]: 'test',
        [E_USER_ENTITY_KEYS.LAST_NAME]: 'test',
      };

      const result = instanceToPlain(await usersController.create(newUser));

      const expected = plainToInstance(User, newUser);

      expect(result).toEqual({
        [E_USER_ENTITY_KEYS.ID]: expect.any(String),
        ...expected,
      });

      const all = map(await usersController.getAll(), instanceToPlain);

      expect(all).toEqual([
        omit(plainToInstance(User, user), [E_USER_ENTITY_KEYS.ROLES]),
        plainToInstance(User, result),
      ]);
    });

    it('should not create a user (unique violation)', async () => {
      const newUser = {
        [E_USER_ENTITY_KEYS.USERNAME]: 'user',
        [E_USER_ENTITY_KEYS.PASSWORD]: 'test',
        [E_USER_ENTITY_KEYS.FIRST_NAME]: 'test',
        [E_USER_ENTITY_KEYS.LAST_NAME]: 'test',
      };

      await expect(usersController.create(newUser)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should not create a user (bad request)', async () => {
      const newUser = {
        [E_USER_ENTITY_KEYS.USERNAME]: 'test1',
        [E_USER_ENTITY_KEYS.PASSWORD]: 'test',
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // TODO: fix sqlite throwing conflict error instead of bad request (unique violation == not null violation)
      await expect(usersController.create(newUser)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('Update', () => {
    it('should update a user', async () => {
      const payload = {
        [E_USER_ENTITY_KEYS.FIRST_NAME]: 'test',
      };

      const result = instanceToPlain(
        await usersController.update(user[E_USER_ENTITY_KEYS.ID], payload),
      );

      const expected = plainToInstance(User, {
        ...user,
        ...payload,
      });

      expectWithoutNested(result, expected, [E_USER_ENTITY_KEYS.ROLES]);

      expectOnlyNested(result, expected, {
        [E_USER_ENTITY_KEYS.ROLES]: E_ROLE_ENTITY_KEYS.NAME,
      });
    });

    it('should not update a user (not found)', async () => {
      await expect(
        usersController.update(`${user[E_USER_ENTITY_KEYS.ID]}1`, {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Delete', () => {
    it('should delete a user', async () => {
      await usersController.delete(user[E_USER_ENTITY_KEYS.ID]);

      const all = map(await usersController.getAll(), instanceToPlain);

      expect(all).toEqual([]);
    });

    it('should not delete a user (not found)', async () => {
      await expect(
        usersController.delete(`${user[E_USER_ENTITY_KEYS.ID]}1`),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('User roles', () => {
    it('should delete a role', async () => {
      const result = instanceToPlain(
        await usersController.deleteRole(
          user[E_USER_ENTITY_KEYS.ID],
          E_ROLE.ADMIN,
        ),
      );

      const expected = plainToInstance(User, {
        ...user,
        [E_USER_ENTITY_KEYS.ROLES]: filter(
          roles,
          (r) => r[E_ROLE_ENTITY_KEYS.NAME] !== E_ROLE.ADMIN,
        ),
      });

      expectWithoutNested(result, expected, [E_USER_ENTITY_KEYS.ROLES]);

      expectOnlyNested(result, expected, {
        [E_USER_ENTITY_KEYS.ROLES]: E_ROLE_ENTITY_KEYS.NAME,
      });
    });

    it('should not delete a role (user not found)', async () => {
      await expect(
        usersController.deleteRole(
          `${user[E_USER_ENTITY_KEYS.ID]}1`,
          E_ROLE.ADMIN,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not delete a role (role not found)', async () => {
      await expect(
        usersController.deleteRole(
          user[E_USER_ENTITY_KEYS.ID],
          `${E_ROLE.ADMIN}1`,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should assign a role', async () => {
      await usersController.deleteRole(
        user[E_USER_ENTITY_KEYS.ID],
        E_ROLE.ADMIN,
      );

      const result = instanceToPlain(
        await usersController.addRole(
          user[E_USER_ENTITY_KEYS.ID],
          E_ROLE.ADMIN,
        ),
      );

      const expected = plainToInstance(User, user);

      expectWithoutNested(result, expected, [E_USER_ENTITY_KEYS.ROLES]);

      expectOnlyNested(result, expected, {
        [E_USER_ENTITY_KEYS.ROLES]: E_ROLE_ENTITY_KEYS.NAME,
      });
    });
  });
});
