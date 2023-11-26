DROP TRIGGER IF EXISTS check_user_role ON course_teachers;
DROP TRIGGER IF EXISTS check_teacher_schedule ON course_teachers;
DROP TRIGGER IF EXISTS course_teacher_check_guarantor ON course_teachers;
DROP FUNCTION IF EXISTS check_user_role();
DROP FUNCTION IF EXISTS check_teacher_schedule();
DROP FUNCTION IF EXISTS course_teacher_check_guarantor();
DROP TABLE IF EXISTS course_teachers;

CREATE TABLE course_teachers
(
    course_id  uuid NOT NULL,
    teacher_id uuid NOT NULL,
    PRIMARY KEY (course_id, teacher_id),
    FOREIGN KEY (course_id) REFERENCES courses (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE FUNCTION check_user_role()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    user_username VARCHAR;
BEGIN
    PERFORM *
    FROM user_roles
    WHERE user_id = NEW.teacher_id
      AND role_name = 'TEACHER';

    IF NOT FOUND THEN
        SELECT username
        INTO user_username
        FROM users
        WHERE id = NEW.teacher_id;

        RAISE EXCEPTION 'User % is not a teacher', user_username USING ERRCODE = 'C0061';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER check_user_role
    BEFORE INSERT OR UPDATE
    ON course_teachers
    FOR EACH ROW
EXECUTE PROCEDURE check_user_role();

CREATE FUNCTION check_teacher_schedule()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    PERFORM *
    FROM schedule
             INNER JOIN course_activity ca on ca.id = schedule.course_activity_id
             INNER JOIN courses c on c.id = ca.course_id
    WHERE teacher_id = OLD.teacher_id
    AND c.id = OLD.course_id;

    IF FOUND THEN
        RAISE EXCEPTION 'Teacher % has schedule items for the course', OLD.teacher_id USING ERRCODE = 'C0010';
    END IF;

    RETURN OLD;
END
$$;

CREATE TRIGGER check_teacher_schedule
    BEFORE DELETE
    ON course_teachers
    FOR EACH ROW
EXECUTE PROCEDURE check_teacher_schedule();

CREATE FUNCTION course_teacher_check_guarantor()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    PERFORM * FROM courses WHERE guarantor_id = OLD.teacher_id AND id = OLD.course_id;

    RAISE NOTICE 'Guarantor is a teacher of their course.';

    IF FOUND THEN
        RAISE EXCEPTION 'Guarantor must be a teacher of their course.' USING ERRCODE = 'C0011';
    END IF;

    RETURN OLD;
END
$$;

CREATE TRIGGER course_teacher_check_guarantor
    BEFORE DELETE
    ON course_teachers
    FOR EACH ROW
EXECUTE PROCEDURE course_teacher_check_guarantor();
