import { Router } from "express";
import * as genresController from "../controllers/genresController.js";
import { validateGenre } from "../validators/genreValidator.js";

const router = Router();

router.get("/", genresController.getAllGenres);
router.get("/new", genresController.newGenreForm);
router.get("/:id", genresController.getGenreById);
router.get("/:id/edit", genresController.editGenreForm);
router.post("/", validateGenre, genresController.createGenre);
// HTML forms can't send PUT, so the edit form POSTs to /:id/edit
router.post("/:id/edit", validateGenre, genresController.updateGenre);
router.put("/:id", validateGenre, genresController.updateGenre);
router.delete("/:id", genresController.deleteGenre);

export default router;
