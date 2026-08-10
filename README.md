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


## Docker Setup
Write this command to run the PostgreSQL database:
```bash
docker run --name jobRoles-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=jobRoles -p 5432:5432 -d postgres
```

## Database and Port Setup
Add the `.env` file to the root folder of the project and put these strings in the file:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/jobRoles"
PORT=4000
```

Make sure to change the USER and PASSWORD to your database username and password.

## Database commands
- `npx prisma migrate dev --name init`: creates `prisma/migrations/` with SQL migration files, applies the migration to the databases, and runs `prisma generate` to create the tables
- `npx prisma db seed`: seeds the database with initial data
- `npx prisma migrate reset`: drops the database, re-runs all migrations, and calls `db seed` automatically
- `npx prisma studio`: opens Prisma Studio in your browser to browse all tables