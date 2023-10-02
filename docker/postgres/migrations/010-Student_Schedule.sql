DROP TABLE IF EXISTS student_schedule;

CREATE TABLE student_schedule
(
    student_id  uuid NOT NULL,
    schedule_id uuid NOT NULL,
    points      INT DEFAULT 0 CHECK (points >= 0 and points <= 100),
    CONSTRAINT fk_student_id FOREIGN KEY (student_id) REFERENCES users (id),
    CONSTRAINT fk_schedule_id FOREIGN KEY (schedule_id) REFERENCES schedule (id),
    PRIMARY KEY (student_id, schedule_id)
);
