# Film Tracker

A small server-rendered web app for keeping track of films, the genres they belong to and the directors who made them. Built with Express, EJS and PostgreSQL, with no ORM and no front-end framework.

## Features

- Browse, add, edit and delete **films**, **genres** and **directors**
- Films link to many genres and many directors, and each genre or director page lists its films
- Form validation with friendly error messages that keep what you typed
- Editing and deleting are protected by a shared **admin password**
- Clean, minimal styling in a single stylesheet

## Tech stack

- [Node.js](https://nodejs.org/) 20.11 or newer (ES modules)
- [Express 5](https://expressjs.com/) with [EJS](https://ejs.co/) templates
- [PostgreSQL](https://www.postgresql.org/) via [`pg`](https://node-postgres.com/)
- [express-validator](https://express-validator.github.io/) for input validation

## Getting started

### 1. Install

```bash
git clone <your-repo-url>
cd film-tracker
npm install
```

### 2. Configure

Copy the example environment file and fill it in:

```bash
cp .env.example .env
```

| Variable         | Purpose                                                      |
| ---------------- | ------------------------------------------------------------ |
| `PORT`           | Port to listen on (default `8000`)                           |
| `DATABASE_URL`   | PostgreSQL connection string                                 |
| `ADMIN_PASSWORD` | Password required to edit or delete anything. Pick your own. |

If `ADMIN_PASSWORD` is not set, all edits and deletes are rejected.

### 3. Create the database

Create an empty PostgreSQL database, then create the tables and add some sample data:

```bash
node db/populatedb.js "<your-connection-string>"
```

This is safe to run again. It creates the tables only if they are missing and adds the sample data only when the `films` table is empty.

### 4. Run

```bash
npm run dev    # auto-reloads on changes and reads .env
npm start      # plain `node app.js`; does NOT read .env, so set the variables yourself
```

Then open <http://localhost:8000>.

## Using the app

| Page          | URL                                      |
| ------------- | ---------------------------------------- |
| Films         | `/films`, `/films/new`, `/films/:id`     |
| Genres        | `/genres`, `/genres/new`, `/genres/:id`  |
| Directors     | `/directors`, `/directors/new`, `/directors/:id` |

Anyone can browse and add items. To **edit** or **delete**, enter the admin password in the form. This is a stopgap until real user accounts are added: it is a single shared secret, not a login system.

## Project structure

```
app.js              App setup, middleware and error handling
routes/             URL -> controller mapping (one router per resource)
validators/         express-validator rules, plus the admin password check
controllers/        Request handling: validate, call queries, render or redirect
middleware/         Admin password guard for delete routes
db/
  pool.js           Shared PostgreSQL connection pool
  queries.js        All SQL, grouped by resource
  populatedb.js     Creates tables and seeds sample data
views/              EJS templates (partials/ holds the shared nav and password field)
public/style.css    The only stylesheet
```

Each resource follows the same flow:

`routes → validators → controllers → db/queries.js → views`

## Database

Three tables, `films`, `genres` and `directors`, joined by two many-to-many tables, `film_genres` and `film_directors`. Deleting a film removes its links. Deleting a genre or director only unlinks it, and the films stay. The schema lives in `db/populatedb.js`.

## Notes and limitations

- There are no automated tests or linting yet.
- The admin password is sent in plain form data, so use HTTPS if this is ever deployed beyond your own machine. There is also no rate limiting or CSRF protection.
