import express from "express";
import path from "node:path";
import homeRouter from "./routes/homeRouter.js";
import filmsRouter from "./routes/filmsRouter.js";
import genresRouter from "./routes/genresRouter.js";
import directorsRouter from "./routes/directorsRouter.js";

const app = express();

const PORT = process.env.PORT || 8000;

// View engine setup
app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(express.urlencoded({ extended: true })); // parses form POST data into req.body

// Routes
app.use("/", homeRouter);
app.use("/films", filmsRouter);
app.use("/genres", genresRouter);
app.use("/directors", directorsRouter);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("errors/500", { message: "Something went wrong" });
});

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Server running on port: ${PORT}`)
});
