import { E_DB_TABLES } from '../constants';
import { Entity, PrimaryColumn } from 'typeorm';

export enum E_PERMISSION_ENTITY_KEYS {
  NAME = 'name',
}

@Entity({ name: E_DB_TABLES.PERMISSIONS })
export class Permission {
  @PrimaryColumn()
  [E_PERMISSION_ENTITY_KEYS.NAME]: string;
}
