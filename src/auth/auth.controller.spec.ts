import { E_USER_ENTITY_KEYS, User } from '../db/entities/user.entity';
import { E_ROLE, E_ROLE_ENTITY_KEYS, Role } from '../db/entities/role.entity';
import { DataSource, DeepPartial } from 'typeorm';
import { Permission } from '../db/entities/permission.entity';
import { assign, map, omit, values } from 'lodash';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/guards/strategies/jwt.strategy';
import { LocalStrategy } from '../common/guards/strategies/local.strategy';
import { hashSync } from 'bcrypt';
import { UsersModule } from '../users/users.module';
import supertest from 'supertest';

describe('UsersController', () => {
  let app: INestApplication;
  let connection: DataSource;

  const roles = map(values(E_ROLE), (r) => ({
    [E_ROLE_ENTITY_KEYS.NAME]: r,
  }));

  const user: DeepPartial<User> = {
    [E_USER_ENTITY_KEYS.ID]: '88888888-8888-8888-8888-888888888888',
    [E_USER_ENTITY_KEYS.USERNAME]: 'user',
    [E_USER_ENTITY_KEYS.PASSWORD]: 'pass',
    [E_USER_ENTITY_KEYS.FIRST_NAME]: 'name',
    [E_USER_ENTITY_KEYS.LAST_NAME]: 'surname',
    [E_USER_ENTITY_KEYS.REFRESH_TOKEN]: 'token',
  };

  const makeAgent = async (
    wrong = false,
  ): Promise<supertest.SuperAgentTest> => {
    const {
      [E_USER_ENTITY_KEYS.USERNAME]: username,
      [E_USER_ENTITY_KEYS.PASSWORD]: password,
    } = user;

    const agent = request.agent(app.getHttpServer());
    const authResponse = await agent.post('/auth/sign-in').send({
      [E_USER_ENTITY_KEYS.USERNAME]: username,
      [E_USER_ENTITY_KEYS.PASSWORD]: wrong ? `${password}1` : password,
    });

    agent.set('Authorization', `Bearer ${authResponse.body.accessToken}`);

    return agent;
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
        JwtModule.register({
          secret: 'secret',
          signOptions: {
            expiresIn: '60s',
          },
        }),
        UsersModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, LocalStrategy, JwtStrategy],
    }).compile();

    app = module.createNestApplication();

    await app.init();

    connection = await module.resolve(DataSource);

    const manager = connection.createEntityManager();

    await manager.save(Role, roles);

    const usersRepository = manager.getRepository(User);

    await usersRepository.save({
      ...user,
      [E_USER_ENTITY_KEYS.PASSWORD]: hashSync(
        user[E_USER_ENTITY_KEYS.PASSWORD],
        10,
      ),
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    beforeEach(async () => {
      const usersRepository = connection
        .createEntityManager()
        .getRepository(User);

      const foundUser = await usersRepository.findOne({
        where: {
          [E_USER_ENTITY_KEYS.USERNAME]: user[E_USER_ENTITY_KEYS.USERNAME],
        },
      });

      assign(foundUser, {
        [E_USER_ENTITY_KEYS.ROLES]: roles,
      });

      await usersRepository.save(foundUser);
    });

    it('Should return invalid credentials', async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          [E_USER_ENTITY_KEYS.USERNAME]: user[E_USER_ENTITY_KEYS.USERNAME],
          [E_USER_ENTITY_KEYS.PASSWORD]: `${
            user[E_USER_ENTITY_KEYS.PASSWORD]
          }1`,
        });

      expect(authResponse.status).toBe(HttpStatus.UNAUTHORIZED);

      expect(authResponse.body).toEqual({
        error: 'Unauthorized',
        message: 'Invalid credentials',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    });

    it('Should return unauthorized error', async () => {
      const usersResponse = await request(app.getHttpServer()).get('/users');

      expect(usersResponse.status).toBe(HttpStatus.UNAUTHORIZED);

      expect(usersResponse.body).toEqual({
        message: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    });

    it('Should return unauthorized error (no auth header)', async () => {
      const agent = await makeAgent(true);

      const usersResponse = await agent.get('/users');

      expect(usersResponse.status).toBe(HttpStatus.UNAUTHORIZED);

      expect(usersResponse.body).toEqual({
        message: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    });

    it('Should return users array', async () => {
      const agent = await makeAgent(false);

      const usersResponse = await agent.get('/users');

      expect(usersResponse.status).toBe(HttpStatus.OK);

      expect(usersResponse.body).toEqual([
        {
          ...omit(user, [E_USER_ENTITY_KEYS.ROLES]),
          [E_USER_ENTITY_KEYS.PASSWORD]: expect.any(String),
          [E_USER_ENTITY_KEYS.REFRESH_TOKEN]: expect.any(String),
          tempPassword: expect.any(String),
        },
      ]);
    });
  });

  describe('Authorization', () => {
    it('Should return forbidden error', async () => {
      const agent = await makeAgent(false);

      const usersResponse = await agent.get('/users');

      expect(usersResponse.status).toBe(HttpStatus.FORBIDDEN);

      expect(usersResponse.body).toEqual({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: HttpStatus.FORBIDDEN,
      });
    });
  });

  describe('Sign up', () => {
    it('Should sign up', async () => {
      const signUpRequest = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({
          [E_USER_ENTITY_KEYS.USERNAME]: 'user1',
          [E_USER_ENTITY_KEYS.PASSWORD]: 'password',
          [E_USER_ENTITY_KEYS.FIRST_NAME]: 'name',
          [E_USER_ENTITY_KEYS.LAST_NAME]: 'surname',
        });

      expect(signUpRequest.status).toBe(HttpStatus.CREATED);

      expect(signUpRequest.body).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        expiresIn: expect.any(Number),
      });
    });
  });
});
