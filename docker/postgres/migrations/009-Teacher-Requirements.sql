DROP TRIGGER IF EXISTS check_user_is_teacher ON teacher_requirements;
DROP TRIGGER IF EXISTS check_existing_teacher_requirements ON teacher_requirements;
DROP TRIGGER IF EXISTS check_teacher_requirements_time ON teacher_requirements;
DROP FUNCTION IF EXISTS check_user_is_teacher();
DROP FUNCTION IF EXISTS check_existing_teacher_requirements();
DROP FUNCTION IF EXISTS check_teacher_requirements_time();
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
    end_time   TIMESTAMP        NOT NULL CHECK (end_time > start_time),
    FOREIGN KEY (teacher_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE FUNCTION check_user_is_teacher()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    user_role VARCHAR;
BEGIN
    SELECT role_name INTO user_role FROM user_roles WHERE user_id = NEW.teacher_id;

    IF user_role != 'TEACHER' THEN
        RAISE EXCEPTION 'User is not a teacher' USING ERRCODE = 'C0061';
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
      AND NEW.id IS DISTINCT FROM id
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

CREATE FUNCTION check_teacher_requirements_time()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN

    IF NEW.start_time < NOW() THEN
        RAISE EXCEPTION 'Time must be in the future' USING ERRCODE = 'C0009';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER check_teacher_requirements_time
    BEFORE INSERT OR UPDATE
    ON teacher_requirements
    FOR EACH ROW
EXECUTE PROCEDURE check_teacher_requirements_time();
