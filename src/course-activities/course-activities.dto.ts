import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { E_COURSE_ACTIVITY_ENTITY_KEYS } from '../db/entities/course_activity.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCourseActivitiesDto {
  @IsNotEmpty()
  @IsUUID()
  [E_COURSE_ACTIVITY_ENTITY_KEYS.COURSE]: string;

  @IsNotEmpty()
  @IsString()
  [E_COURSE_ACTIVITY_ENTITY_KEYS.FORM]: string;
}

export class UpdateCourseActivitiesDto extends PartialType(
  CreateCourseActivitiesDto,
) {}
