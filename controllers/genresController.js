import { matchedData, validationResult } from "express-validator";
import * as queries from "../db/queries.js";

export async function getAllGenres(req, res) {
  const genres = await queries.getAllGenres();
  res.render("genres/index", { genres });
}

export async function getGenreById(req, res) {
  const genre = await queries.getGenreById(req.params.id);
  if (!genre) {
    return res.status(404).render("error", { message: "Genre not found" });
  }
  const films = await queries.getFilmsByGenreId(req.params.id);
  res.render("genres/show", { genre, films });
}

export function newGenreForm(req, res) {
  res.render("genres/new", { values: {}, errors: [] });
}

export async function createGenre(req, res) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).render("genres/new", {
      values: req.body,
      errors: result.array().map((e) => e.msg),
    });
  }

  const data = matchedData(req);
  const genreId = await queries.createGenre({
    name: data.name,
    description: data.description || null,
  });
  res.redirect(`/genres/${genreId}`);
}

export async function updateGenre(req, res) {
  res.status(501).json({ message: "updateGenre not implemented" });
}

export async function deleteGenre(req, res) {
  res.status(501).json({ message: "deleteGenre not implemented" });
}
