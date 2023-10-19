DROP TABLE IF EXISTS course_activity;
DROP TYPE IF EXISTS course_forms;

CREATE TYPE course_forms AS ENUM ('LECTURE',
    'EXERCISE',
    'SEMINAR');

CREATE TABLE course_activity
(
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_abbr VARCHAR(10)  NOT NULL,
    form        course_forms NOT NULL,
    CONSTRAINT fk_course_abbr FOREIGN KEY (course_abbr) REFERENCES courses (abbr)
);
