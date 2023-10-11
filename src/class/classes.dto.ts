import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { E_CLASS_ENTITY_KEYS } from '../db/entities/class.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateClassDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  [E_CLASS_ENTITY_KEYS.ABBR]: string;

  @IsNotEmpty()
  @IsNumber()
  [E_CLASS_ENTITY_KEYS.CAPACITY]: number;
}

export class UpdateClassDto extends PartialType(CreateClassDto) {}
