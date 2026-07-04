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

export async function createFilm(req, res) {
  // TODO: INSERT film, handle genre/director associations
  res.status(501).json({ message: "createFilm not implemented" });
}

export async function updateFilm(req, res) {
  // TODO: UPDATE film by id
  res.status(501).json({ message: "updateFilm not implemented" });
}

export async function deleteFilm(req, res) {
  // TODO: DELETE film by id (join tables cascade)
  res.status(501).json({ message: "deleteFilm not implemented" });
}
