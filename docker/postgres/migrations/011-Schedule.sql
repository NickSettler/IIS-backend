DROP TRIGGER IF EXISTS check_schedule_time ON schedule;
DROP TRIGGER IF EXISTS check_schedule_teacher ON schedule;
DROP TRIGGER IF EXISTS check_schedule_conflict ON schedule;
DROP TRIGGER IF EXISTS check_teacher_requirements ON schedule;
DROP FUNCTION IF EXISTS check_schedule_time();
DROP FUNCTION IF EXISTS check_schedule_teacher();
DROP FUNCTION IF EXISTS check_schedule_conflict();
DROP FUNCTION IF EXISTS check_teacher_requirements();
DROP TABLE IF EXISTS schedule;

CREATE TABLE schedule
(
    id                 uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_activity_id uuid      NOT NULL,
    teacher_id         uuid      NOT NULL,
    class_id           uuid,
    start_time         TIMESTAMP NOT NULL,
    end_time           TIMESTAMP NOT NULL CHECK (end_time > start_time),
    CONSTRAINT fk_teacher_id FOREIGN KEY (teacher_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_course_activity_id FOREIGN KEY (course_activity_id) REFERENCES course_activity (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_class_id FOREIGN KEY (class_id) REFERENCES classes (id) ON UPDATE CASCADE ON DELETE SET NULL
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
    SELECT course_activity.course_abbr
    INTO selected_course_abbr
    FROM course_activity
    WHERE id = NEW.course_activity_id;

    PERFORM *
    FROM course_teachers
    WHERE course_abbr = selected_course_abbr
      AND teacher_id = NEW.teacher_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Teacher is not teaching this course' USING ERRCODE = 'C0005';
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
    WHERE class_id = NEW.class_id
      AND (
            (NEW.start_time BETWEEN start_time AND end_time)
            OR (NEW.end_time BETWEEN start_time AND end_time)
        )
      AND id <> NEW.id;

    IF FOUND THEN
        RAISE EXCEPTION 'This class is already occupied for this time' USING ERRCODE = 'C0004';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER check_schedule_conflict
    BEFORE INSERT OR UPDATE
    ON schedule
    FOR EACH ROW
EXECUTE PROCEDURE check_schedule_conflict();

-- Check if teacher not excluded this time in requirements
CREATE FUNCTION check_teacher_requirements()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    PERFORM *
    FROM teacher_requirements
    WHERE teacher_id = NEW.teacher_id
      AND (
            (NEW.start_time BETWEEN start_time AND end_time)
            OR (NEW.end_time BETWEEN start_time AND end_time)
        )
      AND mode = 'EXCLUDE';

    IF FOUND THEN
        RAISE EXCEPTION 'Teacher has excluded this time in his requirements' USING ERRCODE = 'C0007';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER check_teacher_requirements
    BEFORE INSERT OR UPDATE
    ON schedule
    FOR EACH ROW
EXECUTE PROCEDURE check_teacher_requirements();
