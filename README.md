# team4-backend

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
The API should run at `http://localhost:4000`.
`http://localhost:4000/health` should display the current time. 
`http://localhost:4000/api/job-roles` should return a JSON object containing a list of open job roles.


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

Make sure to change the USER and PASSWORD to your database username and password.

## Database commands
- `npx prisma migrate dev --name init`: creates `prisma/migrations/` with SQL migration files, applies the migration to the databases, and runs `prisma generate` to create the tables
- `npx prisma db seed`: seeds the database with initial data
- `npx prisma migrate reset`: drops the database, re-runs all migrations, and calls `db seed` automatically
- `npx prisma studio`: opens Prisma Studio in your browser to browse all tables