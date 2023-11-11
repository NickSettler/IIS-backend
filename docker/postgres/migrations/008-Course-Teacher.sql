DROP TRIGGER IF EXISTS check_user_role ON course_teachers;
DROP FUNCTION IF EXISTS check_user_role();
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
