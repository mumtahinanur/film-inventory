import { Client } from "pg";

const SQL = `
  CREATE TABLE IF NOT EXISTS genres (
    id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS directors (
    id   INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    bio  TEXT
  );

  CREATE TABLE IF NOT EXISTS films (
    id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    release_year    SMALLINT,
    runtime_minutes SMALLINT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS film_genres (
    film_id  INT NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    genre_id INT NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (film_id, genre_id)
  );

  CREATE TABLE IF NOT EXISTS film_directors (
    film_id     INT NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    director_id INT NOT NULL REFERENCES directors(id) ON DELETE CASCADE,
    PRIMARY KEY (film_id, director_id)
  );
`;

async function main() {
  const connectionString = process.argv[2];
  const client = new Client({ connectionString });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Database populated");
}

main();
