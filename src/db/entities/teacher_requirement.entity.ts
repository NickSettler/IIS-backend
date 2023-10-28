import { E_DB_TABLES } from '../constants';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum E_TEACHER_REQUIREMENT_ENTITY_KEYS {
  ID = 'id',
  TEACHER_ID = 'teacher_id',
  TEACHER = 'teacher',
  MODE = 'mode',
  START_TIME = 'start_time',
  END_TIME = 'end_time',
}

@Entity({
  name: E_DB_TABLES.TEACHER_REQUIREMENT,
})
export class TeacherRequirement {
  @PrimaryGeneratedColumn('uuid')
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.ID]: string;

  @Column()
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.MODE]: string;

  @Column({ type: 'timestamp' })
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.START_TIME]: Date;

  @Column({ type: 'timestamp' })
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.END_TIME]: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER_ID })
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER]: User;
}
