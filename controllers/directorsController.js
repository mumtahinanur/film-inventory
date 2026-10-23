import { matchedData, validationResult } from "express-validator";
import * as queries from "../db/queries.js";

export async function getAllDirectors(req, res) {
  const directors = await queries.getAllDirectors();
  res.render("directors/index", { directors });
}

export async function getDirectorById(req, res) {
  const director = await queries.getDirectorById(req.params.id);
  if (!director) {
    return res.status(404).render("error", { message: "Director not found" });
  }
  const films = await queries.getFilmsByDirectorId(req.params.id);
  res.render("directors/show", { director, films });
}

export function newDirectorForm(req, res) {
  res.render("directors/new", { values: {}, errors: [] });
}

export async function createDirector(req, res) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).render("directors/new", {
      values: req.body,
      errors: result.array().map((e) => e.msg),
    });
  }

  const data = matchedData(req);
  const directorId = await queries.createDirector({
    name: data.name,
    bio: data.bio || null,
  });
  res.redirect(`/directors/${directorId}`);
}

export async function updateDirector(req, res) {
  res.status(501).json({ message: "updateDirector not implemented" });
}

export async function deleteDirector(req, res) {
  res.status(501).json({ message: "deleteDirector not implemented" });
}
