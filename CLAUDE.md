# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start with `node --watch --env-file=.env app.js` (auto-reload)
- `npm start` — `node app.js` (does NOT load `.env`; env vars must already be set)
- `node db/populatedb.js <connection-string>` — create tables (idempotent) and seed dummy data only if `films` is empty
- No test or lint tooling is configured.

Copy `.env.example` to `.env` and fill it in. Requires `PORT` (default 8000), `DATABASE_URL` (PostgreSQL) and `ADMIN_PASSWORD` (see Admin password below).

## Architecture

Express 5 + EJS + `pg` (no ORM), ES modules (`"type": "module"`), server-rendered MVC. Three resources — films, genres, directors — each with the same layout:

`routes/<x>Router.js` → `validators/<x>Validator.js` (express-validator chain, used on POST) → `controllers/<x>Controller.js` → `db/queries.js` → `views/<x>/{index,show,new}.ejs`

- `app.js` mounts the routers at `/films`, `/genres`, `/directors`, plus `/` for home.
- `db/queries.js` holds all SQL (shared `pool` from `db/pool.js`). Films are read via a shared `FILM_SELECT` that aggregates genres/directors into JSON arrays via subqueries; multi-table writes (e.g. `createFilm`) use a transaction on a dedicated client.
- Schema: `films`, `genres`, `directors`, with many-to-many join tables `film_genres` and `film_directors` (`ON DELETE CASCADE`). Schema lives only in `db/populatedb.js`.
- Form pattern (see `filmsController.createFilm`): on validation failure, re-render the `new` view with status 400, the submitted `values`, and a de-duplicated `errors` array of messages; on success use `matchedData(req)` (sanitized/typed values) and redirect to the show page.
- Error handling in `app.js`: unmatched URLs get a 404 and thrown errors a 500, both rendering `views/error.ejs`. Non-numeric ids (e.g. `/films/abc`) are not guarded: Postgres throws and the user gets the 500 page.
- Express 5 handles rejected promises from async handlers automatically, so controllers don't wrap in try/catch.

## Admin password (stopgap until real users)

Edits and deletes are gated by one shared secret, `ADMIN_PASSWORD`; creating stays open. Fails closed: if unset, every protected action is rejected (`app.js` logs a warning at startup). `npm start` doesn't load `.env`, so set it in the environment there.

- Edit (`POST /:id/edit`): `validateAdminPassword` from `validators/adminValidator.js` comes first in the validator chain, so a wrong password re-renders the edit form (400) with the user's input kept and an "Incorrect admin password." error.
- Delete (`POST /:id/delete`): `middleware/requireAdminPassword.js` renders `error` with 403.
- Both use `isAdminPassword` (SHA-256 digests + `timingSafeEqual`) and read the `admin_password` body field.
- Views: the password field is the shared partial `views/partials/adminPassword.ejs` (`<%- include('../partials/adminPassword') %>`); include it, don't copy it. Each `show.ejs` delete form has it; edit forms (shared `new.ejs`) show it only when the controller's `editFormOptions` sets `requirePassword: true`. Any new edit/delete route must use these guards.

## Known state / gotchas

- HTML forms can't send PUT/DELETE and no method-override middleware is installed, so all three resources use POST routes for browser forms: `POST /<x>/:id/edit` (update) and `POST /<x>/:id/delete` (delete, redirects to the index, 404 via `error` view if missing). Deleting a film, genre or director relies on `ON DELETE CASCADE` for the join tables; deleting a genre/director only unlinks it from films, the films stay.
- `express.static` serves `public/`, which holds the single stylesheet `public/style.css` (plain CSS, CSS variables in `:root`, one declaration per line, sectioned with comments). Every view links it in `<head>` via `<link rel="stylesheet" href="/style.css" />` — add that line to any new view, and `<%- include('../partials/nav') %>` (shared nav in `views/partials/nav.ejs`; use `partials/nav` from top-level views like `home.ejs` and `error.ejs`) instead of copying the nav markup. Keep the look minimal and classy: warm off-white, Georgia serif, muted gold accent, no frameworks.
