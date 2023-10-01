DROP TABLE IF EXISTS role_permissions;

CREATE TABLE role_permissions
(
    role_id       uuid NOT NULL,
    permission_id uuid NOT NULL,
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles (id),
    CONSTRAINT fk_permission_id FOREIGN KEY (permission_id) REFERENCES permissions (id),
    PRIMARY KEY (role_id, permission_id)
);
INSERT INTO role_permissions (role_id, permission_id) Values ('3c2f415e-6eb3-4ae6-a7a7-c935fee34311', '397e6019-bc08-46ad-b00d-74e5ef35d245');
Select * from user_roles;
