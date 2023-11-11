import { IsNotEmpty, IsUUID } from 'class-validator';
import { E_STUDENT_SCHEDULE_ENTITY_KEYS } from '../db/entities/student_schedule.entity';

export class CreateStudentScheduleDto {
  @IsNotEmpty()
  @IsUUID()
  [E_STUDENT_SCHEDULE_ENTITY_KEYS.STUDENT_ID]: string;

  @IsNotEmpty()
  @IsUUID()
  [E_STUDENT_SCHEDULE_ENTITY_KEYS.SCHEDULE_ID]: string;
}
