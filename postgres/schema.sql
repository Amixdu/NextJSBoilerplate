CREATE TABLE users
(
  id             SERIAL,
  first_name     VARCHAR(255),
  last_name      VARCHAR(255),
  email          VARCHAR(255),
  sub            VARCHAR(255),
  image          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE UNIQUE INDEX email ON users(email);