DROP TABLE IF EXISTS schedule;

CREATE TABLE schedule
(
    id                 uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_activity_id uuid        NOT NULL,
    class_abbr         VARCHAR(10) NOT NULL,
    start_time         TIMESTAMP   NOT NULL,
    end_time           TIMESTAMP   NOT NULL CHECK (end_time > start_time),
    CONSTRAINT fk_course_activity_id FOREIGN KEY (course_activity_id) REFERENCES course_activity (id),
    CONSTRAINT fk_class_abbr FOREIGN KEY (class_abbr) REFERENCES classes (abbr)

);
