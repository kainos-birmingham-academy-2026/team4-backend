# team4-backend

## Prerequisites

- Node.js 18+
- npm
- Docker Desktop (for full-stack setup)

**Required Folder Structure:**

Both `team4-backend` and `team4-frontend` must be cloned in the same parent folder:

```
parent-folder/
  team4-backend/     ← This repository
  team4-frontend/    ← Related repository
```

This structure is required for the Docker Compose setup to work correctly.

## Install
- `npm install`: installs all the dependencies

## Run scripts
- `npm run build`: builds the app and stores output in `./dist`
- `npm run dev`: runs the app in hot reload mode
- `npm run start`: starts the new app from the `./dist` folder 

## Test scripts
- `npm run test`: runs all test suites
- `npm run test:watch`: runs all test suites, watches for changes, and reruns tests when they change
- `npm run test:coverage`: runs all tests and generates a coverage report
- `npm run test:ui`: runs all tests in UI mode

## Linting scripts
- `npm run lint`: runs the linter and flags any issues
- `npm run lint:fix`: runs the linter and performs any safe fixes

## Git Hook Setup (Lefthook)

Pre-commit hooks are installed automatically by `npm install` through the `prepare` script.

You only need to run this manually if install scripts were skipped (for example, `npm install --ignore-scripts`):

```bash
npm run prepare
```

## API

### Job roles
* `GET /api/job-roles` returns a paginated JSON object containing a list of job roles, with optional filtering and sorting.
* `GET /api/job-roles/filter-options` returns a JSON object containing the available filters for job roles.
* `GET /api/job-roles/create-options` returns the capability, band, and status options for creating a job role. Requires an Admin token.
* `GET /api/job-roles/:id` returns a JSON object detailing a specific job role.
* `POST /api/job-roles` creates a new job role. Requires an Admin token.
* `PUT /api/job-roles/:id` updates an existing job role. Requires an Admin token.
* `DELETE /api/job-roles/:id` deletes a job role. Requires an Admin token.

### Applications
* `GET /api/applications` returns the applications submitted by the current authenticated user. Each application includes `applicationId`, `userId`, `jobRoleId`, `roleName`, `status`, and `createdAt`. Requires a user token.
* `POST /api/applications` submits a job application for the current authenticated user. Requires a user token.
* `GET /api/applications/job-role/:jobRoleId` returns the applications submitted for a job role, including applicant email and message. Requires an Admin token.
* `POST /api/applications/:applicationId/hire` marks an in-progress application as hired and reduces the role's open positions by one. Requires an Admin token.
* `POST /api/applications/:applicationId/reject` marks an in-progress application as rejected. Requires an Admin token.

### Chat
* `POST /api/chat` sends a message to the careers chat assistant and returns a response.

### Auth
* `POST /auth/login` handles login requests.
* `POST /auth/register` handles registration requests.

### Health
* `GET /health` displays the current server status and time.

A client must be logged in to send requests to the job role pages. To log in:
1. Send a POST request to `/auth/login` with this body:
```JSON
{
   "email": "test1@example.com",
   "password": "Password123!"
}
```

If you want to use an admin account, use these credentials:
```JSON
{
   "email": "admin@example.com"
   "password": "AdminPassword123!"
}
```

You should receive a token in response. In future requests to `/api/job-roles` or similar pages, add an Authorization header with the value `Bearer <token>`.


## Environment Setup
Add the `.env` file to the root folder of the project and put these values in the file:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/jobRoles"
PORT=4000
JWT_SECRET=<generate_a_random_value>
```
Make sure the USERNAME and PASSWORD match your own database username and password.

## Docker Compose (Full-Stack Setup)

For a complete development environment with backend + database + frontend, use the compose file located in the `team4-frontend` repository:
## Docker & Deployment

### ⚠️ Docker Requirement

**Important:** Docker Desktop must be running before starting any containers or running the compose file.

### Full-Stack Setup with Docker Compose

For a complete development environment with backend + database + frontend, use the compose file located in the `team4-frontend` repository:

1. Ensure both repositories are cloned in the same parent folder:
   ```
   parent-folder/
     team4-backend/
     team4-frontend/
       compose.yaml  ← Here
   ```
   
2. Start the full stack:
   ```bash
   cd ../team4-frontend
   docker compose up --build -d
   ```

3. This will automatically:
   - Start PostgreSQL 15 database (port 5432)
   - Start the backend API (port 4000)
   - Start the frontend server (port 3000)
   - Run database migrations
   - Seed the database with initial data

4. The API will be available at `http://localhost:4000`

### Stopping and Cleaning Up

When you're done developing, clean up all containers and free up ports:

```bash
cd ../team4-frontend
docker compose down -v
```

The `-v` flag removes volumes (including the database), allowing you to run `docker compose up --build -d` again for a completely fresh environment.

#1. Ensure PostgreSQL is running locally
2. Create a `.env` file in the root:
   ```bash
   DATABASE_URL="postgresql://postgres:password@localhost:5432/jobRoles"
   PORT=4000
   ```
3. Run migrations: `npx prisma migrate deploy`
4. Seed database: `npx prisma db seed`
5. Start dev server: `npm run dev`


## Database commands
- `npx prisma migrate dev --name init`: creates `prisma/migrations/` with SQL migration files, applies the migration to the databases, and runs `prisma generate` to create the tables
- `npx prisma db seed`: seeds the database with initial data
- `npx prisma migrate reset`: drops the database, re-runs all migrations, and calls `db seed` automatically
- `npx prisma studio`: opens Prisma Studio in your browser to browse all tables