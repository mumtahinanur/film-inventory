import { createHash, timingSafeEqual } from "node:crypto";
import { body } from "express-validator";

// Hashing both sides gives equal-length buffers, which timingSafeEqual requires.
// It is not password storage.
const digest =(value) => createHash("sha256").update(String(value)).digest();

// Fails closed: with no ADMIN_PASSWORD configured, nothing matches.
export function isAdminPassword(value) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  // Hash both sides so the buffers are always the same length
  return timingSafeEqual(digest(value ?? ""), digest(secret));
}

// For edit routes: a failure joins the normal validation errors so the form
// re-renders with the user's input kept
export const validateAdminPassword =body("admin_password")
  .custom(isAdminPassword)
  .withMessage("Incorrect admin password.");
