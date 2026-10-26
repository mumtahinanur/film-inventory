# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start with `node --watch --env-file=.env app.js` (auto-reload)
- `npm start` — `node app.js` (does NOT load `.env`; env vars must already be set)
- `node db/populatedb.js <connection-string>` — create tables (idempotent) and seed dummy data only if `films` is empty
- No test or lint tooling is configured.

Requires a `.env` with `PORT` (default 8000) and `DATABASE_URL` (PostgreSQL).

## Architecture

Express 5 + EJS + `pg` (no ORM), ES modules (`"type": "module"`), server-rendered MVC. Three resources — films, genres, directors — each with the same layout:

`routes/<x>Router.js` → `validators/<x>Validator.js` (express-validator chain, used on POST) → `controllers/<x>Controller.js` → `db/queries.js` → `views/<x>/{index,show,new}.ejs`

- `app.js` mounts the routers at `/films`, `/genres`, `/directors`, plus `/` for home.
- `db/queries.js` holds all SQL (shared `pool` from `db/pool.js`). Films are read via a shared `FILM_SELECT` that aggregates genres/directors into JSON arrays via subqueries; multi-table writes (e.g. `createFilm`) use a transaction on a dedicated client.
- Schema: `films`, `genres`, `directors`, with many-to-many join tables `film_genres` and `film_directors` (`ON DELETE CASCADE`). Schema lives only in `db/populatedb.js`.
- Form pattern (see `filmsController.createFilm`): on validation failure, re-render the `new` view with status 400, the submitted `values`, and a de-duplicated `errors` array of messages; on success use `matchedData(req)` (sanitized/typed values) and redirect to the show page.
- Express 5 handles rejected promises from async handlers automatically, so controllers don't wrap in try/catch.

## Known state / gotchas

- `updateFilm`/`deleteFilm` (PUT/DELETE routes) are stubs returning 501. HTML forms can't send PUT/DELETE and no method-override middleware is installed.
- The error-handling middleware in `app.js` renders `errors/500`, but only `views/error.ejs` exists (controllers render `error` for 404s) — the 500 view is missing.
- `express.static` serves `public/`, which does not exist yet.
- `package.json` metadata (description, repo URLs) refers to a "grocery-inventory" project; it is stale.
