import { connectionSource } from './ormconfig';
import { hashSync } from 'bcrypt';
import { E_USER_ENTITY_KEYS, User } from '../../db/entities/user.entity';
import * as process from 'process';
import {
  E_ROLE,
  E_ROLE_ENTITY_KEYS,
  Role,
} from '../../db/entities/role.entity';
import { assign } from 'lodash';

const retriesCount = process.env.NODE_ENV === 'test' ? 0 : 50;

export const runMigrations = async () => {
  console.log(`Migrating database...`);
  await connectionSource.runMigrations();
  console.log('Migrated database.');
};

export const insertAdminUser = async () => {
  if (
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_PASSWORD ||
    !process.env.ADMIN_FIRST_NAME ||
    !process.env.ADMIN_LAST_NAME
  )
    throw new Error(
      'ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_FIRST_NAME and ADMIN_LAST_NAME must be set',
    );

  const adminUser = await connectionSource.getRepository(User).findOne({
    where: {
      [E_USER_ENTITY_KEYS.USERNAME]: process.env.ADMIN_USERNAME,
    },
  });

  if (adminUser) return;

  console.log(`Inserting admin user...`);
  await connectionSource.getRepository(User).insert({
    [E_USER_ENTITY_KEYS.USERNAME]: process.env.ADMIN_USERNAME,
    [E_USER_ENTITY_KEYS.PASSWORD]: hashSync(process.env.ADMIN_PASSWORD, 10),
    [E_USER_ENTITY_KEYS.FIRST_NAME]: process.env.ADMIN_FIRST_NAME,
    [E_USER_ENTITY_KEYS.LAST_NAME]: process.env.ADMIN_LAST_NAME,
  });
  console.log('Inserted admin user.');

  console.log('Assigning admin role to admin user...');
  const adminRole = await connectionSource.getRepository(Role).findOne({
    where: {
      [E_ROLE_ENTITY_KEYS.NAME]: E_ROLE.ADMIN,
    },
  });

  const user = await connectionSource.getRepository(User).findOne({
    where: {
      [E_USER_ENTITY_KEYS.USERNAME]: process.env.ADMIN_USERNAME,
    },
  });

  assign(user, {
    [E_USER_ENTITY_KEYS.ROLES]: [adminRole],
  });

  await connectionSource.getRepository(User).save(user);
  console.log('Assigned admin role to admin user.');
};

export const setupDatabase = async (retries = retriesCount) => {
  if (retries === 0) process.exit(1);

  try {
    console.log(`Connecting to database... [${retriesCount - retries}]`);
    await connectionSource.initialize();
    console.log('Connected to database.');

    await runMigrations();
    await insertAdminUser().catch((err) => {
      console.error(err);
      process.exit(1);
    });

    console.log(`Closing database connection...`);
    await connectionSource.destroy();
    console.log('Database connection closed.');

    process.exit();
  } catch (error) {
    console.error(error);
    setTimeout(async () => setupDatabase(retries - 1), 2000);
  }
};

setupDatabase();
