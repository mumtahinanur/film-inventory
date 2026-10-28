import { Router } from "express";
import * as filmsController from "../controllers/filmsController.js";
import { requireAdminPassword } from "../middleware/requireAdminPassword.js";
import { validateAdminPassword } from "../validators/adminValidator.js";
import { validateFilm } from "../validators/filmValidator.js";

const router = Router();

router.get("/", filmsController.getAllFilms);
router.get("/new", filmsController.newFilmForm);
router.get("/:id", filmsController.getFilmById);
router.get("/:id/edit", filmsController.editFilmForm);
router.post("/", validateFilm, filmsController.createFilm);
// HTML forms can't send PUT, so the edit form POSTs to /:id/edit
router.post("/:id/edit", validateAdminPassword, validateFilm, filmsController.updateFilm);
// HTML forms can't send DELETE, so the delete button POSTs to /:id/delete
router.post("/:id/delete", requireAdminPassword, filmsController.deleteFilm);

export default router;
