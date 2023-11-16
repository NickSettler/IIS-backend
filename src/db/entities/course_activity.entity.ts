import { E_DB_TABLES } from '../constants';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';

export enum E_COURSE_ACTIVITY_ENTITY_KEYS {
  ID = 'id',
  COURSE_ID = 'course_id',
  COURSE = 'course',
  FORM = 'form',
  REQUIREMENTS = 'requirements',
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
  [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE_ID]: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE_ID })
  [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: Course;

  @Column()
  [E_COURSE_ACTIVITY_ENTITY_KEYS.REQUIREMENTS]: string;
}
