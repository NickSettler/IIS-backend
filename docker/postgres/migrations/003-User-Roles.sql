DROP TRIGGER IF EXISTS roles_admin_check_del ON user_roles;
DROP FUNCTION IF EXISTS roles_admin_check_del();
DROP TABLE IF EXISTS user_roles;

CREATE TABLE user_roles
(
    user_id   uuid    NOT NULL,
    role_name VARCHAR NOT NULL,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_role_name FOREIGN KEY (role_name) REFERENCES roles (name) ON UPDATE CASCADE ON DELETE RESTRICT,
    PRIMARY KEY (user_id, role_name)
);

CREATE FUNCTION roles_admin_check_del()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    IF OLD.role_name = 'ADMIN' THEN
        RAISE EXCEPTION 'Admin cannot be deleted' USING ERRCODE = 'C0105';
    END IF;

    RETURN OLD;
END
$$;

CREATE TRIGGER roles_admin_check_del
    AFTER DELETE
    ON user_roles
    FOR EACH ROW
EXECUTE PROCEDURE roles_admin_check_del();
