# Timestamps

This is an app you can run locally in a Docker container to manage timestamps. It comes with a UI and an API. The API is not secured, so I do not recommend deploying it anywhere public.

## Development

### Database setup

To create a new local database, run:

```bash
npm run db:migrate
```

### Start the dev server

```bash
npm run dev
```

### Lint files

```bash
npm run lint
```

### Database migrations

After making changes to `src/db/schema/schema.ts`, run this script to create a migration file:

```bash
npm run db:generate
```

Then, apply the changes by running:

```bash
npm run db:migrate
```

## Deploying with Docker

First run this command once to create the Docker volume:

```bash
npm run docker:volume
```

Build the container image by running:

```bash
npm run docker:build
```

Finally, run the container by running:

```bash
npm run docker:run
```

You can do all of this with one command for the first run:

```bash
npm run docker
```

## Uninstalling

Stop the running Docker container by running

```bash
npm run docker:stop
```

You can completely remove the container and volume by running the following command (this will destroy the database!):

```bash
npm run docker:remove
```
