import { body } from "express-validator";

export const validateDirector = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required.").bail()
    .isLength({ max: 150 }).withMessage("Name must be 150 characters or fewer."),
  body("bio").trim(),
];
