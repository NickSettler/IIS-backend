DROP TRIGGER IF EXISTS check_user_is_student ON student_schedule;
DROP FUNCTION IF EXISTS check_user_is_student();
DROP TABLE IF EXISTS student_schedule;

CREATE TABLE student_schedule
(
    student_id  uuid NOT NULL,
    schedule_id uuid NOT NULL,
    CONSTRAINT fk_student_id FOREIGN KEY (student_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_schedule_id FOREIGN KEY (schedule_id) REFERENCES schedule (id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (student_id, schedule_id)
);

CREATE FUNCTION check_user_is_student()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    user_username VARCHAR;
BEGIN
    PERFORM *
    FROM user_roles
    WHERE user_id = NEW.student_id
      AND role_name = 'STUDENT';

    IF NOT FOUND THEN
        SELECT username
        INTO user_username
        FROM users
        WHERE id = NEW.student_id;

        RAISE EXCEPTION 'User % is not a student', user_username USING ERRCODE = 'C0063';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER check_user_is_student
    BEFORE INSERT OR UPDATE
    ON student_schedule
    FOR EACH ROW
EXECUTE PROCEDURE check_user_is_student();
