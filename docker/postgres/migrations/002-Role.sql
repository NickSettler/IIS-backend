DROP TABLE IF EXISTS roles;

CREATE TABLE roles
(
    id   uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO roles (name)
VALUES ('ADMIN'),
       ('GUARANTOR'),
       ('TEACHER'),
       ('SCHEDULER'),
       ('STUDENT'),
       ('GUEST');