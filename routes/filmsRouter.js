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
// Browser forms can only send GET/POST, so edit and delete are POST routes.
// The admin password check runs first, before validation or any database change.
router.post("/:id/edit", validateAdminPassword, validateFilm, filmsController.updateFilm);
router.post("/:id/delete", requireAdminPassword, filmsController.deleteFilm);

export default router;
