DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name    VARCHAR(255) NOT NULL,
    last_name     VARCHAR(255) NOT NULL,
    username      VARCHAR(255) NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255) DEFAULT NULL
);
