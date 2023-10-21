DROP TABLE IF EXISTS user_roles;

CREATE TABLE user_roles
(
    user_id   uuid    NOT NULL,
    role_name VARCHAR NOT NULL,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_role_name FOREIGN KEY (role_name) REFERENCES roles (name) ON UPDATE CASCADE ON DELETE RESTRICT,
    PRIMARY KEY (user_id, role_name)
);
