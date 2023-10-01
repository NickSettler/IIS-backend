import { E_DB_TABLES } from '../constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum E_PERMISSION_ENTITY_KEYS {
  ID = 'id',
  NAME = 'name',
}

@Entity({ name: E_DB_TABLES.PERMISSIONS })
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  [E_PERMISSION_ENTITY_KEYS.ID]: string;

  @Column()
  [E_PERMISSION_ENTITY_KEYS.NAME]: string;
}
