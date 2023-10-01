import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { E_DB_TABLES } from '../constants';
import { E_PERMISSION_ENTITY_KEYS, Permission } from './permission.entity';

export enum E_ROLE_ENTITY_KEYS {
  ID = 'id',
  NAME = 'name',
  PERMISSIONS = 'permissions',
}

@Entity({ name: E_DB_TABLES.ROLES })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  [E_ROLE_ENTITY_KEYS.ID]: string;

  @Column()
  [E_ROLE_ENTITY_KEYS.NAME]: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: E_DB_TABLES.ROLE_PERMISSIONS,
    joinColumn: {
      name: 'role_id',
      referencedColumnName: E_ROLE_ENTITY_KEYS.ID,
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: E_PERMISSION_ENTITY_KEYS.ID,
    },
  })
  [E_ROLE_ENTITY_KEYS.PERMISSIONS]: Array<Permission>;
}
