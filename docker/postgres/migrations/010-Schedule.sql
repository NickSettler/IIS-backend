DROP TABLE IF EXISTS schedule;
DROP FUNCTION IF EXISTS check_schedule_time();
DROP TRIGGER IF EXISTS check_schedule_time ON schedule;
DROP FUNCTION IF EXISTS check_schedule_teacher();
DROP TRIGGER IF EXISTS check_schedule_teacher ON schedule;
DROP FUNCTION IF EXISTS check_schedule_conflict();
DROP TRIGGER IF EXISTS check_schedule_conflict ON schedule;

CREATE TABLE schedule
(
    id                 uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_activity_id uuid        NOT NULL,
    teacher_id         uuid        NOT NULL,
    class_abbr         VARCHAR(10) NOT NULL,
    start_time         TIMESTAMP   NOT NULL,
    end_time           TIMESTAMP   NOT NULL CHECK (end_time > start_time),
    CONSTRAINT fk_teacher_id FOREIGN KEY (teacher_id) REFERENCES users (id),
    CONSTRAINT fk_course_activity_id FOREIGN KEY (course_activity_id) REFERENCES course_activity (id),
    CONSTRAINT fk_class_abbr FOREIGN KEY (class_abbr) REFERENCES classes (abbr)
);

-- Check if schedule time is valid
-- 1. Schedule time must be at least 1 hour
-- 2. Schedule time must be at most 4 hours
-- 3. Schedule time must be in the future
CREATE FUNCTION check_schedule_time()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    IF NEW.end_time - NEW.start_time < INTERVAL '1 hour' THEN
        RAISE EXCEPTION 'Schedule time must be at least 1 hour' USING ERRCODE = 'C0001';
    END IF;

    IF NEW.end_time - NEW.start_time > INTERVAL '4 hours' THEN
        RAISE EXCEPTION 'Schedule time must be at most 4 hours' USING ERRCODE = 'C0002';
    END IF;

    IF NEW.start_time < NOW() THEN
        RAISE EXCEPTION 'Schedule time must be in the future' USING ERRCODE = 'C0003';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER check_schedule_time
    BEFORE INSERT OR UPDATE
    ON schedule
    FOR EACH ROW
EXECUTE PROCEDURE check_schedule_time();

-- Check if teacher is teaching the course
CREATE FUNCTION check_schedule_teacher()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    selected_course_abbr VARCHAR(10);
BEGIN
    SELECT course_activity.course_abbr INTO selected_course_abbr
    FROM course_activity
    WHERE id = NEW.course_activity_id;

    PERFORM *
    FROM course_teachers
    WHERE course_abbr = selected_course_abbr
      AND teacher_id = NEW.teacher_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Teacher is not teaching the course' USING ERRCODE = 'C0005';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER check_schedule_teacher
    BEFORE INSERT OR UPDATE
    ON schedule
    FOR EACH ROW
EXECUTE PROCEDURE check_schedule_teacher();

-- Check if schedule conflicts with other schedules
-- 1. Schedule must not conflict with other schedules of the same class
CREATE FUNCTION check_schedule_conflict()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    PERFORM *
    FROM schedule
    WHERE class_abbr = NEW.class_abbr
      AND (
            (NEW.start_time BETWEEN start_time AND end_time)
            OR (NEW.end_time BETWEEN start_time AND end_time)
        )
      AND id <> NEW.id;

    IF FOUND THEN
        RAISE EXCEPTION 'Schedule conflict' USING ERRCODE = 'C0004';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER check_schedule_conflict
    BEFORE INSERT OR UPDATE
    ON schedule
    FOR EACH ROW
EXECUTE PROCEDURE check_schedule_conflict();
