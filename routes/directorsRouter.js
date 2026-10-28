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
// HTML forms can't send PUT, so the edit form POSTs to /:id/edit
router.post("/:id/edit", validateAdminPassword, validateDirector, directorsController.updateDirector);
// HTML forms can't send DELETE, so the delete button POSTs to /:id/delete
router.post("/:id/delete", requireAdminPassword, directorsController.deleteDirector);

export default router;
