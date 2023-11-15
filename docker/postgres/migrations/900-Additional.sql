DROP TRIGGER IF EXISTS auto_insert_schedule_student ON schedule;
DROP FUNCTION IF EXISTS auto_insert_schedule_student();

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
