import { E_SCHEDULE_ENTITY_KEYS } from '../db/entities/schedule.entity';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsUUID()
  [E_SCHEDULE_ENTITY_KEYS.COURSE_ACTIVITY]: string;

  @IsNotEmpty()
  @IsUUID()
  [E_SCHEDULE_ENTITY_KEYS.TEACHER]: string;

  @IsNotEmpty()
  @IsUUID()
  [E_SCHEDULE_ENTITY_KEYS.CLASS]: string;

  @IsNotEmpty()
  @IsDateString()
  [E_SCHEDULE_ENTITY_KEYS.START_TIME]: string;

  @IsNotEmpty()
  @IsDateString()
  [E_SCHEDULE_ENTITY_KEYS.END_TIME]: string;

  @IsOptional()
  @IsString()
  [E_SCHEDULE_ENTITY_KEYS.RECURRENCE_RULE]: string;

  @IsOptional()
  @IsString()
  [E_SCHEDULE_ENTITY_KEYS.EXCLUSION_DATES]: string;

  @IsOptional()
  @IsString()
  [E_SCHEDULE_ENTITY_KEYS.NOTES]: string;
}

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {}
