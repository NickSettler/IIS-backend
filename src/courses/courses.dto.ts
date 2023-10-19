import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
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

  @IsNotEmpty()
  @IsUUID()
  [E_COURSE_ENTITY_KEYS.GUARANTOR]: string;

  @IsOptional()
  @IsUUID('4', {
    each: true,
  })
  [E_COURSE_ENTITY_KEYS.TEACHERS]: Array<string>;

  [E_COURSE_ENTITY_KEYS.ANNOTATION]: string;
}

export class UpdateCourseDto extends PartialType(CreateCoursesDto) {}
