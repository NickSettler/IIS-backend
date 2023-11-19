import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { E_TEACHER_REQUIREMENT_ENTITY_KEYS } from '../db/entities/teacher_requirement.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTeacherRequirementsDto {
  @IsNotEmpty()
  @IsUUID()
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER]: string;

  @IsOptional()
  @IsUUID()
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.TEACHER_ID]: string;

  @IsNotEmpty()
  @IsString()
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.MODE]: string;

  @IsNotEmpty()
  @IsDateString()
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.START_TIME]: Date;

  @IsNotEmpty()
  @IsDateString()
  [E_TEACHER_REQUIREMENT_ENTITY_KEYS.END_TIME]: Date;
}

export class UpdateTeacherRequirementsDto extends PartialType(
  CreateTeacherRequirementsDto,
) {}
