import { E_DB_TABLES } from '../constants';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { IsUUID } from 'class-validator';
import { User } from './user.entity';
import { Schedule } from './schedule.entity';

export enum E_STUDENT_SCHEDULE_ENTITY_KEYS {
  STUDENT_ID = 'student_id',
  SCHEDULE_ID = 'schedule_id',
  STUDENT = 'student',
  SCHEDULE = 'schedule',
}
@Entity({
  name: E_DB_TABLES.STUDENT_SCHEDULE,
})
export class StudentSchedule {
  @PrimaryColumn()
  @IsUUID()
  [E_STUDENT_SCHEDULE_ENTITY_KEYS.STUDENT_ID]: string;

  @PrimaryColumn()
  @IsUUID()
  [E_STUDENT_SCHEDULE_ENTITY_KEYS.SCHEDULE_ID]: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: E_STUDENT_SCHEDULE_ENTITY_KEYS.STUDENT_ID })
  [E_STUDENT_SCHEDULE_ENTITY_KEYS.STUDENT]: User;

  @ManyToOne(() => Schedule)
  @JoinColumn({ name: E_STUDENT_SCHEDULE_ENTITY_KEYS.SCHEDULE_ID })
  [E_STUDENT_SCHEDULE_ENTITY_KEYS.SCHEDULE]: Schedule;
}
