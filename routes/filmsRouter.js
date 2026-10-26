import { Router } from "express";
import * as filmsController from "../controllers/filmsController.js";
import { validateFilm } from "../validators/filmValidator.js";

const router = Router();

router.get("/", filmsController.getAllFilms);
router.get("/new", filmsController.newFilmForm);
router.get("/:id", filmsController.getFilmById);
router.get("/:id/edit", filmsController.editFilmForm);
router.post("/", validateFilm, filmsController.createFilm);
// HTML forms can't send PUT, so the edit form POSTs to /:id/edit
router.post("/:id/edit", validateFilm, filmsController.updateFilm);
router.put("/:id", validateFilm, filmsController.updateFilm);
router.delete("/:id", filmsController.deleteFilm);

export default router;
