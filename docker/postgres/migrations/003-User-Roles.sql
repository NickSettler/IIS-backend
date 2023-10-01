DROP TABLE IF EXISTS user_roles;

CREATE TABLE user_roles
(
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles (role_id),
    PRIMARY KEY (user_id, role_id)
);

