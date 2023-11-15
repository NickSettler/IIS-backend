DROP TRIGGER IF EXISTS auto_insert_student ON course_students;
DROP TRIGGER IF EXISTS auto_delete_student ON course_students;
DROP TRIGGER IF EXISTS check_course_user_is_student ON student_schedule;
DROP FUNCTION IF EXISTS auto_insert_student();
DROP FUNCTION IF EXISTS auto_delete_student();
DROP FUNCTION IF EXISTS check_course_user_is_student();
DROP TABLE IF EXISTS course_students;

CREATE TABLE course_students
(
    student_id uuid NOT NULL,
    course_id  uuid NOT NULL,
    CONSTRAINT fk_student_id FOREIGN KEY (student_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_course_id FOREIGN KEY (course_id) REFERENCES courses (id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (student_id, course_id)
);

CREATE FUNCTION check_course_user_is_student()
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

CREATE TRIGGER check_course_user_is_student
    BEFORE INSERT OR UPDATE
    ON student_schedule
    FOR EACH ROW
EXECUTE PROCEDURE check_course_user_is_student();

CREATE FUNCTION auto_insert_student()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    found_schedule_item schedule%ROWTYPE;
BEGIN
    FOR found_schedule_item IN SELECT *
                               FROM schedule s
                                        INNER JOIN course_activity ca ON s.course_activity_id = ca.id
                               WHERE ca.course_id = NEW.course_id
        LOOP
            INSERT INTO student_schedule (student_id, schedule_id)
            VALUES (NEW.student_id, found_schedule_item.id);
        END LOOP;

    RETURN NEW;
END
$$;

CREATE TRIGGER auto_insert_student
    AFTER INSERT
    ON course_students
    FOR EACH ROW
EXECUTE PROCEDURE auto_insert_student();

CREATE FUNCTION auto_delete_student()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    found_schedule_item schedule%ROWTYPE;
BEGIN
    FOR found_schedule_item IN SELECT *
                               FROM schedule s
                                        INNER JOIN course_activity ca ON s.course_activity_id = ca.id
                               WHERE ca.course_id = OLD.course_id
        LOOP
            DELETE
            FROM student_schedule
            WHERE student_id = OLD.student_id
              AND schedule_id = found_schedule_item.id;
        END LOOP;

    RETURN OLD;
END
$$;

CREATE TRIGGER auto_delete_student
    AFTER DELETE
    ON course_students
    FOR EACH ROW
EXECUTE PROCEDURE auto_delete_student();
