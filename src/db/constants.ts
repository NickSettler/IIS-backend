export enum E_DB_TABLES {
  USERS = 'users',
  USER_ROLES = 'user_roles',
  ROLES = 'roles',
  ROLE_PERMISSIONS = 'role_permissions',
  PERMISSIONS = 'permissions',
  COURSES = 'courses',
  COURSE_ACTIVITY = 'course_activity',
  CLASSES = 'classes',
  SCHEDULE = 'schedule',
  STUDENT_SCHEDULE = 'student_schedule',
}

export enum E_DB_ERROR_CODES {
  UNIQUE_CONSTRAINT = '23505',
  INVALID_TEXT_REPRESENTATION = '22P02',
  FOREIGN_KEY_VIOLATION = '23503',
}
