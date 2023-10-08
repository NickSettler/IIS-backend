import { E_POSTGRES_ERROR_CODES, E_SQLITE_ERROR_CODES } from '../db/constants';

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
