import { Router } from "express";
import * as directorsController from "../controllers/directorsController.js";

const router = Router();

router.get("/", directorsController.getAllDirectors);
router.get("/:id", directorsController.getDirectorById);
router.post("/", directorsController.createDirector);
router.put("/:id", directorsController.updateDirector);
router.delete("/:id", directorsController.deleteDirector);

export default router;
