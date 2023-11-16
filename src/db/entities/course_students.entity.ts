import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { E_DB_TABLES } from '../constants';
import { Course } from './course.entity';
import { User } from './user.entity';

export enum E_COURSE_STUDENTS_ENTITY_KEYS {
  STUDENT_ID = 'student_id',
  STUDENT = 'student',
  COURSE_ID = 'course_id',
  COURSE = 'course',
}

@Entity({ name: E_DB_TABLES.COURSE_STUDENTS })
export class CourseStudent {
  @PrimaryColumn('uuid')
  [E_COURSE_STUDENTS_ENTITY_KEYS.STUDENT_ID]: string;

  @PrimaryColumn('uuid')
  [E_COURSE_STUDENTS_ENTITY_KEYS.COURSE_ID]: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: E_COURSE_STUDENTS_ENTITY_KEYS.STUDENT_ID })
  [E_COURSE_STUDENTS_ENTITY_KEYS.STUDENT]: User;

  @ManyToOne(() => Course, { eager: true })
  @JoinColumn({ name: E_COURSE_STUDENTS_ENTITY_KEYS.COURSE_ID })
  [E_COURSE_STUDENTS_ENTITY_KEYS.COURSE]: Course;
}
