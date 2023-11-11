import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { E_DB_TABLES } from '../constants';
import { E_USER_ENTITY_KEYS, User } from './user.entity';
import { IsUUID } from 'class-validator';

export const enum E_COURSE_ENTITY_KEYS {
  ID = 'id',
  ABBR = 'abbr',
  GUARANTOR_ID = 'guarantor_id',
  NAME = 'name',
  CREDITS = 'credits',
  ANNOTATION = 'annotation',
  GUARANTOR = 'guarantor',
  TEACHERS = 'teachers',
}

@Entity({
  name: E_DB_TABLES.COURSES,
})
export class Course {
  @PrimaryColumn()
  @IsUUID()
  [E_COURSE_ENTITY_KEYS.ID]: string;

  @Column({ unique: true })
  [E_COURSE_ENTITY_KEYS.ABBR]: string;

  @Column({ unique: true })
  [E_COURSE_ENTITY_KEYS.NAME]: string;

  @Column()
  [E_COURSE_ENTITY_KEYS.CREDITS]: number;

  @Column()
  [E_COURSE_ENTITY_KEYS.ANNOTATION]: string;

  @ManyToOne(() => User, {
    eager: true,
  })
  @JoinColumn({ name: E_COURSE_ENTITY_KEYS.GUARANTOR_ID })
  [E_COURSE_ENTITY_KEYS.GUARANTOR]: User;

  @ManyToMany(() => User, {
    eager: true,
  })
  @JoinTable({
    name: E_DB_TABLES.COURSE_TEACHERS,
    joinColumn: {
      name: 'course_id',
      referencedColumnName: E_COURSE_ENTITY_KEYS.ID,
    },
    inverseJoinColumn: {
      name: 'teacher_id',
      referencedColumnName: E_USER_ENTITY_KEYS.ID,
    },
  })
  [E_COURSE_ENTITY_KEYS.TEACHERS]: Array<User>;
}
