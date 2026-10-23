import { Router } from "express";
import * as directorsController from "../controllers/directorsController.js";
import { validateDirector } from "../validators/directorValidator.js";

const router = Router();

router.get("/", directorsController.getAllDirectors);
router.get("/new", directorsController.newDirectorForm);
router.get("/:id", directorsController.getDirectorById);
router.post("/", validateDirector, directorsController.createDirector);
router.put("/:id", directorsController.updateDirector);
router.delete("/:id", directorsController.deleteDirector);

export default router;
