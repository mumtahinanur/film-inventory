import { body } from "express-validator";
import * as queries from "../db/queries.js";

export const validateGenre = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required.").bail()
    .isLength({ max: 100 }).withMessage("Name must be 100 characters or fewer.").bail()
    .custom(async (name, { req }) => {
      // On edit, the genre's own current name isn't a duplicate
      if (await queries.genreNameExists(name, req.params.id ?? null)) {
        throw new Error("A genre with that name already exists.");
      }
    }),
  body("description").trim(),
];
