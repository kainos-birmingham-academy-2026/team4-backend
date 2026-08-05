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

## API 
The API should run at `http://localhost:3000`.
`http://localhost:3000/health` should display the current time. 


## Docker Setup
Wrtie this command to run the PostgreSQL database:
```bash
docker run --name jobRoles-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=jobRoles -p 5432:5432 -d postgres
```

## Initialise Prisma
Add an `.env` file and put this database URL connection string in the file:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/jobRoles"
```