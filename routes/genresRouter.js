import { Router } from "express";
import * as genresController from "../controllers/genresController.js";
import { validateGenre } from "../validators/genreValidator.js";

const router = Router();

router.get("/", genresController.getAllGenres);
router.get("/new", genresController.newGenreForm);
router.get("/:id", genresController.getGenreById);
router.post("/", validateGenre, genresController.createGenre);
router.put("/:id", genresController.updateGenre);
router.delete("/:id", genresController.deleteGenre);

export default router;
