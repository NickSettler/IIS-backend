DROP TABLE IF EXISTS course;

CREATE TABLE course
(
    abbr         VARCHAR(10) PRIMARY KEY,
    guarantor_id uuid         NOT NULL,
    name         VARCHAR(255) NOT NULL UNIQUE,
    credits      INT          NOT NULL CHECK (credits > 0 and credits < 20),
    annotation   VARCHAR(512),
    CONSTRAINT fk_guarantor_id FOREIGN KEY (guarantor_id) REFERENCES users (id)
);
