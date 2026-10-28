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

// View options that turn directors/new into the edit form; requirePassword shows the
// admin password field
function editFormOptions(id) {
  return {
    heading: "Edit Director",
    action: `/directors/${id}/edit`,
    submitLabel: "Save Changes",
    backHref: `/directors/${id}`,
    backLabel: "← Back to Director",
    requirePassword: true,
  };
}

export async function editDirectorForm(req, res) {
  const director = await queries.getDirectorById(req.params.id);
  if (!director) {
    return res.status(404).render("error", { message: "Director not found" });
  }
  res.render("directors/new", {
    values: { name: director.name, bio: director.bio },
    errors: [],
    ...editFormOptions(director.id),
  });
}

export async function updateDirector(req, res) {
  const { id } = req.params;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).render("directors/new", {
      values: req.body,
      errors: [...new Set(result.array().map((e) => e.msg))],
      ...editFormOptions(id),
    });
  }

  const data = matchedData(req);
  const updated = await queries.updateDirector(id, {
    name: data.name,
    bio: data.bio || null,
  });
  if (!updated) {
    return res.status(404).render("error", { message: "Director not found" });
  }
  res.redirect(`/directors/${id}`);
}

export async function deleteDirector(req, res) {
  const deleted = await queries.deleteDirector(req.params.id);
  if (!deleted) {
    return res.status(404).render("error", { message: "Director not found" });
  }
  res.redirect("/directors");
}
