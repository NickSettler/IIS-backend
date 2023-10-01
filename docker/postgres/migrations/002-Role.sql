DROP TABLE IF EXISTS roles;

CREATE TABLE roles
(
    role_id   uuid DEFAULT gen_random_uuid(),
    role_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (role_id)
);

INSERT INTO roles (role_name)
VALUES ('admin'),
       ('guarantor'),
       ('teacher'),
       ('scheduler'),
       ('student'),
       ('unregistered user');