DROP TABLE IF EXISTS classes;

CREATE TABLE classes
(
    abbr     VARCHAR(5) NOT NULL PRIMARY KEY,
    capacity INT DEFAULT 15 CHECK (capacity > 0 and capacity < 300)
);
