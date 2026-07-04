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

export async function getAllFilms() {
  const { rows } = await pool.query(`${FILM_SELECT} ORDER BY f.title`);
  return rows;
}

export async function getFilmById(id) {
  const { rows } = await pool.query(`${FILM_SELECT} WHERE f.id = $1`, [id]);
  return rows[0];
}

export async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres ORDER BY name");
  return rows;
}

export async function getGenreById(id) {
  const { rows } = await pool.query("SELECT * FROM genres WHERE id = $1", [id]);
  return rows[0];
}

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
