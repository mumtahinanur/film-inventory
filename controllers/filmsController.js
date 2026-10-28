import { matchedData, validationResult } from "express-validator";
import * as queries from "../db/queries.js";

export async function getAllFilms(req, res) {
  const films = await queries.getAllFilms();
  res.render("films/index", { films });
}

export async function getFilmById(req, res) {
  const film = await queries.getFilmById(req.params.id);
  if (!film) {
    return res.status(404).render("error", { message: "Film not found" });
  }
  res.render("films/show", { film });
}

// Renders the shared films/new view, used for both create and edit. Extra options
// (heading, action, ...) switch it into edit mode.
async function renderFilmForm(res, { values = {}, errors = [], status = 200, ...formOptions } = {}) {
  const [genres, directors] = await Promise.all([
    queries.getAllGenres(),
    queries.getAllDirectors(),
  ]);
  res.status(status).render("films/new", { genres, directors, values, errors, ...formOptions });
}

export async function newFilmForm(req, res) {
  await renderFilmForm(res);
}

export async function createFilm(req, res) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return renderFilmForm(res, {
      values: req.body,
      errors: [...new Set(result.array().map((e) => e.msg))],
      status: 400,
    });
  }

  const data = matchedData(req);
  // Set drops duplicate ids; `|| null` / `?? null` store empty form values as NULL
  // rather than ''
  const filmId = await queries.createFilm({
    title: data.title,
    description: data.description || null,
    releaseYear: data.release_year ?? null,
    runtimeMinutes: data.runtime_minutes ?? null,
    genreIds: [...new Set(data.genre_ids)],
    directorIds: [...new Set(data.director_ids)],
  });
  res.redirect(`/films/${filmId}`);
}

// View options that turn films/new into the edit form; requirePassword shows the
// admin password field
function editFormOptions(id) {
  return {
    heading: "Edit Film",
    action: `/films/${id}/edit`,
    submitLabel: "Save Changes",
    backHref: `/films/${id}`,
    backLabel: "← Back to Film",
    requirePassword: true,
  };
}

export async function editFilmForm(req, res) {
  const film = await queries.getFilmById(req.params.id);
  if (!film) {
    return res.status(404).render("error", { message: "Film not found" });
  }
  await renderFilmForm(res, {
    values: {
      title: film.title,
      description: film.description,
      release_year: film.release_year,
      runtime_minutes: film.runtime_minutes,
      genre_ids: film.genres.map((g) => g.id),
      director_ids: film.directors.map((d) => d.id),
    },
    ...editFormOptions(film.id),
  });
}

export async function updateFilm(req, res) {
  const { id } = req.params;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return renderFilmForm(res, {
      values: req.body,
      errors: [...new Set(result.array().map((e) => e.msg))],
      status: 400,
      ...editFormOptions(id),
    });
  }

  const data = matchedData(req);
  const updated = await queries.updateFilm(id, {
    title: data.title,
    description: data.description || null,
    releaseYear: data.release_year ?? null,
    runtimeMinutes: data.runtime_minutes ?? null,
    genreIds: [...new Set(data.genre_ids)],
    directorIds: [...new Set(data.director_ids)],
  });
  // updateFilm returns false when no row matched the id
  if (!updated) {
    return res.status(404).render("error", { message: "Film not found" });
  }
  res.redirect(`/films/${id}`);
}

export async function deleteFilm(req, res) {
  const deleted = await queries.deleteFilm(req.params.id);
  if (!deleted) {
    return res.status(404).render("error", { message: "Film not found" });
  }
  res.redirect("/films");
}
