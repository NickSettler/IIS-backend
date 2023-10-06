DROP TABLE IF EXISTS roles;

CREATE TABLE roles
(
    name VARCHAR(255) NOT NULL PRIMARY KEY
);

INSERT INTO roles (name)
VALUES ('ADMIN'),
       ('GUARANTOR'),
       ('TEACHER'),
       ('SCHEDULER'),
       ('STUDENT'),
       ('GUEST');
