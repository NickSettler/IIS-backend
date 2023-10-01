DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    user_id    uuid DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    username   VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);




