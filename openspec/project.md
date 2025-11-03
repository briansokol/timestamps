# Project Context

## Purpose

A timestamp management system designed for live streams and recording sessions. The application allows users to create sessions and add timestamps with optional titles during live events, enabling easy navigation and export of key moments. The system is intentionally designed for local use only with an unsecured API for simplicity.

## Tech Stack

- **Framework**: Next.js 16 with App Router and React Server Components
- **Frontend**: React 19, TypeScript, Mantine UI, Tailwind CSS
- **Database**: SQLite with LibSQL client + Drizzle ORM
- **State Management**: TanStack React Query for server state
- **Validation**: Zod schemas for type-safe validation
- **Testing**: Vitest + React Testing Library
- **Dev Tools**: Turbopack (dev server), ESLint
- **Deployment**: Docker support with containerized setup

## Project Conventions

### Code Style

- **Documentation**: JSDoc comments required above all class and function definitions
- **TypeScript**: Explicit types for all function parameters and return values
- **Classes**: Use public/private modifiers; private methods prefixed with underscore
- **Components**: Server Components by default, Client Components only when interactivity needed
- **File Organization**:
    - `src/app/` - Next.js App Router pages and API routes
    - `src/components/` - React components with clear separation of concerns
    - `src/hooks/` - Custom React hooks for data fetching with React Query
    - `src/validations/` - Zod schemas for type-safe validation
    - `src/db/` - Database schema, migrations, and utilities

### Architecture Patterns

- **API Design**: RESTful endpoints in `src/app/api/` with Zod validation for all requests/responses
- **Data Fetching**: React Query hooks abstract all data fetching logic
- **Database**: Drizzle ORM with SQLite, using nanoid for primary keys
- **Validation**: Zod schemas define contracts between frontend/backend
- **State**: Server state via React Query, minimal client state
- **Schema**:
    - **Sessions**: `id`, `title`, `startedAt`, `endedAt` (nullable)
    - **Timestamps**: `id`, `sessionId` (FK), `title` (optional), `createdAt`

### Testing Strategy

- **Framework**: Vitest (not Jest) - all functions must be imported explicitly, no globals
- **Structure**: Use `describe()` and `it()` (not `test()`) for test organization
- **React Testing**: React Testing Library with `screen` object, avoid direct DOM access
- **Setup**: Test configuration in `src/test/setup.ts`
- **Commands**:
    - `npm run test` - Run tests
    - `npm run test:watch` - Watch mode
    - `npm run test:coverage` - Generate coverage reports

### Git Workflow

- **Main Branch**: `main` (used for PRs and primary development)
- **Dependency Management**: Use `npm install --save-exact` for precise versioning
- **Database Workflow**:
    1. Modify schema in `src/db/schema/schema.ts`
    2. Run `npm run db:generate` to create migration
    3. Run `npm run db:migrate` to apply changes

## Domain Context

**Timestamp Sessions**: A session represents a single live stream or recording event with a defined start time and optional end time. During an active session, users add timestamps to mark significant moments.

**Timestamps**: Individual markers within a session that capture specific moments in time. Each timestamp has a creation time and optional title for context. Timestamps enable quick navigation to key moments and can be exported in various formats.

**Use Case**: Primarily used during live streaming or video recording to capture important moments in real-time. The system supports:

- Creating/managing multiple concurrent sessions
- Adding timestamps with optional descriptive titles
- Ending sessions to mark completion
- Exporting timestamps in multiple formats
- Viewing session history with infinite scrolling

## Important Constraints

- **Security**: API is intentionally unsecured - designed for local use only, not production deployment
- **Platform**: Production server runs on port 7623
- **Database**: SQLite-based, suitable for single-user local deployment
- **Environment**: Requires initial database migration (`npm run db:migrate`) before first use
- **Docker**: Available for containerized deployment but still intended for local use only

## External Dependencies

- **None**: This is a fully self-contained local application with no external API dependencies
- **UI Framework**: Mantine UI component library
- **Database**: Local SQLite database (no external database service required)
- **Development Tools**:
    - context7 MCP server for library documentation during development
    - Playwright MCP server for browser automation testing

## Development Workflow

- **Dev Server**: `npm run dev` (with Turbopack)
- **Production Build**: `npm run build` → `npm run start`
- **Linting**: `npm run lint`
- **Docker**: `npm run docker:up` for containerized local deployment
