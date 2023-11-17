import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { E_DB_TABLES } from '../constants';
import { E_USER_ENTITY_KEYS, User } from './user.entity';
import { E_COURSE_STUDENTS_ENTITY_KEYS } from './course_students.entity';

export const enum E_COURSE_ENTITY_KEYS {
  ID = 'id',
  ABBR = 'abbr',
  GUARANTOR_ID = 'guarantor_id',
  NAME = 'name',
  CREDITS = 'credits',
  ANNOTATION = 'annotation',
  GUARANTOR = 'guarantor',
  TEACHERS = 'teachers',
  STUDENTS = 'students',
}

@Entity({
  name: E_DB_TABLES.COURSES,
})
export class Course {
  @PrimaryGeneratedColumn('uuid')
  [E_COURSE_ENTITY_KEYS.ID]: string;

  @Column({ unique: true })
  [E_COURSE_ENTITY_KEYS.ABBR]: string;

  @Column({ unique: true })
  [E_COURSE_ENTITY_KEYS.NAME]: string;

  @Column()
  [E_COURSE_ENTITY_KEYS.CREDITS]: number;

  @Column()
  [E_COURSE_ENTITY_KEYS.ANNOTATION]: string;

  @Column('uuid')
  [E_COURSE_ENTITY_KEYS.GUARANTOR_ID]: string;

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

  @ManyToMany(() => User)
  @JoinTable({
    name: E_DB_TABLES.COURSE_STUDENTS,
    joinColumn: {
      name: E_COURSE_STUDENTS_ENTITY_KEYS.COURSE_ID,
      referencedColumnName: E_COURSE_ENTITY_KEYS.ID,
    },
    inverseJoinColumn: {
      name: E_COURSE_STUDENTS_ENTITY_KEYS.STUDENT_ID,
      referencedColumnName: E_USER_ENTITY_KEYS.ID,
    },
  })
  [E_COURSE_ENTITY_KEYS.STUDENTS]: Array<User>;
}
