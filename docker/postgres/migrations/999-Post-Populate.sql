DROP TRIGGER IF EXISTS roles_admin_check_ins_upd ON user_roles;
DROP FUNCTION IF EXISTS roles_admin_check_ins_upd();

CREATE FUNCTION roles_admin_check_ins_upd()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    IF NEW.role_name = 'ADMIN' THEN
        RAISE EXCEPTION 'Admin cannot be created or updated' USING ERRCODE = 'C0106';
    END IF;

    RETURN NEW;
END
$$;

CREATE TRIGGER roles_admin_check_ins_upd
    BEFORE INSERT OR UPDATE
    ON user_roles
    FOR EACH ROW
EXECUTE PROCEDURE roles_admin_check_ins_upd();
