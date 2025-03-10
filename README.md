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

Ensure you have Docker and Docker-Compose installed.

This command will build the image and run it using docker-compose:

```bash
npm run docker:up
```

Stop running services and networks, but keep volumes:

```bash
npm run docker:down
```

If you pull newer code, run this to force a rebuild and then start the container:

```bash
npm run docker:rebuild
```

## Uninstalling

If you need to completely remove everything, _including the database_, run this command:

```bash
npm run docker:uninstall
```

This cannot be undone, so be sure you really want to delete everything before running it.
