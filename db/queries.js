import pool from "./pool.js";

const FILM_SELECT = `
  SELECT
    f.id,
    f.title,
    f.description,
    f.release_year,
    f.runtime_minutes,
    f.created_at,
    COALESCE(
      (
        SELECT json_agg(jsonb_build_object('id', g.id, 'name', g.name) ORDER BY g.name)
        FROM film_genres fg
        JOIN genres g ON g.id = fg.genre_id
        WHERE fg.film_id = f.id
      ),
      '[]'
    ) AS genres,
    COALESCE(
      (
        SELECT json_agg(jsonb_build_object('id', d.id, 'name', d.name) ORDER BY d.name)
        FROM film_directors fd
        JOIN directors d ON d.id = fd.director_id
        WHERE fd.film_id = f.id
      ),
      '[]'
    ) AS directors
  FROM films f
`;

// Film related queries

export async function getAllFilms() {
  const { rows } = await pool.query(`${FILM_SELECT} ORDER BY f.title`);
  return rows;
}

export async function getFilmById(id) {
  const { rows } = await pool.query(`${FILM_SELECT} WHERE f.id = $1`, [id]);
  return rows[0];
}

// Genre related queries

export async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres ORDER BY name");
  return rows;
}

export async function getGenreById(id) {
  const { rows } = await pool.query("SELECT * FROM genres WHERE id = $1", [id]);
  return rows[0];
}

export async function getFilmsByGenreId(id) {
  const { rows } = await pool.query(
    `${FILM_SELECT}
     WHERE EXISTS (
       SELECT 1 FROM film_genres fg
       WHERE fg.film_id = f.id AND fg.genre_id = $1
     )
     ORDER BY f.title`,
    [id]
  );
  return rows;
}

// Director related queries

export async function getAllDirectors() {
  const { rows } = await pool.query("SELECT * FROM directors ORDER BY name");
  return rows;
}

export async function getDirectorById(id) {
  const { rows } = await pool.query("SELECT * FROM directors WHERE id = $1", [id]);
  return rows[0];
}

export async function getFilmsByDirectorId(id) {
  const { rows } = await pool.query(
    `${FILM_SELECT}
     WHERE EXISTS (
       SELECT 1 FROM film_directors fd
       WHERE fd.film_id = f.id AND fd.director_id = $1
     )
     ORDER BY f.title`,
    [id]
  );
  return rows;
}

export async function createFilm({ title, description, releaseYear, runtimeMinutes, genreIds, directorIds }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO films (title, description, release_year, runtime_minutes)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [title, description, releaseYear, runtimeMinutes]
    );
    const filmId = rows[0].id;
    if (genreIds.length > 0) {
      await client.query(
        `INSERT INTO film_genres (film_id, genre_id)
         SELECT $1, UNNEST($2::int[])`,
        [filmId, genreIds]
      );
    }
    if (directorIds.length > 0) {
      await client.query(
        `INSERT INTO film_directors (film_id, director_id)
         SELECT $1, UNNEST($2::int[])`,
        [filmId, directorIds]
      );
    }
    await client.query("COMMIT");
    return filmId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function genreNameExists(name) {
  const { rows } = await pool.query(
    "SELECT 1 FROM genres WHERE LOWER(name) = LOWER($1)",
    [name]
  );
  return rows.length > 0;
}

export async function createGenre({ name, description }) {
  const { rows } = await pool.query(
    "INSERT INTO genres (name, description) VALUES ($1, $2) RETURNING id",
    [name, description]
  );
  return rows[0].id;
}

export async function createDirector({ name, bio }) {
  const { rows } = await pool.query(
    "INSERT INTO directors (name, bio) VALUES ($1, $2) RETURNING id",
    [name, bio]
  );
  return rows[0].id;
}
