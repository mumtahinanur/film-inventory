import { isAdminPassword } from "../validators/adminValidator.js";

// For routes with no form to re-render (delete): reject with 403
export function requireAdminPassword(req, res, next) {
  if (!isAdminPassword(req.body?.admin_password)) {
    return res.status(403).render("error", { message: "Incorrect admin password." });
  }
  next();
}
