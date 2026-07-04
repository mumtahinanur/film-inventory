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

export async function createGenre(req, res) {
  res.status(501).json({ message: "createGenre not implemented" });
}

export async function updateGenre(req, res) {
  res.status(501).json({ message: "updateGenre not implemented" });
}

export async function deleteGenre(req, res) {
  res.status(501).json({ message: "deleteGenre not implemented" });
}
