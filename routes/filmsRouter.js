import { Router } from "express";
import * as filmsController from "../controllers/filmsController.js";
import { validateFilm } from "../validators/filmValidator.js";

const router = Router();

router.get("/", filmsController.getAllFilms);
router.get("/new", filmsController.newFilmForm);
router.get("/:id", filmsController.getFilmById);
router.post("/", validateFilm, filmsController.createFilm);
router.put("/:id", filmsController.updateFilm);
router.delete("/:id", filmsController.deleteFilm);

export default router;
