import { E_DB_TABLES } from '../constants';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

export enum E_COURSE_ACTIVITY_ENTITY_KEYS {
  ID = 'id',
  TEACHER_ID = 'teacher_id',
  TEACHER = 'teacher',
  COURSE_ABBR = 'course_abbr',
  COURSE = 'course',
  FORM = 'form',
}

@Entity({
  name: E_DB_TABLES.COURSE_ACTIVITY,
})
export class CourseActivity {
  @PrimaryGeneratedColumn('uuid')
  [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: string;

  @Column()
  [E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]: string;

  @Column('uuid')
  [E_COURSE_ACTIVITY_ENTITY_KEYS.TEACHER_ID]: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: E_COURSE_ACTIVITY_ENTITY_KEYS.TEACHER_ID })
  [E_COURSE_ACTIVITY_ENTITY_KEYS.TEACHER]: User;

  @Column()
  [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE_ABBR]: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE_ABBR })
  [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: Course;
}
