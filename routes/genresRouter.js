import { Router } from "express";
import * as genresController from "../controllers/genresController.js";

const router = Router();

router.get("/", genresController.getAllGenres);
router.get("/:id", genresController.getGenreById);
router.post("/", genresController.createGenre);
router.put("/:id", genresController.updateGenre);
router.delete("/:id", genresController.deleteGenre);

export default router;
