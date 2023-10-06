import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { E_DB_TABLES } from '../constants';
import { User } from './user.entity';

export const enum E_COURSE_ENTITY_KEYS {
  ABBR = 'abbr',
  GUARANTOR_ID = 'guarantor_id',
  NAME = 'name',
  CREDITS = 'credits',
  ANNOTATION = 'annotation',
  GUARANTOR = 'guarantor',
}

@Entity({
  name: E_DB_TABLES.COURSES,
})
export class Course {
  @PrimaryColumn()
  [E_COURSE_ENTITY_KEYS.ABBR]: string;

  @Column({ unique: true })
  [E_COURSE_ENTITY_KEYS.NAME]: string;

  @Column()
  [E_COURSE_ENTITY_KEYS.CREDITS]: number;

  @Column({ nullable: true })
  [E_COURSE_ENTITY_KEYS.ANNOTATION]: string;

  @Column('uuid')
  [E_COURSE_ENTITY_KEYS.GUARANTOR_ID]: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: E_COURSE_ENTITY_KEYS.GUARANTOR_ID })
  [E_COURSE_ENTITY_KEYS.GUARANTOR]: User;
}
