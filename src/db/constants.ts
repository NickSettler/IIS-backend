export enum E_DB_TABLES {
  USERS = 'users',
  USER_ROLES = 'user_roles',
  ROLES = 'roles',
  ROLE_PERMISSIONS = 'role_permissions',
  PERMISSIONS = 'permissions',
  COURSES = 'courses',
  COURSE_TEACHERS = 'course_teachers',
  COURSE_ACTIVITY = 'course_activity',
  CLASSES = 'classes',
  SCHEDULE = 'schedule',
  STUDENT_SCHEDULE = 'student_schedule',
  TEACHER_REQUIREMENT = 'teacher_requirements',
}

export enum E_CUSTOM_ERROR_CODES {
  SCHEDULE_TIME_TOO_SHORT = 'C0001',
  SCHEDULE_TIME_TOO_LONG = 'C0002',
  SCHEDULE_TIME_IN_THE_PAST = 'C0003',
  SCHEDULE_CONFLICT = 'C0004',
  TEACHER_NOT_IN_COURSE = 'C0005',
  USER_NOT_A_TEACHER = 'C0061',
  USER_NOT_A_GUARANTOR = 'C0062',
  USER_NOT_A_STUDENT = 'C0063',
  TEACHER_REQS_UNSATISFIED = 'C0007',
  TEACHER_REQS_CONFLICT = 'C0008',
}

export const defaultCustomMessages: Record<E_CUSTOM_ERROR_CODES, string> = {
  [E_CUSTOM_ERROR_CODES.SCHEDULE_TIME_TOO_SHORT]:
    'Schedule must be at least 1 hour',
  [E_CUSTOM_ERROR_CODES.SCHEDULE_TIME_TOO_LONG]:
    'Schedule must be at most 4 hours',
  [E_CUSTOM_ERROR_CODES.SCHEDULE_TIME_IN_THE_PAST]:
    'Schedule must be in the future',
  [E_CUSTOM_ERROR_CODES.SCHEDULE_CONFLICT]:
    'There is a conflict with another schedule item',
  [E_CUSTOM_ERROR_CODES.TEACHER_NOT_IN_COURSE]:
    'Teacher cannot be assigned to a course they are not in',
  [E_CUSTOM_ERROR_CODES.USER_NOT_A_TEACHER]: 'User is not a teacher',
  [E_CUSTOM_ERROR_CODES.USER_NOT_A_GUARANTOR]: 'User is not a guarantor',
  [E_CUSTOM_ERROR_CODES.USER_NOT_A_STUDENT]: 'User is not a student',
  [E_CUSTOM_ERROR_CODES.TEACHER_REQS_UNSATISFIED]:
    'Teacher requirements are not satisfied',
  [E_CUSTOM_ERROR_CODES.TEACHER_REQS_CONFLICT]:
    'Teacher already has requirements for this time',
};

export enum E_POSTGRES_ERROR_CODES {
  UNIQUE_CONSTRAINT = '23505',
  INVALID_TEXT_REPRESENTATION = '22P02',
  FOREIGN_KEY_VIOLATION = '23503',
  STRING_DATA_RIGHT_TRUNCATION = '22001',
}

export enum E_SQLITE_ERROR_CODES {
  UNIQUE_CONSTRAINT = 'SQLITE_CONSTRAINT',
  FOREIGN_KEY_VIOLATION = 'SQLITE_CONSTRAINT_FOREIGNKEY',
  STRING_DATA_RIGHT_TRUNCATION = 'SQLITE_TOOBIG',
}
