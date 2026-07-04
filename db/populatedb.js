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

const SEED_SQL = `
  INSERT INTO genres (name, description) VALUES
    ('Drama', 'Character-driven stories dealing with serious, emotional themes.'),
    ('Comedy', 'Films primarily intended to amuse and entertain through humor.'),
    ('Science Fiction', 'Speculative stories exploring futuristic or scientific concepts.'),
    ('Horror', 'Films designed to frighten, unsettle, or invoke dread.'),
    ('Thriller', 'Suspenseful stories built around tension and high stakes.'),
    ('Animation', 'Films created using animated rather than live-action imagery.'),
    ('Romance', 'Stories centered on romantic relationships and love.')
  ON CONFLICT (name) DO NOTHING;

  INSERT INTO directors (name, bio) VALUES
    ('Christopher Nolan', 'British-American filmmaker known for cerebral, nonlinear storytelling.'),
    ('Bong Joon-ho', 'South Korean director blending genre filmmaking with social commentary.'),
    ('Greta Gerwig', 'American director noted for sharp, coming-of-age stories.'),
    ('Hayao Miyazaki', 'Japanese animator and co-founder of Studio Ghibli.'),
    ('Denis Villeneuve', 'Canadian director known for atmospheric science fiction and drama.'),
    ('Jordan Peele', 'American director known for socially conscious horror.'),
    ('Agnès Varda', 'French filmmaker and pioneer of the French New Wave.'),
    ('Taika Waititi', 'New Zealand director known for blending comedy with heart.'),
    ('Lana Wachowski', 'American director and co-creator of The Matrix franchise.'),
    ('Lilly Wachowski', 'American director and co-creator of The Matrix franchise.');

  INSERT INTO films (title, description, release_year, runtime_minutes) VALUES
    ('Inception', 'A thief who steals corporate secrets through dream-sharing technology is given a chance to have his criminal history erased.', 2010, 148),
    ('Parasite', 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', 2019, 132),
    ('Lady Bird', 'A high school senior navigates a turbulent relationship with her strong-willed mother during her final year in Sacramento.', 2017, 94),
    ('Spirited Away', 'A young girl wanders into a world ruled by gods and witches and must find a way to free herself and her parents.', 2001, 125),
    ('Arrival', 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.', 2016, 116),
    ('Dune', 'A noble family becomes embroiled in a war for control over the galaxy''s most valuable asset on a hostile desert planet.', 2021, 155),
    ('Get Out', 'A young man becomes suspicious of his girlfriend''s family estate after visiting for the weekend.', 2017, 104),
    ('Cléo from 5 to 7', 'A young singer wanders through Paris while awaiting the results of a medical test that could reveal she has cancer.', 1962, 90),
    ('Jojo Rabbit', 'A lonely German boy in the Hitler Youth discovers his mother is hiding a Jewish girl in their home.', 2019, 108),
    ('The Matrix', 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', 1999, 136);

  INSERT INTO film_genres (film_id, genre_id)
  SELECT f.id, g.id
  FROM (VALUES
    ('Inception', 'Science Fiction'),
    ('Inception', 'Thriller'),
    ('Parasite', 'Drama'),
    ('Parasite', 'Thriller'),
    ('Lady Bird', 'Drama'),
    ('Lady Bird', 'Comedy'),
    ('Spirited Away', 'Animation'),
    ('Spirited Away', 'Drama'),
    ('Arrival', 'Science Fiction'),
    ('Arrival', 'Drama'),
    ('Dune', 'Science Fiction'),
    ('Get Out', 'Horror'),
    ('Get Out', 'Thriller'),
    ('Cléo from 5 to 7', 'Drama'),
    ('Cléo from 5 to 7', 'Romance'),
    ('Jojo Rabbit', 'Comedy'),
    ('Jojo Rabbit', 'Drama'),
    ('The Matrix', 'Science Fiction'),
    ('The Matrix', 'Thriller')
  ) AS pairs(film_title, genre_name)
  JOIN films f ON f.title = pairs.film_title
  JOIN genres g ON g.name = pairs.genre_name;

  INSERT INTO film_directors (film_id, director_id)
  SELECT f.id, d.id
  FROM (VALUES
    ('Inception', 'Christopher Nolan'),
    ('Parasite', 'Bong Joon-ho'),
    ('Lady Bird', 'Greta Gerwig'),
    ('Spirited Away', 'Hayao Miyazaki'),
    ('Arrival', 'Denis Villeneuve'),
    ('Dune', 'Denis Villeneuve'),
    ('Get Out', 'Jordan Peele'),
    ('Cléo from 5 to 7', 'Agnès Varda'),
    ('Jojo Rabbit', 'Taika Waititi'),
    ('The Matrix', 'Lana Wachowski'),
    ('The Matrix', 'Lilly Wachowski')
  ) AS pairs(film_title, director_name)
  JOIN films f ON f.title = pairs.film_title
  JOIN directors d ON d.name = pairs.director_name;
`;

async function main() {
  const connectionString = process.argv[2];
  const client = new Client({ connectionString });
  await client.connect();
  await client.query(SQL);

  const { rows } = await client.query("SELECT COUNT(*) FROM films");
  if (Number(rows[0].count) === 0) {
    await client.query(SEED_SQL);
    console.log("Seeded dummy data");
  } else {
    console.log("Films table not empty, skipping seed data");
  }

  await client.end();
  console.log("Database populated");
}

main();
