import { E_DB_TABLES } from '../constants';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Schedule } from './schedule.entity';

export enum E_STUDENT_SCHEDULE_ENTITY_KEYS {
  STUDENT_ID = 'student_id',
  SCHEDULE_ID = 'schedule_id',
  POINTS = 'points',
}

@Entity({
  name: E_DB_TABLES.STUDENT_SCHEDULE,
})
export class StudentSchedule {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  [E_STUDENT_SCHEDULE_ENTITY_KEYS.STUDENT_ID]: User;

  @ManyToOne(() => Schedule)
  @JoinColumn({ name: 'schedule_id' })
  [E_STUDENT_SCHEDULE_ENTITY_KEYS.SCHEDULE_ID]: Schedule;

  @Column()
  [E_STUDENT_SCHEDULE_ENTITY_KEYS.POINTS]: string;
}
