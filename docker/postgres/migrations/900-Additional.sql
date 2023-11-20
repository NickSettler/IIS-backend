DROP TRIGGER IF EXISTS auto_insert_schedule_student ON schedule;
DROP TRIGGER IF EXISTS roles_teacher_check ON user_roles;
DROP TRIGGER IF EXISTS roles_guarantor_check ON user_roles;
DROP TRIGGER IF EXISTS roles_student_check ON user_roles;
DROP FUNCTION IF EXISTS auto_insert_schedule_student();
DROP FUNCTION IF EXISTS roles_teacher_check();
DROP FUNCTION IF EXISTS roles_guarantor_check();
DROP FUNCTION IF EXISTS roles_student_check();

CREATE FUNCTION auto_insert_schedule_student()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    course_student course_students%ROWTYPE;
BEGIN
    FOR course_student in SELECT *
                          FROM course_students cs
                                   INNER JOIN public.courses c on c.id = cs.course_id
                                   INNER JOIN public.course_activity ca on c.id = ca.course_id
                          WHERE ca.id = NEW.course_activity_id
        LOOP
            INSERT INTO student_schedule (student_id, schedule_id)
            VALUES (course_student.student_id, NEW.id);
        END LOOP;

    RETURN NEW;
END
$$;

CREATE TRIGGER auto_insert_schedule_student
    AFTER INSERT
    ON schedule
    FOR EACH ROW
EXECUTE PROCEDURE auto_insert_schedule_student();

CREATE FUNCTION roles_teacher_check()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    PERFORM * FROM schedule WHERE teacher_id = OLD.user_id;

    IF FOUND AND OLD.role_name = 'TEACHER' THEN
        RAISE EXCEPTION 'Teacher cannot be deleted because they have schedule items' USING ERRCODE = 'C0101';
    END IF;

    DELETE FROM teacher_requirements WHERE teacher_id = OLD.user_id;

    DELETE FROM course_teachers WHERE teacher_id = OLD.user_id;

    RETURN OLD;
END
$$;

CREATE TRIGGER roles_teacher_check
    AFTER DELETE
    ON user_roles
    FOR EACH ROW
EXECUTE PROCEDURE roles_teacher_check();

CREATE FUNCTION roles_guarantor_check()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    PERFORM * FROM courses WHERE guarantor_id = OLD.user_id;

    IF FOUND AND OLD.role_name = 'GUARANTOR' THEN
        RAISE EXCEPTION 'Guarantor cannot be deleted because they have courses' USING ERRCODE = 'C0102';
    END IF;

    RETURN OLD;
END
$$;

CREATE TRIGGER roles_guarantor_check
    AFTER DELETE
    ON user_roles
    FOR EACH ROW
EXECUTE PROCEDURE roles_guarantor_check();

CREATE FUNCTION roles_student_check()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    PERFORM * FROM course_students WHERE student_id = OLD.user_id;

    IF FOUND AND OLD.role_name = 'STUDENT' THEN
        RAISE EXCEPTION 'Student cannot be deleted because they have courses' USING ERRCODE = 'C0103';
    END IF;

    PERFORM * FROM student_schedule WHERE student_id = OLD.user_id;

    IF FOUND AND OLD.role_name = 'STUDENT' THEN
        RAISE EXCEPTION 'Student cannot be deleted because they have schedule items' USING ERRCODE = 'C0104';
    END IF;

    RETURN OLD;
END
$$;

CREATE TRIGGER roles_student_check
    AFTER DELETE
    ON user_roles
    FOR EACH ROW
EXECUTE PROCEDURE roles_student_check();
