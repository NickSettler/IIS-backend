DROP TABLE IF EXISTS role_permissions;

CREATE TABLE role_permissions
(
    role_id       uuid NOT NULL,
    permission_id uuid NOT NULL,
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles (id),
    CONSTRAINT fk_permission_id FOREIGN KEY (permission_id) REFERENCES permissions (id),
    PRIMARY KEY (role_id, permission_id)
);
