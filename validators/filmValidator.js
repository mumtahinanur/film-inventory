import { body } from "express-validator";

export const validateFilm = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required.").bail()
    .isLength({ max: 255 }).withMessage("Title must be 255 characters or fewer."),
  body("description").trim(),
  // Optional numbers: an empty field is allowed (stored as NULL), otherwise it must
  // be a valid integer in range
  body("release_year")
    .trim()
    .optional({ values: "falsy" })
    .isInt({ min: 1888, max: 2100 }).withMessage("Release year must be a whole number between 1888 and 2100.")
    .toInt(),
  body("runtime_minutes")
    .trim()
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 32767 }).withMessage("Runtime must be a whole number of minutes between 1 and 32767.")
    .toInt(),
  // A single checked box arrives as a string and none as undefined; toArray() makes
  // it an array so the .* rule below checks every id
  body("genre_ids").toArray(),
  body("genre_ids.*").isInt({ min: 1 }).withMessage("Invalid genre selection.").toInt(),
  body("director_ids").toArray(),
  body("director_ids.*").isInt({ min: 1 }).withMessage("Invalid director selection.").toInt(),
];
