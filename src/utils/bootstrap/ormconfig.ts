import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../../db/entities/user.entity';
import { Role } from '../../db/entities/role.entity';
import { Permission } from '../../db/entities/permission.entity';

config();

export const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: false,
  synchronize: false,
  entities: [User, Role, Permission],
});
