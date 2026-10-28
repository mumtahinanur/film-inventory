import { Router } from "express";
import * as directorsController from "../controllers/directorsController.js";
import { requireAdminPassword } from "../middleware/requireAdminPassword.js";
import { validateAdminPassword } from "../validators/adminValidator.js";
import { validateDirector } from "../validators/directorValidator.js";

const router = Router();

router.get("/", directorsController.getAllDirectors);
router.get("/new", directorsController.newDirectorForm);
router.get("/:id", directorsController.getDirectorById);
router.get("/:id/edit", directorsController.editDirectorForm);
router.post("/", validateDirector, directorsController.createDirector);
// Browser forms can only send GET/POST, so edit and delete are POST routes.
// The admin password check runs first, before validation or any database change.
router.post("/:id/edit", validateAdminPassword, validateDirector, directorsController.updateDirector);
router.post("/:id/delete", requireAdminPassword, directorsController.deleteDirector);

export default router;
