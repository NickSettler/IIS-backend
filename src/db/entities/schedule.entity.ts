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
import { Class } from './class.entity';
import { E_USER_ENTITY_KEYS, User } from './user.entity';
import { E_STUDENT_SCHEDULE_ENTITY_KEYS } from './student_schedule.entity';

export enum E_SCHEDULE_ENTITY_KEYS {
  ID = 'id',
  START_TIME = 'start_time',
  END_TIME = 'end_time',
  RECURRENCE_RULE = 'recurrence_rule',
  EXCLUSION_DATES = 'exclusion_dates',
  NOTES = 'notes',
  COURSE_ACTIVITY_ID = 'course_activity_id',
  COURSE_ACTIVITY = 'course_activity',
  TEACHER_ID = 'teacher_id',
  TEACHER = 'teacher',
  CLASS_ID = 'class_id',
  CLASS = 'class',
  STUDENTS = 'students',
}

@Entity({
  name: E_DB_TABLES.SCHEDULE,
})
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  [E_SCHEDULE_ENTITY_KEYS.ID]: string;

  @Column({ type: 'timestamp' })
  [E_SCHEDULE_ENTITY_KEYS.START_TIME]: Date;

  @Column({ type: 'timestamp' })
  [E_SCHEDULE_ENTITY_KEYS.END_TIME]: Date;

  @Column({
    nullable: true,
    type: 'text',
  })
  [E_SCHEDULE_ENTITY_KEYS.RECURRENCE_RULE]: string | null;

  @Column({
    nullable: true,
    type: 'text',
  })
  [E_SCHEDULE_ENTITY_KEYS.EXCLUSION_DATES]: string | null;

  @Column({
    nullable: true,
    type: 'text',
  })
  [E_SCHEDULE_ENTITY_KEYS.NOTES]: string | null;

  @Column('uuid')
  [E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY_ID]: string;

  @ManyToOne(() => CourseActivity, { eager: true })
  @JoinColumn({ name: E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY_ID })
  [E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY]: CourseActivity;

  @Column('uuid')
  [E_SCHEDULE_ENTITY_KEYS.TEACHER_ID]: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: E_SCHEDULE_ENTITY_KEYS.TEACHER_ID })
  [E_SCHEDULE_ENTITY_KEYS.TEACHER]: User;

  @Column()
  [E_SCHEDULE_ENTITY_KEYS.CLASS_ID]: string;

  @ManyToOne(() => Class, { eager: true })
  @JoinColumn({ name: E_SCHEDULE_ENTITY_KEYS.CLASS_ID })
  [E_SCHEDULE_ENTITY_KEYS.CLASS]: Class;

  @ManyToMany(() => User)
  @JoinTable({
    name: E_DB_TABLES.STUDENT_SCHEDULE,
    joinColumn: {
      name: E_STUDENT_SCHEDULE_ENTITY_KEYS.SCHEDULE_ID,
      referencedColumnName: E_SCHEDULE_ENTITY_KEYS.ID,
    },
    inverseJoinColumn: {
      name: E_STUDENT_SCHEDULE_ENTITY_KEYS.STUDENT_ID,
      referencedColumnName: E_USER_ENTITY_KEYS.ID,
    },
  })
  [E_SCHEDULE_ENTITY_KEYS.STUDENTS]: Array<User>;
}
