import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { E_USER_ENTITY_KEYS } from '../db/entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  [E_USER_ENTITY_KEYS.USERNAME]: string;

  @IsNotEmpty()
  @MinLength(6)
  [E_USER_ENTITY_KEYS.PASSWORD]: string;

  @IsNotEmpty()
  @IsString()
  [E_USER_ENTITY_KEYS.FIRST_NAME]: string;

  @IsNotEmpty()
  @IsString()
  [E_USER_ENTITY_KEYS.LAST_NAME]: string;
}
