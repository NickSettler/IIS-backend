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
  COURSE_STUDENTS = 'course_students',
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
  TEACHER_REQS_DATE_CONFLICT = 'C0009',
  TEACHER_HAS_SCHEDULE = 'C0010',
  GUARANTOR_TEACHER_CHECK = 'C0011',
  ROLES_TEACHER_HAS_SCHEDULE = 'C0101',
  ROLES_GUARANTOR_HAS_COURSES = 'C0102',
  ROLES_STUDENT_HAS_COURSES = 'C0103',
  ROLES_STUDENT_HAS_SCHEDULE = 'C0104',
  ROLES_NO_ADMIN_DELETE = 'C0105',
  ROLES_NO_ADMIN_CREATE = 'C0106',
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
  [E_CUSTOM_ERROR_CODES.TEACHER_REQS_DATE_CONFLICT]:
    'Teacher requirements cant be in the past',
  [E_CUSTOM_ERROR_CODES.TEACHER_HAS_SCHEDULE]:
    'Teacher cannot be deleted because they have schedule items for the course',
  [E_CUSTOM_ERROR_CODES.GUARANTOR_TEACHER_CHECK]:
    'Guarantor must be a teacher of their course',
  [E_CUSTOM_ERROR_CODES.ROLES_TEACHER_HAS_SCHEDULE]:
    'Teacher cannot be deleted because they have schedule items',
  [E_CUSTOM_ERROR_CODES.ROLES_GUARANTOR_HAS_COURSES]:
    'Guarantor cannot be deleted because they have courses',
  [E_CUSTOM_ERROR_CODES.ROLES_STUDENT_HAS_COURSES]:
    'Student cannot be deleted because they have courses',
  [E_CUSTOM_ERROR_CODES.ROLES_STUDENT_HAS_SCHEDULE]:
    'Student cannot be deleted because they have schedule items',
  [E_CUSTOM_ERROR_CODES.ROLES_NO_ADMIN_DELETE]: 'Admin role cannot be deleted',
  [E_CUSTOM_ERROR_CODES.ROLES_NO_ADMIN_CREATE]: 'Admin role cannot be created',
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
