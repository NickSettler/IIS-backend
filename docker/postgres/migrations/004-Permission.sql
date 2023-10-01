DROP TABLE IF EXISTS permisions;

CREATE TABLE permissions
(
    id   uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO permissions (name)
VALUES ('EDIT_USER'),
       ('EDIT_CLASS'),
       ('EDIT_COURSE'),
       ('ADD_GUARANTOR'),
       ('EDIT_ACTIVITY'),
       ('EDIT_COURSE TEACHER'),
       ('DEFINE_COURSE_REQUIREMENTS'),
       ('ADD_PERSONAL_REQUIREMENTS'),
       ('PLACE_SCHEDULE_ACTIVITIES'),
       ('ASSIGN_SCHEDULE_CLASSES'),
       ('EDIT_PERSONAL_COURSES'),
       ('VIEW_PERSONAL_SCHEDULE'),
       ('VIEW_ANNOTATION');


