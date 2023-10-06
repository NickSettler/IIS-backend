import { E_DB_TABLES } from '../constants';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseActivity } from './course_activity.entity';
import { Classes } from './class.entity';

export enum E_SCHEDULE_ENTITY_KEYS {
  ID = 'id',
  COURSE_ACTIVITY_ID = 'course_activity_id',
  CLASS_ABBR = 'class_abbr',
  START_TIME = 'start_time',
  END_TIME = 'end_time',
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
}
