DROP TABLE IF EXISTS course_activity;
DROP TYPE IF EXISTS course_forms;

CREATE TYPE course_forms AS ENUM ('LECTURE',
    'EXERCISE',
    'SEMINAR');

CREATE TABLE course_activity
(
    id           uuid                  DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id    uuid         NOT NULL,
    form         course_forms NOT NULL,
    requirements VARCHAR(512) NOT NULL DEFAULT '',
    CONSTRAINT fk_course_id FOREIGN KEY (course_id) REFERENCES courses (id) ON UPDATE CASCADE ON DELETE CASCADE
);
