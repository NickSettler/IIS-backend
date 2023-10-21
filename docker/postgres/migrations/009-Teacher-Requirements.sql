DROP TRIGGER IF EXISTS check_user_is_teacher ON teacher_requirements;
DROP TRIGGER IF EXISTS check_existing_teacher_requirements ON teacher_requirements;
DROP FUNCTION IF EXISTS check_user_is_teacher();
DROP FUNCTION IF EXISTS check_existing_teacher_requirements();
DROP TABLE IF EXISTS teacher_requirements;
DROP TYPE IF EXISTS teacher_req_mode;

CREATE TYPE teacher_req_mode AS ENUM ('INCLUDE',
    'EXCLUDE');

CREATE TABLE teacher_requirements
(
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID             NOT NULL,
    mode       teacher_req_mode NOT NULL,
    start_time TIMESTAMP        NOT NULL,
    end_time   TIMESTAMP        NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE FUNCTION check_user_is_teacher()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    user_username VARCHAR;
BEGIN
    PERFORM * FROM course_teachers WHERE teacher_id = NEW.teacher_id;

    IF NOT FOUND THEN
        SELECT username
        INTO user_username
        FROM users
        WHERE id = NEW.teacher_id;

        RAISE EXCEPTION 'User % is not a teacher', user_username USING ERRCODE = 'C0006';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER check_user_is_teacher
    BEFORE INSERT OR UPDATE
    ON teacher_requirements
    FOR EACH ROW
EXECUTE PROCEDURE check_user_is_teacher();

CREATE FUNCTION check_existing_teacher_requirements()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    PERFORM *
    FROM teacher_requirements
    WHERE teacher_id = NEW.teacher_id
      AND (start_time, end_time) OVERLAPS (NEW.start_time, NEW.end_time);

    IF FOUND THEN
        RAISE EXCEPTION 'Teacher requirements already exist for this time period' USING ERRCODE = 'C0008';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER check_existing_teacher_requirements
    BEFORE INSERT OR UPDATE
    ON teacher_requirements
    FOR EACH ROW
EXECUTE PROCEDURE check_existing_teacher_requirements();
