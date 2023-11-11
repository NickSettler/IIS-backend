DO
$$
    DECLARE
        ADMIN_UUID_1                uuid    := 'da7010df-11c0-40c0-8263-f6b752222903';
        DECLARE GUARANTOR_UUID_1    uuid    := 'db325bed-c4e3-48f1-be1b-b29967ce7c75';
        DECLARE GUARANTOR_UUID_2    uuid    := '987b043f-acaa-4cd9-b1bf-a73c56cdaa1a';
        DECLARE TEACHER_UUID_1      uuid    := '82a67b51-3a66-4c12-8fed-db635ea42ca0';
        DECLARE TEACHER_UUID_2      uuid    := 'ceb91498-3fb2-4524-8e55-0c1b7f485375';
        DECLARE TEACHER_UUID_3      uuid    := '8c792300-e3a2-4e71-aa1f-52c18246dfd0';
        DECLARE SCHEDULER_UUID_1    uuid    := '94da0d3d-870a-4923-98e5-b317b0f6f923';
        DECLARE STUDENT_UUID_1      uuid    := '5003f77b-2352-44f5-95ff-dd30c1d5f91b';
        DECLARE STUDENT_UUID_2      uuid    := '3a014c93-8f01-49c3-b08f-100d0c910ba8';
        DECLARE STUDENT_UUID_3      uuid    := '5c60d405-9343-47d6-bbb8-242702f9cb56';
        DECLARE STUDENT_UUID_4      uuid    := 'a6599e18-61d7-451e-a15e-70002b7c5a32';
        DECLARE STUDENT_UUID_5      uuid    := '7bc41479-0163-4430-a23d-df9f0fc9a2d8';
        DECLARE CLASS_UUID_1        uuid    := '171c546f-cf84-4ccb-aee2-32ac6abc3051';
        DECLARE CLASS_UUID_2        uuid    := '74ec21f2-7203-4adf-b982-79fc6f7691be';
        DECLARE CLASS_UUID_3        uuid    := '4a248f66-39a8-4582-991d-a622357ed6bd';
        DECLARE CLASS_UUID_4        uuid    := '41e21ae3-2fca-46ea-a729-ab371124c6d0';
        DECLARE CLASS_UUID_5        uuid    := '0aeab050-2f37-48bb-a129-0b36ac9ca71a';
        DECLARE CLASS_UUID_6        uuid    := '9f528627-5813-49db-8953-7763938ac347';
        DECLARE CLASS_UUID_7        uuid    := '5ad436e2-cea2-4067-8310-32de6184e59b';
        DECLARE COURSE_ABBR_1       varchar := 'IDS';
        DECLARE COURSE_ABBR_2       varchar := 'ILG';
        DECLARE COURSE_ABBR_3       varchar := 'IIS';
        DECLARE COURSE_ABBR_4       varchar := 'ITU';
        DECLARE COURSE_ABBR_5       varchar := 'IFJ';
        DECLARE COURSE_ACTIVITY_1_1 uuid    := 'bbed4af6-a4bd-48c6-b486-7255c349db98';
        DECLARE COURSE_ACTIVITY_1_2 uuid    := '59f5342f-c4a3-420e-98a2-4603accdc8b3';
        DECLARE COURSE_ACTIVITY_2_1 uuid    := '08d93ee4-1657-4d90-a938-ec0c20616ece';
        DECLARE COURSE_ACTIVITY_2_2 uuid    := '785361a2-1663-425b-a82a-67d9d8f0654f';
        DECLARE COURSE_ACTIVITY_3_1 uuid    := '2138d6ad-2269-43d7-b5fb-11e4528a59c9';
        DECLARE COURSE_ACTIVITY_3_2 uuid    := 'dcbe35f8-9216-42a0-aeeb-45056ce2222d';
        DECLARE COURSE_ACTIVITY_3_3 uuid    := '6599b9c1-97ab-47cd-8904-b8855b26e8d6';
        DECLARE COURSE_ACTIVITY_4_1 uuid    := 'c8ca1b35-be3f-4eb8-9129-d506883eb8bc';
        DECLARE COURSE_ACTIVITY_4_2 uuid    := '3bd70920-6526-49f4-afc9-139c6ebabb57';
        DECLARE COURSE_ACTIVITY_5_1 uuid    := '96d0a7b2-b83e-4812-9ba9-2a41570387a0';
        DECLARE COURSE_ACTIVITY_5_2 uuid    := '518fb24b-474c-4dfc-a599-e2033b53566c';
        DECLARE SCHEDULE_ITEM_1_1_1 uuid    := '46e4e41a-a77a-4cc6-8c0a-ee393eb91e8f';
        DECLARE SCHEDULE_ITEM_1_1_2 uuid    := '8e2226a8-a481-4fb3-abfd-95e91e390ac9';
        DECLARE SCHEDULE_ITEM_1_2_1 uuid    := 'd8b1c264-ec5e-40d0-be32-961984ab47d2';
        DECLARE SCHEDULE_ITEM_1_2_2 uuid    := 'ccd213e7-f8cc-4c24-8fad-3ddfec7aa38b';
        DECLARE SCHEDULE_ITEM_2_1_1 uuid    := 'c01272aa-9ecd-4bbb-b916-d22de28b32fb';
        DECLARE SCHEDULE_ITEM_2_1_2 uuid    := '1a888bda-219e-4d39-a9fd-943ce8c1b0ea';
        DECLARE SCHEDULE_ITEM_2_2_1 uuid    := '09d81386-9b13-4bd4-a12e-c48bfab37892';
        DECLARE SCHEDULE_ITEM_2_2_2 uuid    := '7ebccf63-380c-44b8-b20e-42e0a25c95a4';
        DECLARE SCHEDULE_ITEM_3_1_1 uuid    := '8b845a6a-ded9-427d-bff1-04e8e485fd74';
        DECLARE SCHEDULE_ITEM_3_1_2 uuid    := 'fc91df36-ff85-4394-8bf9-9981155cd2e8';
        DECLARE SCHEDULE_ITEM_3_2_1 uuid    := 'e3abeb02-37db-440d-9288-d13aa04b9e98';
        DECLARE SCHEDULE_ITEM_3_2_2 uuid    := '61fc3063-ef6e-4b42-a76c-a56d3285e4f5';
        DECLARE SCHEDULE_ITEM_3_3_1 uuid    := 'b1e94222-7c89-46dd-97ad-749a58c95e7e';
        DECLARE SCHEDULE_ITEM_3_3_2 uuid    := '12df785f-e468-4c9c-8db9-e685b2a53c26';
        DECLARE SCHEDULE_ITEM_4_1_1 uuid    := '5482e998-fed1-4fc4-9995-ce043459c99b';
        DECLARE SCHEDULE_ITEM_4_1_2 uuid    := '461c709a-5fe6-485d-82f7-5e082151f264';
        DECLARE SCHEDULE_ITEM_4_2_1 uuid    := '418f98ea-db19-41e6-8d01-a6482ff79c8a';
        DECLARE SCHEDULE_ITEM_4_2_2 uuid    := '71a2bbb6-d382-4a6d-bfe0-60a01a247e8c';
        DECLARE SCHEDULE_ITEM_5_1_1 uuid    := 'bedbf815-8576-4b9e-92e3-b9ff5b0a4760';
        DECLARE SCHEDULE_ITEM_5_1_2 uuid    := '68336941-a2bf-4574-9b17-748b2b3a83b9';
        DECLARE SCHEDULE_ITEM_5_2_1 uuid    := '17c196fc-b80a-4476-b4c8-861e14423b2e';
        DECLARE SCHEDULE_ITEM_5_2_2 uuid    := '09f0e89a-1ad6-43bf-8a7f-daab59467309';
    BEGIN
        /* Script Info
            -- 2 Guarantors
            -- 3 Teachers
            -- 1 Scheduler
            -- 5 Students
            -- 5 Courses

            Courses 1, 3, 4:
                Guarantor: 1
                Teachers: 1, 2
            Courses 2, 5:
                Guarantor: 2
                Teachers: 3

            Course 1:
                Activities: 1_1 (LECTURE), 1_2 (SEMINAR)
                Lecture: Mon 9:00-10:50 (D105, Teacher 1)
                Seminar: Mon 11:00-12:50 (E104, Teacher 1)
                Students: 1, 2
            Course 2:
                Activities: 2_1 (LECTURE), 2_2 (EXERCISE)
                Lecture: Mon 16:00-17:50 (D105, Teacher 3)
                Exercise: Tue 8:00-9:50 (A112, Teacher 3)
                Students: 1, 3, 4, 5
            Course 3:
                Activities: 3_1 (LECTURE), 3_2 (EXERCISE), 3_3 (SEMINAR)
                Lecture: Tue 12:00-13:50 (D105, Teacher 2)
                Exercise: Thu 14:00-15:50 (A112, Teacher 2)
                Seminar: Wed 8:00-9:50 (E105, Teacher 2)
                Students: 2, 3, 4, 5
            Course 4:
                Activities: 4_1 (LECTURE), 4_2 (SEMINAR)
                Lecture: Tue 16:00-18:50 (D105, Teacher 2)
                Seminar: Thu 8:00-9:50 (E105, Teacher 2)
                Students: 1, 2
            Course 5:
                Activities: 5_1 (LECTURE), 5_2 (EXERCISE)
                Lecture: Wed 11:00-12:50 (D105, Teacher 3)
                Exercise: Wed 13:00-14:50 (E105, Teacher 3)
                Students: 3, 4, 5
         */

        -- Classes
        INSERT INTO classes (id, abbr, capacity)
        VALUES (CLASS_UUID_1, 'A112', 64);
        INSERT INTO classes (id, abbr, capacity)
        VALUES (CLASS_UUID_2, 'A113', 64);
        INSERT INTO classes (id, abbr, capacity)
        VALUES (CLASS_UUID_3, 'A218', 20);
        INSERT INTO classes (id, abbr, capacity)
        VALUES (CLASS_UUID_4, 'D105', 299);
        INSERT INTO classes (id, abbr, capacity)
        VALUES (CLASS_UUID_5, 'E104', 72);
        INSERT INTO classes (id, abbr, capacity)
        VALUES (CLASS_UUID_6, 'E105', 72);
        INSERT INTO classes (id, abbr, capacity)
        VALUES (CLASS_UUID_7, 'E112', 156);

        -- Users
        INSERT INTO users (id, first_name, last_name, username, password)
        VALUES (ADMIN_UUID_1,
                'Admin',
                'User',
                'admin',
                crypt('password', gen_salt('bf', 8)));
        INSERT INTO users (id, first_name, last_name, username, password)
        VALUES (GUARANTOR_UUID_1,
                'John',
                'Smith',
                'john.smith',
                crypt('password', gen_salt('bf', 8)));
        INSERT INTO users (id, first_name, last_name, username, password)
        VALUES (GUARANTOR_UUID_2,
                'Jane',
                'Doe',
                'jane.doe',
                crypt('password', gen_salt('bf', 8)));
        INSERT INTO users (id, first_name, last_name, username, password)
        VALUES (TEACHER_UUID_1,
                'Teacher',
                'One',
                'teacher.one',
                crypt('password', gen_salt('bf', 8)));
        INSERT INTO users (id, first_name, last_name, username, password)
        VALUES (TEACHER_UUID_2,
                'Teacher',
                'Two',
                'teacher.two',
                crypt('password', gen_salt('bf', 8)));
        INSERT INTO users (id, first_name, last_name, username, password)
        VALUES (TEACHER_UUID_3,
                'Teacher',
                'Three',
                'teacher.three',
                crypt('password', gen_salt('bf', 8)));
        INSERT INTO users (id, first_name, last_name, username, password)
        VALUES (SCHEDULER_UUID_1,
                'Scheduler',
                'One',
                'scheduler.one',
                crypt('password', gen_salt('bf', 8)));
        INSERT INTO users (id, first_name, last_name, username, password)
        VALUES (STUDENT_UUID_1,
                'Student',
                'One',
                'student.one',
                crypt('password', gen_salt('bf', 8)));
        INSERT INTO users (id, first_name, last_name, username, password)
        VALUES (STUDENT_UUID_2,
                'Student',
                'Two',
                'student.two',
                crypt('password', gen_salt('bf', 8)));
        INSERT INTO users (id, first_name, last_name, username, password)
        VALUES (STUDENT_UUID_3,
                'Student',
                'Three',
                'student.three',
                crypt('password', gen_salt('bf', 8)));
        INSERT INTO users (id, first_name, last_name, username, password)
        VALUES (STUDENT_UUID_4,
                'Student',
                'Four',
                'student.four',
                crypt('password', gen_salt('bf', 8)));
        INSERT INTO users (id, first_name, last_name, username, password)
        VALUES (STUDENT_UUID_5,
                'Student',
                'Five',
                'student.five',
                crypt('password', gen_salt('bf', 8)));

        -- User Roles
        INSERT INTO user_roles (user_id, role_name)
        VALUES (ADMIN_UUID_1, 'ADMIN');
        INSERT INTO user_roles (user_id, role_name)
        VALUES (GUARANTOR_UUID_1, 'GUARANTOR');
        INSERT INTO user_roles (user_id, role_name)
        VALUES (GUARANTOR_UUID_1, 'TEACHER');
        INSERT INTO user_roles (user_id, role_name)
        VALUES (GUARANTOR_UUID_2, 'GUARANTOR');
        INSERT INTO user_roles (user_id, role_name)
        VALUES (GUARANTOR_UUID_2, 'TEACHER');
        INSERT INTO user_roles (user_id, role_name)
        VALUES (TEACHER_UUID_1, 'TEACHER');
        INSERT INTO user_roles (user_id, role_name)
        VALUES (TEACHER_UUID_2, 'TEACHER');
        INSERT INTO user_roles (user_id, role_name)
        VALUES (TEACHER_UUID_3, 'TEACHER');
        INSERT INTO user_roles (user_id, role_name)
        VALUES (SCHEDULER_UUID_1, 'SCHEDULER');
        INSERT INTO user_roles (user_id, role_name)
        VALUES (STUDENT_UUID_1, 'STUDENT');
        INSERT INTO user_roles (user_id, role_name)
        VALUES (STUDENT_UUID_2, 'STUDENT');
        INSERT INTO user_roles (user_id, role_name)
        VALUES (STUDENT_UUID_3, 'STUDENT');
        INSERT INTO user_roles (user_id, role_name)
        VALUES (STUDENT_UUID_4, 'STUDENT');
        INSERT INTO user_roles (user_id, role_name)
        VALUES (STUDENT_UUID_5, 'STUDENT');

        -- Courses
        INSERT INTO courses (abbr, guarantor_id, name, credits, annotation)
        VALUES (COURSE_ABBR_1, GUARANTOR_UUID_1, 'Database Systems', 5, 'Database Systems Annotation');
        INSERT INTO courses (abbr, guarantor_id, name, credits, annotation)
        VALUES (COURSE_ABBR_2, GUARANTOR_UUID_2, 'Linear Algebra', 4, 'Linear Algebra Annotation');
        INSERT INTO courses (abbr, guarantor_id, name, credits, annotation)
        VALUES (COURSE_ABBR_3, GUARANTOR_UUID_1, 'Information Systems', 10, 'Information Systems Annotation');
        INSERT INTO courses (abbr, guarantor_id, name, credits, annotation)
        VALUES (COURSE_ABBR_4, GUARANTOR_UUID_1, 'User Interfaces', 4, 'User Interfaces Annotation');
        INSERT INTO courses (abbr, guarantor_id, name, credits, annotation)
        VALUES (COURSE_ABBR_5, GUARANTOR_UUID_2, 'Formal Languages and Grammars', 6,
                'Formal Languages and Grammars Annotation');

        -- Course Teachers
        -- IDS
        INSERT INTO course_teachers (course_abbr, teacher_id)
        VALUES (COURSE_ABBR_1, TEACHER_UUID_1);
        INSERT INTO course_teachers (course_abbr, teacher_id)
        VALUES (COURSE_ABBR_1, TEACHER_UUID_2);
        -- ILG
        INSERT INTO course_teachers (course_abbr, teacher_id)
        VALUES (COURSE_ABBR_2, TEACHER_UUID_3);
        -- IIS
        INSERT INTO course_teachers (course_abbr, teacher_id)
        VALUES (COURSE_ABBR_3, TEACHER_UUID_1);
        INSERT INTO course_teachers (course_abbr, teacher_id)
        VALUES (COURSE_ABBR_3, TEACHER_UUID_2);
        -- ITU
        INSERT INTO course_teachers (course_abbr, teacher_id)
        VALUES (COURSE_ABBR_4, TEACHER_UUID_1);
        INSERT INTO course_teachers (course_abbr, teacher_id)
        VALUES (COURSE_ABBR_4, TEACHER_UUID_2);
        -- IFJ
        INSERT INTO course_teachers (course_abbr, teacher_id)
        VALUES (COURSE_ABBR_5, TEACHER_UUID_3);

        -- Course Activities
        -- IDS
        INSERT INTO course_activity (id, course_abbr, form)
        VALUES (COURSE_ACTIVITY_1_1, COURSE_ABBR_1, 'LECTURE');
        INSERT INTO course_activity (id, course_abbr, form)
        VALUES (COURSE_ACTIVITY_1_2, COURSE_ABBR_1, 'SEMINAR');
        -- ILG
        INSERT INTO course_activity (id, course_abbr, form)
        VALUES (COURSE_ACTIVITY_2_1, COURSE_ABBR_2, 'LECTURE');
        INSERT INTO course_activity (id, course_abbr, form)
        VALUES (COURSE_ACTIVITY_2_2, COURSE_ABBR_2, 'EXERCISE');
        -- IIS
        INSERT INTO course_activity (id, course_abbr, form)
        VALUES (COURSE_ACTIVITY_3_1, COURSE_ABBR_3, 'LECTURE');
        INSERT INTO course_activity (id, course_abbr, form)
        VALUES (COURSE_ACTIVITY_3_2, COURSE_ABBR_3, 'EXERCISE');
        INSERT INTO course_activity (id, course_abbr, form)
        VALUES (COURSE_ACTIVITY_3_3, COURSE_ABBR_3, 'SEMINAR');
        -- ITU
        INSERT INTO course_activity (id, course_abbr, form)
        VALUES (COURSE_ACTIVITY_4_1, COURSE_ABBR_4, 'LECTURE');
        INSERT INTO course_activity (id, course_abbr, form)
        VALUES (COURSE_ACTIVITY_4_2, COURSE_ABBR_4, 'SEMINAR');
        -- IFJ
        INSERT INTO course_activity (id, course_abbr, form)
        VALUES (COURSE_ACTIVITY_5_1, COURSE_ABBR_5, 'LECTURE');
        INSERT INTO course_activity (id, course_abbr, form)
        VALUES (COURSE_ACTIVITY_5_2, COURSE_ABBR_5, 'EXERCISE');

        -- Schedule Item
        -- IDS LECTURE
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_1_1_1, COURSE_ACTIVITY_1_1, TEACHER_UUID_1, CLASS_UUID_4, '2024-02-05 09:00:00',
                '2024-02-05 10:50:00');
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_1_1_2, COURSE_ACTIVITY_1_1, TEACHER_UUID_1, CLASS_UUID_4, '2024-02-12 09:00:00',
                '2024-02-12 10:50:00');
        -- IDS SEMINAR
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_1_2_1, COURSE_ACTIVITY_1_2, TEACHER_UUID_1, CLASS_UUID_5, '2024-02-05 11:00:00',
                '2024-02-05 12:50:00');
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_1_2_2, COURSE_ACTIVITY_1_2, TEACHER_UUID_1, CLASS_UUID_5, '2024-02-12 11:00:00',
                '2024-02-12 12:50:00');
        -- ILG LECTURE
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_2_1_1, COURSE_ACTIVITY_2_1, TEACHER_UUID_3, CLASS_UUID_4, '2024-02-05 16:00:00',
                '2024-02-05 17:50:00');
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_2_1_2, COURSE_ACTIVITY_2_1, TEACHER_UUID_3, CLASS_UUID_4, '2024-02-12 16:00:00',
                '2024-02-12 17:50:00');
        -- ILG EXERCISE
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_2_2_1, COURSE_ACTIVITY_2_2, TEACHER_UUID_3, CLASS_UUID_1, '2024-02-06 08:00:00',
                '2024-02-06 09:50:00');
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_2_2_2, COURSE_ACTIVITY_2_2, TEACHER_UUID_3, CLASS_UUID_1, '2024-02-13 08:00:00',
                '2024-02-13 09:50:00');
        -- IIS LECTURE
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_3_1_1, COURSE_ACTIVITY_3_1, TEACHER_UUID_2, CLASS_UUID_4, '2024-02-06 12:00:00',
                '2024-02-06 13:50:00');
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_3_1_2, COURSE_ACTIVITY_3_1, TEACHER_UUID_2, CLASS_UUID_4, '2024-02-13 12:00:00',
                '2024-02-13 13:50:00');
        -- IIS EXERCISE
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_3_2_1, COURSE_ACTIVITY_3_2, TEACHER_UUID_2, CLASS_UUID_1, '2024-02-08 14:00:00',
                '2024-02-08 15:50:00');
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_3_2_2, COURSE_ACTIVITY_3_2, TEACHER_UUID_2, CLASS_UUID_1, '2024-02-15 14:00:00',
                '2024-02-15 15:50:00');
        -- IIS SEMINAR
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_3_3_1, COURSE_ACTIVITY_3_3, TEACHER_UUID_2, CLASS_UUID_6, '2024-02-07 08:00:00',
                '2024-02-07 09:50:00');
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_3_3_2, COURSE_ACTIVITY_3_3, TEACHER_UUID_2, CLASS_UUID_6, '2024-02-14 08:00:00',
                '2024-02-14 09:50:00');
        -- ITU LECTURE
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_4_1_1, COURSE_ACTIVITY_4_1, TEACHER_UUID_2, CLASS_UUID_4, '2024-02-06 16:00:00',
                '2024-02-06 18:50:00');
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_4_1_2, COURSE_ACTIVITY_4_1, TEACHER_UUID_2, CLASS_UUID_4, '2024-02-13 16:00:00',
                '2024-02-13 18:50:00');
        -- ITU SEMINAR
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_4_2_1, COURSE_ACTIVITY_4_2, TEACHER_UUID_2, CLASS_UUID_6, '2024-02-08 08:00:00',
                '2024-02-08 09:50:00');
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_4_2_2, COURSE_ACTIVITY_4_2, TEACHER_UUID_2, CLASS_UUID_6, '2024-02-15 08:00:00',
                '2024-02-15 09:50:00');
        -- IFJ LECTURE
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_5_1_1, COURSE_ACTIVITY_5_1, TEACHER_UUID_3, CLASS_UUID_4, '2024-02-07 11:00:00',
                '2024-02-07 12:50:00');
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_5_1_2, COURSE_ACTIVITY_5_1, TEACHER_UUID_3, CLASS_UUID_4, '2024-02-14 11:00:00',
                '2024-02-14 12:50:00');
        -- IFJ EXERCISE
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_5_2_1, COURSE_ACTIVITY_5_2, TEACHER_UUID_3, CLASS_UUID_6, '2024-02-07 13:00:00',
                '2024-02-07 14:50:00');
        INSERT INTO schedule (id, course_activity_id, teacher_id, class_id, start_time, end_time)
        VALUES (SCHEDULE_ITEM_5_2_2, COURSE_ACTIVITY_5_2, TEACHER_UUID_3, CLASS_UUID_6, '2024-02-14 13:00:00',
                '2024-02-14 14:50:00');

        -- Student Schedule
        -- Student 1
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_1, SCHEDULE_ITEM_1_1_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_1, SCHEDULE_ITEM_1_1_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_1, SCHEDULE_ITEM_1_2_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_1, SCHEDULE_ITEM_1_2_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_1, SCHEDULE_ITEM_2_1_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_1, SCHEDULE_ITEM_2_1_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_1, SCHEDULE_ITEM_2_2_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_1, SCHEDULE_ITEM_2_2_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_1, SCHEDULE_ITEM_4_1_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_1, SCHEDULE_ITEM_4_1_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_1, SCHEDULE_ITEM_4_2_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_1, SCHEDULE_ITEM_4_2_2);
        -- Student 2
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_2, SCHEDULE_ITEM_1_1_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_2, SCHEDULE_ITEM_1_1_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_2, SCHEDULE_ITEM_1_2_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_2, SCHEDULE_ITEM_1_2_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_2, SCHEDULE_ITEM_3_1_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_2, SCHEDULE_ITEM_3_1_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_2, SCHEDULE_ITEM_3_2_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_2, SCHEDULE_ITEM_3_2_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_2, SCHEDULE_ITEM_3_3_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_2, SCHEDULE_ITEM_3_3_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_2, SCHEDULE_ITEM_4_1_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_2, SCHEDULE_ITEM_4_1_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_2, SCHEDULE_ITEM_4_2_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_2, SCHEDULE_ITEM_4_2_2);
        -- Student 3
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_3, SCHEDULE_ITEM_2_1_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_3, SCHEDULE_ITEM_2_1_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_3, SCHEDULE_ITEM_2_2_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_3, SCHEDULE_ITEM_2_2_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_3, SCHEDULE_ITEM_3_1_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_3, SCHEDULE_ITEM_3_1_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_3, SCHEDULE_ITEM_3_2_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_3, SCHEDULE_ITEM_3_2_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_3, SCHEDULE_ITEM_3_3_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_3, SCHEDULE_ITEM_3_3_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_3, SCHEDULE_ITEM_5_1_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_3, SCHEDULE_ITEM_5_1_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_3, SCHEDULE_ITEM_5_2_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_3, SCHEDULE_ITEM_5_2_2);
        -- Student 4
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_4, SCHEDULE_ITEM_2_1_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_4, SCHEDULE_ITEM_2_1_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_4, SCHEDULE_ITEM_2_2_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_4, SCHEDULE_ITEM_2_2_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_4, SCHEDULE_ITEM_3_1_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_4, SCHEDULE_ITEM_3_1_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_4, SCHEDULE_ITEM_3_2_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_4, SCHEDULE_ITEM_3_2_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_4, SCHEDULE_ITEM_3_3_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_4, SCHEDULE_ITEM_3_3_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_4, SCHEDULE_ITEM_5_1_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_4, SCHEDULE_ITEM_5_1_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_4, SCHEDULE_ITEM_5_2_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_4, SCHEDULE_ITEM_5_2_2);
        -- Student 5
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_5, SCHEDULE_ITEM_2_1_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_5, SCHEDULE_ITEM_2_1_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_5, SCHEDULE_ITEM_2_2_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_5, SCHEDULE_ITEM_2_2_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_5, SCHEDULE_ITEM_3_1_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_5, SCHEDULE_ITEM_3_1_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_5, SCHEDULE_ITEM_3_2_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_5, SCHEDULE_ITEM_3_2_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_5, SCHEDULE_ITEM_3_3_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_5, SCHEDULE_ITEM_3_3_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_5, SCHEDULE_ITEM_5_1_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_5, SCHEDULE_ITEM_5_1_2);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_5, SCHEDULE_ITEM_5_2_1);
        INSERT INTO student_schedule (student_id, schedule_id)
        VALUES (STUDENT_UUID_5, SCHEDULE_ITEM_5_2_2);
    END
$$;

-- Some comment
