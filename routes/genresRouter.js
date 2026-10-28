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
// HTML forms can't send PUT, so the edit form POSTs to /:id/edit
router.post("/:id/edit", validateAdminPassword, validateGenre, genresController.updateGenre);
// HTML forms can't send DELETE, so the delete button POSTs to /:id/delete
router.post("/:id/delete", requireAdminPassword, genresController.deleteGenre);
router.put("/:id", validateAdminPassword, validateGenre, genresController.updateGenre);
router.delete("/:id", requireAdminPassword, genresController.deleteGenre);

export default router;
