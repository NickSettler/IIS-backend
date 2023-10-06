import { E_DB_TABLES } from '../constants';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

export enum E_COURSE_ACTIVITY_ENTITY_KEYS {
  ID = 'id',
  TEACHER_ID = 'teacher_id',
  COURSE_ABBR = 'course_abbr',
}

@Entity({
  name: E_DB_TABLES.COURSE_ACTIVITY,
})
export class CourseActivity {
  @PrimaryGeneratedColumn('uuid')
  [E_COURSE_ACTIVITY_ENTITY_KEYS.ID]: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  [E_COURSE_ACTIVITY_ENTITY_KEYS.TEACHER_ID]: User;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_abbr' })
  [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE_ABBR]: Course;
}
