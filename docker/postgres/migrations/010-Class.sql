DROP TABLE IF EXISTS classes;

CREATE TABLE classes
(
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    abbr     VARCHAR(5) NOT NULL UNIQUE,
    capacity INT DEFAULT 15 CHECK (capacity > 0 and capacity < 300)
);
