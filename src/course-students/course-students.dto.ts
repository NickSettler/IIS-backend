import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { E_COURSE_STUDENTS_ENTITY_KEYS } from '../db/entities/course_students.entity';

export class CreateCourseStudentDto {
  @IsNotEmpty()
  @IsUUID()
  [E_COURSE_STUDENTS_ENTITY_KEYS.COURSE]: string;

  @IsNotEmpty()
  @IsString()
  [E_COURSE_STUDENTS_ENTITY_KEYS.STUDENT]: string;
}
