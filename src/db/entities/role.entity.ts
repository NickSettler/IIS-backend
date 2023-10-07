import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { E_DB_TABLES } from '../constants';
import { E_PERMISSION_ENTITY_KEYS, Permission } from './permission.entity';

export enum E_ROLE_ENTITY_KEYS {
  NAME = 'name',
  PERMISSIONS = 'permissions',
}

export enum E_ROLE {
  ADMIN = 'ADMIN',
  GUARANTOR = 'GUARANTOR',
  TEACHER = 'TEACHER',
  SCHEDULER = 'SCHEDULER',
  STUDENT = 'STUDENT',
  GUEST = 'GUEST',
}

@Entity({ name: E_DB_TABLES.ROLES })
export class Role {
  @PrimaryColumn()
  [E_ROLE_ENTITY_KEYS.NAME]: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: E_DB_TABLES.ROLE_PERMISSIONS,
    joinColumn: {
      name: 'role_name',
      referencedColumnName: E_ROLE_ENTITY_KEYS.NAME,
    },
    inverseJoinColumn: {
      name: 'permission_name',
      referencedColumnName: E_PERMISSION_ENTITY_KEYS.NAME,
    },
  })
  [E_ROLE_ENTITY_KEYS.PERMISSIONS]: Array<Permission>;
}
