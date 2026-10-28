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

// View options that turn genres/new into the edit form; requirePassword shows the
// admin password field
function editFormOptions(id) {
  return {
    heading: "Edit Genre",
    action: `/genres/${id}/edit`,
    submitLabel: "Save Changes",
    backHref: `/genres/${id}`,
    backLabel: "← Back to Genre",
    requirePassword: true,
  };
}

export async function editGenreForm(req, res) {
  const genre = await queries.getGenreById(req.params.id);
  if (!genre) {
    return res.status(404).render("error", { message: "Genre not found" });
  }
  res.render("genres/new", {
    values: { name: genre.name, description: genre.description },
    errors: [],
    ...editFormOptions(genre.id),
  });
}

export async function updateGenre(req, res) {
  const { id } = req.params;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).render("genres/new", {
      values: req.body,
      errors: [...new Set(result.array().map((e) => e.msg))],
      ...editFormOptions(id),
    });
  }

  const data = matchedData(req);
  const updated = await queries.updateGenre(id, {
    name: data.name,
    description: data.description || null,
  });
  if (!updated) {
    return res.status(404).render("error", { message: "Genre not found" });
  }
  res.redirect(`/genres/${id}`);
}

export async function deleteGenre(req, res) {
  const deleted = await queries.deleteGenre(req.params.id);
  if (!deleted) {
    return res.status(404).render("error", { message: "Genre not found" });
  }
  res.redirect("/genres");
}
