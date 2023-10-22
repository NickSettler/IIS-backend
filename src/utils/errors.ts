import {
  defaultCustomMessages,
  E_CUSTOM_ERROR_CODES,
  E_POSTGRES_ERROR_CODES,
  E_SQLITE_ERROR_CODES,
} from '../db/constants';
import { isEmpty, values } from 'lodash';
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
  const code = err.code;
  const message = isEmpty(err.message)
    ? defaultCustomMessages[code]
    : err.message;

  switch (err.code) {
    case E_CUSTOM_ERROR_CODES.SCHEDULE_TIME_TOO_SHORT:
    case E_CUSTOM_ERROR_CODES.SCHEDULE_TIME_TOO_LONG:
    case E_CUSTOM_ERROR_CODES.SCHEDULE_TIME_IN_THE_PAST:
    case E_CUSTOM_ERROR_CODES.TEACHER_NOT_IN_COURSE:
    case E_CUSTOM_ERROR_CODES.USER_NOT_A_TEACHER:
    case E_CUSTOM_ERROR_CODES.USER_NOT_A_GUARANTOR:
    case E_CUSTOM_ERROR_CODES.TEACHER_REQS_UNSATISFIED:
      return [message, HttpStatus.BAD_REQUEST];
    case E_CUSTOM_ERROR_CODES.SCHEDULE_CONFLICT:
    case E_CUSTOM_ERROR_CODES.TEACHER_REQS_CONFLICT:
      return [message, HttpStatus.CONFLICT];
  }
};
