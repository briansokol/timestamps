# Timestamps

This is an app you can run locally in a Docker container to manage timestamps. It comes with a UI and an API. The API is not secured, so I do not recommend deploying it anywhere public.

This app can be used purely through the API or UI, or a combination of both.

To use the app, first create a new session. This could be a live stream or a recording session, for example. Give it a name if you want, otherwise it will be named after the current day and time. Starting a session will automatically close the previous session (if one is open).

Then, add timestamps. Timestamps will be added to the current session. If no session is active, one will be created.

The UI will allow you to see the sessions and get timestamps in different formats.

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
