import { Router } from "express";
import * as genresController from "../controllers/genresController.js";
import { requireAdminPassword } from "../middleware/requireAdminPassword.js";
import { validateAdminPassword } from "../validators/adminValidator.js";
import { validateGenre } from "../validators/genreValidator.js";

const router = Router();

router.get("/", genresController.getAllGenres);
router.get("/new", genresController.newGenreForm);
router.get("/:id", genresController.getGenreById);
router.get("/:id/edit", genresController.editGenreForm);
router.post("/", validateGenre, genresController.createGenre);
// Browser forms can only send GET/POST, so edit and delete are POST routes.
// The admin password check runs first, before validation or any database change.
router.post("/:id/edit", validateAdminPassword, validateGenre, genresController.updateGenre);
router.post("/:id/delete", requireAdminPassword, genresController.deleteGenre);

export default router;
