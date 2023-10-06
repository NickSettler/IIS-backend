import { Column, Entity, PrimaryColumn } from 'typeorm';
import { E_DB_TABLES } from '../constants';

export enum E_CLASS_ENTITY_KEYS {
  ABBR = 'abbr',
  CAPACITY = 'capacity',
}

@Entity({
  name: E_DB_TABLES.CLASSES,
})
export class Class {
  @PrimaryColumn()
  [E_CLASS_ENTITY_KEYS.ABBR]: string;

  @Column({ default: 15 })
  [E_CLASS_ENTITY_KEYS.CAPACITY]: number;
}
