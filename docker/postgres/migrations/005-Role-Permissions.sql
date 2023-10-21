DROP TABLE IF EXISTS role_permissions;

CREATE TABLE role_permissions
(
    role_name       VARCHAR NOT NULL,
    permission_name VARCHAR NOT NULL,
    CONSTRAINT fk_role_name FOREIGN KEY (role_name) REFERENCES roles (name) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_permission_name FOREIGN KEY (permission_name) REFERENCES permissions (name) ON UPDATE CASCADE ON DELETE RESTRICT,
    PRIMARY KEY (role_name, permission_name)
);

INSERT INTO role_permissions (role_name, permission_name)
VALUES ('ADMIN', 'EDIT_USER'),
       ('ADMIN', 'EDIT_CLASS'),
       ('ADMIN', 'EDIT_COURSE'),
       ('ADMIN', 'ADD_GUARANTOR'),
       ('ADMIN', 'EDIT_ACTIVITY'),
       ('ADMIN', 'EDIT_COURSE_TEACHER'),
       ('ADMIN', 'DEFINE_COURSE_REQUIREMENTS'),
       ('ADMIN', 'ADD_PERSONAL_REQUIREMENTS'),
       ('ADMIN', 'PLACE_SCHEDULE_ACTIVITIES'),
       ('ADMIN', 'ASSIGN_SCHEDULE_CLASSES'),
       ('ADMIN', 'EDIT_PERSONAL_COURSES'),
       ('ADMIN', 'VIEW_PERSONAL_SCHEDULE'),
       ('ADMIN', 'VIEW_ANNOTATION');

INSERT INTO role_permissions (role_name, permission_name)
VALUES ('GUARANTOR', 'EDIT_ACTIVITY'),
       ('GUARANTOR', 'EDIT_COURSE_TEACHER'),
       ('GUARANTOR', 'DEFINE_COURSE_REQUIREMENTS'),
       ('GUARANTOR', 'ADD_PERSONAL_REQUIREMENTS'),
       ('GUARANTOR', 'VIEW_PERSONAL_SCHEDULE'),
       ('GUARANTOR', 'VIEW_ANNOTATION');

INSERT INTO role_permissions (role_name, permission_name)
VALUES ('TEACHER', 'ADD_PERSONAL_REQUIREMENTS'),
       ('TEACHER', 'VIEW_PERSONAL_SCHEDULE'),
       ('TEACHER', 'VIEW_ANNOTATION');

INSERT INTO role_permissions (role_name, permission_name)
VALUES ('SCHEDULER', 'PLACE_SCHEDULE_ACTIVITIES'),
       ('SCHEDULER', 'ASSIGN_SCHEDULE_CLASSES');

INSERT INTO role_permissions (role_name, permission_name)
VALUES ('STUDENT', 'EDIT_PERSONAL_COURSES'),
       ('STUDENT', 'VIEW_PERSONAL_SCHEDULE'),
       ('STUDENT', 'VIEW_ANNOTATION');

INSERT INTO role_permissions (role_name, permission_name)
VALUES ('GUEST', 'VIEW_ANNOTATION');
