import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { E_COURSE_ENTITY_KEYS } from '../db/entities/course.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCoursesDto {
  @IsNotEmpty()
  @IsString()
  [E_COURSE_ENTITY_KEYS.ABBR]: string;

  @IsNotEmpty()
  @IsString()
  [E_COURSE_ENTITY_KEYS.NAME]: string;

  @IsNotEmpty()
  @IsNumber()
  [E_COURSE_ENTITY_KEYS.CREDITS]: number;

  @IsString()
  [E_COURSE_ENTITY_KEYS.ANNOTATION]: string;

  @IsNotEmpty()
  @IsUUID()
  [E_COURSE_ENTITY_KEYS.GUARANTOR_ID]: string;
}

export class UpdateCoursesDto extends PartialType(CreateCoursesDto) {}
