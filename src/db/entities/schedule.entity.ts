import { E_DB_TABLES } from '../constants';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseActivity } from './course_activity.entity';
import { Classes } from './class.entity';
import { E_USER_ENTITY_KEYS, User } from './user.entity';

export enum E_SCHEDULE_ENTITY_KEYS {
  ID = 'id',
  COURSE_ACTIVITY_ID = 'course_activity_id',
  CLASS_ABBR = 'class_abbr',
  START_TIME = 'start_time',
  END_TIME = 'end_time',
  STUDENTS = 'students',
}

@Entity({
  name: E_DB_TABLES.SCHEDULE,
})
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  [E_SCHEDULE_ENTITY_KEYS.ID]: string;

  @Column()
  [E_SCHEDULE_ENTITY_KEYS.START_TIME]: string;

  @Column()
  [E_SCHEDULE_ENTITY_KEYS.END_TIME]: string;

  @ManyToOne(() => CourseActivity)
  @JoinColumn({ name: 'course_activity_id' })
  [E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY_ID]: CourseActivity;

  @ManyToOne(() => Classes)
  @JoinColumn({ name: 'class_abbr' })
  [E_SCHEDULE_ENTITY_KEYS.CLASS_ABBR]: Classes;

  @ManyToMany(() => User)
  @JoinTable({
    name: E_DB_TABLES.STUDENT_SCHEDULE,
    joinColumn: {
      name: 'schedule_id',
      referencedColumnName: E_SCHEDULE_ENTITY_KEYS.ID,
    },
    inverseJoinColumn: {
      name: 'student_id',
      referencedColumnName: E_USER_ENTITY_KEYS.ID,
    },
  })
  [E_SCHEDULE_ENTITY_KEYS.STUDENTS]: Array<User>;
}
