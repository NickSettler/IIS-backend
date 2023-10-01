import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { E_DB_TABLES } from '../constants';

export enum E_USER_ENTITY_KEYS {
  ID = 'id',
  USERNAME = 'username',
  PASSWORD = 'password',
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
}

@Entity({
  name: E_DB_TABLES.USERS,
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  [E_USER_ENTITY_KEYS.ID]: string;

  @Column({
    unique: true,
  })
  [E_USER_ENTITY_KEYS.USERNAME]: string;

  @Column()
  [E_USER_ENTITY_KEYS.PASSWORD]: string;

  @Column()
  [E_USER_ENTITY_KEYS.FIRST_NAME]: string;

  @Column()
  [E_USER_ENTITY_KEYS.LAST_NAME]: string;
}
