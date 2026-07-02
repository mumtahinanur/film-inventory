import { Router } from "express";
import * as filmsController from "../controllers/filmsController.js";

const router = Router();

router.get("/", filmsController.getAllFilms);
router.get("/:id", filmsController.getFilmById);
router.post("/", filmsController.createFilm);
router.put("/:id", filmsController.updateFilm);
router.delete("/:id", filmsController.deleteFilm);

export default router;
