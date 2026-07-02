export async function getAllFilms(req, res) {
  // TODO: SELECT all films, maybe JOIN genres/directors
  res.status(501).json({ message: "getAllFilms not implemented" });
}

export async function getFilmById(req, res) {
  // TODO: SELECT film by id, 404 if not found
  res.status(501).json({ message: "getFilmById not implemented" });
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
