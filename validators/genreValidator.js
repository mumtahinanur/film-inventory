import { body } from "express-validator";
import * as queries from "../db/queries.js";

export const validateGenre = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required.").bail()
    .isLength({ max: 100 }).withMessage("Name must be 100 characters or fewer.").bail()
    .custom(async (name) => {
      if (await queries.genreNameExists(name)) {
        throw new Error("A genre with that name already exists.");
      }
    }),
  body("description").trim(),
];
