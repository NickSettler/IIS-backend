DROP TABLE IF EXISTS course_teachers;

CREATE TABLE course_teachers (
    course_abbr VARCHAR(10) NOT NULL,
    teacher_id uuid NOT NULL,
    PRIMARY KEY (course_abbr, teacher_id),
    FOREIGN KEY (course_abbr) REFERENCES courses (abbr),
    FOREIGN KEY (teacher_id) REFERENCES users (id)
);
