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

async function renderFilmForm(res, { values = {}, errors = [], status = 200 } = {}) {
  const [genres, directors] = await Promise.all([
    queries.getAllGenres(),
    queries.getAllDirectors(),
  ]);
  res.status(status).render("films/new", { genres, directors, values, errors });
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

export async function updateFilm(req, res) {
  // TODO: UPDATE film by id
  res.status(501).json({ message: "updateFilm not implemented" });
}

export async function deleteFilm(req, res) {
  // TODO: DELETE film by id (join tables cascade)
  res.status(501).json({ message: "deleteFilm not implemented" });
}
