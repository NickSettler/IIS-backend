-- A Classes
INSERT INTO classes (abbr, capacity)
VALUES ('A112', 64);
INSERT INTO classes (abbr, capacity)
VALUES ('A113', 64);
INSERT INTO classes (abbr, capacity)
VALUES ('A218', 20);

-- D Classes
INSERT INTO classes (abbr, capacity)
VALUES ('D105', 299);

-- E Classes
INSERT INTO classes (abbr, capacity)
VALUES ('E104', 72);
INSERT INTO classes (abbr, capacity)
VALUES ('E105', 72);
INSERT INTO classes (abbr, capacity)
VALUES ('E112', 156);

-- Users
INSERT INTO users (id, first_name, last_name, username, password)
VALUES ('11111111-1111-1111-1111-111111111111',
        'John',
        'Smith',
        'john.smith',
        crypt('password', gen_salt('bf', 8)));

INSERT INTO users (id, first_name, last_name, username, password)
VALUES ('22222222-2222-2222-2222-222222222222',
        'Jane',
        'Doe',
        'jane.doe',
        crypt('password', gen_salt('bf', 8)));

INSERT INTO users (id, first_name, last_name, username, password)
VALUES ('33333333-3333-3333-3333-000000000001',
        'Student',
        'One',
        'student.one',
        crypt('password', gen_salt('bf', 8)));

INSERT INTO users (id, first_name, last_name, username, password)
VALUES ('33333333-3333-3333-3333-000000000002',
        'Student',
        'Two',
        'student.two',
        crypt('password', gen_salt('bf', 8)));

INSERT INTO users (id, first_name, last_name, username, password)
VALUES ('33333333-3333-3333-3333-000000000003',
        'Student',
        'Three',
        'student.three',
        crypt('password', gen_salt('bf', 8)));

INSERT INTO users (id, first_name, last_name, username, password)
VALUES ('33333333-3333-3333-3333-000000000004',
        'Student',
        'Four',
        'student.four',
        crypt('password', gen_salt('bf', 8)));

-- User Roles
INSERT INTO user_roles (user_id, role_name)
VALUES ('11111111-1111-1111-1111-111111111111', 'GUARANTOR');
INSERT INTO user_roles (user_id, role_name)
VALUES ('22222222-2222-2222-2222-222222222222', 'GUARANTOR');
INSERT INTO user_roles (user_id, role_name)
VALUES ('11111111-1111-1111-1111-111111111111', 'TEACHER');
INSERT INTO user_roles (user_id, role_name)
VALUES ('22222222-2222-2222-2222-222222222222', 'TEACHER');
INSERT INTO user_roles (user_id, role_name)
VALUES ('33333333-3333-3333-3333-000000000001', 'STUDENT');
INSERT INTO user_roles (user_id, role_name)
VALUES ('33333333-3333-3333-3333-000000000002', 'STUDENT');
INSERT INTO user_roles (user_id, role_name)
VALUES ('33333333-3333-3333-3333-000000000003', 'STUDENT');
INSERT INTO user_roles (user_id, role_name)
VALUES ('33333333-3333-3333-3333-000000000004', 'STUDENT');


-- Courses
INSERT INTO courses (abbr, guarantor_id, name, credits, annotation)
VALUES ('ILG', '11111111-1111-1111-1111-111111111111', 'Linear Algebra', 5, 'Linear Algebra Annotation');
INSERT INTO courses (abbr, guarantor_id, name, credits, annotation)
VALUES ('IDM', '11111111-1111-1111-1111-111111111111', 'Discrete Mathematics', 3, 'Discrete Mathematics Annotation');
INSERT INTO courses (abbr, guarantor_id, name, credits, annotation)
VALUES ('IOS', '22222222-2222-2222-2222-222222222222', 'Operating Systems', 4, 'Operating Systems Annotation');
INSERT INTO courses (abbr, guarantor_id, name, credits, annotation)
VALUES ('IFG', '11111111-1111-1111-1111-111111111111', 'Formal Languages and Grammars', 4,
        'Formal Languages and Grammars Annotation');
INSERT INTO courses (abbr, guarantor_id, name, credits, annotation)
VALUES ('IIS', '22222222-2222-2222-2222-222222222222', 'Information Systems', 5, 'Information Systems Annotation');

-- Course Teachers
-- ILG
INSERT INTO course_teachers (course_abbr, teacher_id)
VALUES ('ILG', '11111111-1111-1111-1111-111111111111');
INSERT INTO course_teachers (course_abbr, teacher_id)
VALUES ('ILG', '22222222-2222-2222-2222-222222222222');

-- IDM
INSERT INTO course_teachers (course_abbr, teacher_id)
VALUES ('IDM', '22222222-2222-2222-2222-222222222222');

-- IOS
INSERT INTO course_teachers (course_abbr, teacher_id)
VALUES ('IOS', '22222222-2222-2222-2222-222222222222');

-- IFG
INSERT INTO course_teachers (course_abbr, teacher_id)
VALUES ('IFG', '11111111-1111-1111-1111-111111111111');
INSERT INTO course_teachers (course_abbr, teacher_id)
VALUES ('IFG', '22222222-2222-2222-2222-222222222222');

-- IIS
INSERT INTO course_teachers (course_abbr, teacher_id)
VALUES ('IIS', '11111111-1111-1111-1111-111111111111');


-- Course Activities
-- ILG
INSERT INTO course_activity (id, course_abbr, form)
VALUES ('33333333-3333-3333-3333-000000000001', 'ILG', 'LECTURE');
INSERT INTO course_activity (id, course_abbr, form)
VALUES ('33333333-3333-3333-3333-000000000002', 'ILG', 'SEMINAR');

-- IDM
INSERT INTO course_activity (id, course_abbr, form)
VALUES ('33333333-3333-3333-3333-000000000011', 'IDM', 'LECTURE');

-- IOS
INSERT INTO course_activity (id, course_abbr, form)
VALUES ('33333333-3333-3333-3333-000000000021', 'IOS', 'LECTURE');
INSERT INTO course_activity (id, course_abbr, form)
VALUES ('33333333-3333-3333-3333-000000000022', 'IOS', 'EXERCISE');

-- IFG
INSERT INTO course_activity (id, course_abbr, form)
VALUES ('33333333-3333-3333-3333-000000000031', 'IFG', 'LECTURE');
INSERT INTO course_activity (id, course_abbr, form)
VALUES ('33333333-3333-3333-3333-000000000032', 'IFG', 'SEMINAR');
INSERT INTO course_activity (id, course_abbr, form)
VALUES ('33333333-3333-3333-3333-000000000033', 'IFG', 'EXERCISE');

-- IIS
INSERT INTO course_activity (id, course_abbr, form)
VALUES ('33333333-3333-3333-3333-000000000041', 'IIS', 'LECTURE');

-- Schedule Item
-- ILG
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000001', '11111111-1111-1111-1111-111111111111', 'A112',
        '2024-02-01 08:00:00', '2024-02-01 09:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000002', '11111111-1111-1111-1111-111111111111', 'A112',
        '2024-02-01 10:00:00', '2024-02-01 11:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000002', '11111111-1111-1111-1111-111111111111', 'A112',
        '2024-02-01 12:00:00', '2024-02-01 13:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000002', '11111111-1111-1111-1111-111111111111', 'A112',
        '2024-02-01 14:00:00', '2024-02-01 15:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000001', '11111111-1111-1111-1111-111111111111', 'A112',
        '2024-02-04 08:00:00', '2024-02-01 09:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000002', '11111111-1111-1111-1111-111111111111', 'A112',
        '2024-02-04 10:00:00', '2024-02-01 11:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000002', '11111111-1111-1111-1111-111111111111', 'A112',
        '2024-02-04 12:00:00', '2024-02-01 13:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000002', '11111111-1111-1111-1111-111111111111', 'A112',
        '2024-02-04 14:00:00', '2024-02-01 15:50:00');

-- IDM
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000011', '22222222-2222-2222-2222-222222222222', 'A113',
        '2024-02-01 08:00:00', '2024-02-01 09:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000011', '22222222-2222-2222-2222-222222222222', 'A113',
        '2024-02-01 10:00:00', '2024-02-01 11:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000011', '22222222-2222-2222-2222-222222222222', 'A113',
        '2024-02-01 12:00:00', '2024-02-01 13:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000011', '22222222-2222-2222-2222-222222222222', 'A113',
        '2024-02-01 14:00:00', '2024-02-01 15:50:00');

-- IOS
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000021', '22222222-2222-2222-2222-222222222222', 'A218',
        '2024-02-01 08:00:00', '2024-02-01 09:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000021', '22222222-2222-2222-2222-222222222222', 'A218',
        '2024-02-01 10:00:00', '2024-02-01 11:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000021', '22222222-2222-2222-2222-222222222222', 'A218',
        '2024-02-01 12:00:00', '2024-02-01 13:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000021', '22222222-2222-2222-2222-222222222222', 'A218',
        '2024-02-01 14:00:00', '2024-02-01 15:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000022', '22222222-2222-2222-2222-222222222222', 'A218',
        '2024-02-04 08:00:00', '2024-02-01 09:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000022', '22222222-2222-2222-2222-222222222222', 'A218',
        '2024-02-04 10:00:00', '2024-02-01 11:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000022', '22222222-2222-2222-2222-222222222222', 'A218',
        '2024-02-04 12:00:00', '2024-02-01 13:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000022', '22222222-2222-2222-2222-222222222222', 'A218',
        '2024-02-04 14:00:00', '2024-02-01 15:50:00');

-- IFG
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000031', '11111111-1111-1111-1111-111111111111', 'D105',
        '2024-02-01 08:00:00', '2024-02-01 09:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000031', '11111111-1111-1111-1111-111111111111', 'D105',
        '2024-02-01 11:00:00', '2024-02-01 12:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000031', '11111111-1111-1111-1111-111111111111', 'D105',
        '2024-02-01 13:00:00', '2024-02-01 14:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000031', '11111111-1111-1111-1111-111111111111', 'D105',
        '2024-02-01 15:00:00', '2024-02-01 16:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000032', '11111111-1111-1111-1111-111111111111', 'D105',
        '2024-02-04 08:00:00', '2024-02-01 09:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000032', '11111111-1111-1111-1111-111111111111', 'D105',
        '2024-02-04 11:00:00', '2024-02-01 12:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000032', '11111111-1111-1111-1111-111111111111', 'D105',
        '2024-02-04 15:00:00', '2024-02-01 16:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000032', '11111111-1111-1111-1111-111111111111', 'D105',
        '2024-02-04 17:00:00', '2024-02-01 18:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000033', '11111111-1111-1111-1111-111111111111', 'D105',
        '2024-02-05 08:00:00', '2024-02-01 09:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000033', '11111111-1111-1111-1111-111111111111', 'D105',
        '2024-02-05 11:00:00', '2024-02-01 12:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000033', '11111111-1111-1111-1111-111111111111', 'D105',
        '2024-02-05 13:00:00', '2024-02-01 14:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000033', '11111111-1111-1111-1111-111111111111', 'D105',
        '2024-02-05 15:00:00', '2024-02-01 16:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000033', '11111111-1111-1111-1111-111111111111', 'D105',
        '2024-02-05 17:00:00', '2024-02-01 18:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000033', '22222222-2222-2222-2222-222222222222', 'D105',
        '2024-02-05 08:00:00', '2024-02-01 09:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000033', '22222222-2222-2222-2222-222222222222', 'D105',
        '2024-02-05 11:00:00', '2024-02-01 12:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000033', '22222222-2222-2222-2222-222222222222', 'D105',
        '2024-02-05 13:00:00', '2024-02-01 14:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000033', '22222222-2222-2222-2222-222222222222', 'D105',
        '2024-02-05 15:00:00', '2024-02-01 16:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000033', '22222222-2222-2222-2222-222222222222', 'D105',
        '2024-02-05 17:00:00', '2024-02-01 18:50:00');

-- IIS
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000041', '11111111-1111-1111-1111-111111111111', 'E104',
        '2024-02-01 08:00:00', '2024-02-01 09:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000041', '11111111-1111-1111-1111-111111111111', 'E104',
        '2024-02-01 10:00:00', '2024-02-01 11:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000041', '11111111-1111-1111-1111-111111111111', 'E104',
        '2024-02-01 12:00:00', '2024-02-01 13:50:00');
INSERT INTO schedule (course_activity_id, teacher_id, class_abbr, start_time, end_time)
VALUES ('33333333-3333-3333-3333-000000000041', '11111111-1111-1111-1111-111111111111', 'E104',
        '2024-02-01 14:00:00', '2024-02-01 15:50:00');
