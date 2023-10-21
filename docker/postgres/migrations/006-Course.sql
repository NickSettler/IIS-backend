DROP TRIGGER IF EXISTS auto_insert_course_guarantor ON courses;
DROP FUNCTION IF EXISTS auto_insert_course_guarantor();
DROP TABLE IF EXISTS courses;

CREATE TABLE courses
(
    abbr         VARCHAR(10) PRIMARY KEY,
    guarantor_id uuid         NOT NULL,
    name         VARCHAR(255) NOT NULL UNIQUE,
    credits      INT          NOT NULL CHECK (credits > 0 and credits < 20),
    annotation   VARCHAR(512) NOT NULL DEFAULT '',
    CONSTRAINT fk_guarantor_id FOREIGN KEY (guarantor_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE FUNCTION auto_insert_course_guarantor()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO course_teachers (course_abbr, teacher_id)
    VALUES (NEW.abbr, NEW.guarantor_id);

    RETURN NEW;
END
$$;

CREATE TRIGGER auto_insert_course_guarantor
    AFTER INSERT ON courses
    FOR EACH ROW
    EXECUTE PROCEDURE auto_insert_course_guarantor();
