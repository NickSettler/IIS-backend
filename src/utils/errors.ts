import {
  E_CUSTOM_ERROR_CODES,
  E_POSTGRES_ERROR_CODES,
  E_SQLITE_ERROR_CODES,
} from '../db/constants';
import { values } from 'lodash';
import { HttpStatus } from '@nestjs/common';

export const isError = (
  err: any,
  code: keyof typeof E_POSTGRES_ERROR_CODES & keyof typeof E_SQLITE_ERROR_CODES,
): boolean => {
  if (!err) return false;

  return (
    err.code === E_POSTGRES_ERROR_CODES[code] ||
    err.code === E_SQLITE_ERROR_CODES[code]
  );
};

export const isCustomError = (err: any): boolean => {
  if (!err) return false;

  return values(E_CUSTOM_ERROR_CODES).includes(err.code);
};

export const handleCustomError = (err: any): [string, number] => {
  switch (err.code) {
    case E_CUSTOM_ERROR_CODES.SCHEDULE_TIME_TOO_SHORT:
      return ['Schedule must be at least 1 hour', HttpStatus.BAD_REQUEST];
    case E_CUSTOM_ERROR_CODES.SCHEDULE_TIME_TOO_LONG:
      return ['Schedule must be at most 4 hours', HttpStatus.BAD_REQUEST];
    case E_CUSTOM_ERROR_CODES.SCHEDULE_TIME_IN_THE_PAST:
      return ['Schedule must be in the future', HttpStatus.BAD_REQUEST];
    case E_CUSTOM_ERROR_CODES.SCHEDULE_CONFLICT:
      return [
        'There is a conflict with another schedule item',
        HttpStatus.CONFLICT,
      ];
    case E_CUSTOM_ERROR_CODES.TEACHER_NOT_IN_COURSE:
      return [
        'Teacher cannot be assigned to a course they are not in',
        HttpStatus.BAD_REQUEST,
      ];
    case E_CUSTOM_ERROR_CODES.USER_NOT_A_TEACHER:
      return ['User is not a teacher', HttpStatus.BAD_REQUEST];
    case E_CUSTOM_ERROR_CODES.TEACHER_REQS_UNSATISFIED:
      return ['Teacher requirements are not satisfied', HttpStatus.BAD_REQUEST];
    case E_CUSTOM_ERROR_CODES.TEACHER_REQS_CONFLICT:
      return [
        'Teacher already has requirements for this time',
        HttpStatus.CONFLICT,
      ];
  }
};
