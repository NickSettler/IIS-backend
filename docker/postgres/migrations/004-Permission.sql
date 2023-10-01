DROP TABLE IF EXISTS permisions;

CREATE TABLE permissions
(
    permission_id   uuid DEFAULT gen_random_uuid(),
    permission_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (permission_id)
);

INSERT INTO permissions (permission_name)
VALUES ('edit user'),
       ('edit class'),
       ('edit course'),
       ('add guarantor'),
       ('edit activity'),
       ('edit course teacher'),
       ('define course requirements'),
       ('add personal requirements'),
       ('place schedule activities'),
       ('assign schedule classes'),
       ('edit personal courses'),
       ('view personal schedule'),
       ('view annotation');


