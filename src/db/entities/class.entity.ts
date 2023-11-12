import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { E_DB_TABLES } from '../constants';

export enum E_CLASS_ENTITY_KEYS {
  ID = 'id',
  ABBR = 'abbr',
  CAPACITY = 'capacity',
}

@Entity({
  name: E_DB_TABLES.CLASSES,
})
export class Class {
  @PrimaryGeneratedColumn('uuid')
  [E_CLASS_ENTITY_KEYS.ID]: string;

  @Column({ unique: true })
  [E_CLASS_ENTITY_KEYS.ABBR]: string;

  @Column({ default: 15 })
  [E_CLASS_ENTITY_KEYS.CAPACITY]: number;
}
