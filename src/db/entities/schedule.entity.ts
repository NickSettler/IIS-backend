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
import { IsUUID } from 'class-validator';

export enum E_SCHEDULE_ENTITY_KEYS {
  ID = 'id',
  COURSE_ACTIVITY_ID = 'course_activity_id',
  COURSE_ACTIVITY = 'course_activity',
  TEACHER = 'teacher',
  CLASS_ID = 'class_id',
  CLASSES = 'classes',
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

  @Column({ type: 'timestamp' })
  [E_SCHEDULE_ENTITY_KEYS.START_TIME]: Date;

  @Column({ type: 'timestamp' })
  [E_SCHEDULE_ENTITY_KEYS.END_TIME]: Date;

  @Column('uuid')
  [E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY_ID]: string;

  @ManyToOne(() => CourseActivity)
  @JoinColumn({ name: E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY_ID })
  [E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY]: CourseActivity;

  @ManyToOne(() => User)
  @JoinColumn({ name: E_SCHEDULE_ENTITY_KEYS.TEACHER })
  [E_SCHEDULE_ENTITY_KEYS.TEACHER]: User;

  @Column()
  @IsUUID()
  [E_SCHEDULE_ENTITY_KEYS.CLASS_ID]: string;

  @ManyToOne(() => Class)
  @JoinColumn({ name: E_SCHEDULE_ENTITY_KEYS.CLASS_ID })
  [E_SCHEDULE_ENTITY_KEYS.CLASSES]: Class;

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
