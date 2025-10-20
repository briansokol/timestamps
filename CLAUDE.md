# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Production build 
- `npm run lint` - ESLint validation
- `npm run start` - Start production server on port 7623

### Testing
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Watch mode for tests
- `npm run test:coverage` - Generate test coverage

### Database Operations
- `npm run db:migrate` - Apply database migrations (required for initial setup)
- `npm run db:generate` - Generate Drizzle migrations after schema changes in `src/db/schema/schema.ts`

### Docker Operations
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop containers (preserve volumes)
- `npm run docker:rebuild` - Force rebuild and restart
- `npm run docker:uninstall` - Complete removal including data (destructive)

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and React Server Components
- **Frontend**: React 19 + TypeScript + Mantine UI + Tailwind CSS
- **Database**: SQLite with LibSQL client + Drizzle ORM
- **State Management**: TanStack React Query for server state
- **Validation**: Zod schemas
- **Testing**: Vitest + React Testing Library

### Core Structure
- **`src/app/`** - Next.js App Router pages and API routes
- **`src/components/`** - React components with clear separation of concerns
- **`src/db/`** - Database schema, migrations, and utilities
- **`src/hooks/`** - Custom React hooks for data fetching with React Query
- **`src/validations/`** - Zod schemas for type-safe validation

### Database Schema
Two main entities with nanoid primary keys:
- **Sessions**: `id`, `title`, `startedAt`, `endedAt` (nullable)
- **Timestamps**: `id`, `sessionId` (FK), `title` (optional), `createdAt`

### API Design Patterns
- RESTful endpoints in `src/app/api/`
- Zod validation for all requests/responses
- Server Components by default, Client Components only when needed
- React Query hooks abstract all data fetching logic

## Development Guidelines

### Working with Claude Code
- **Use Subagents**: Leverage specialized subagents when appropriate to handle complex, multi-step tasks more efficiently
  - `unit-test-expert`: For writing, updating, running, and debugging tests
  - `Explore`: For exploring the codebase, searching for patterns, or answering architectural questions
  - `general-purpose`: For complex research, multi-step tasks, or open-ended searches
- Let subagents run autonomously for their specialized tasks rather than performing all steps manually

### Code Standards
- Add JSDoc comments above class and function definitions
- Add TypeScript types for all function inputs and return values
- Use public/private modifiers on class methods (private methods start with underscore)
- Use `npm install --save-exact` for precise dependency versioning

### Testing Standards
- **Framework**: Vitest (not Jest) - all functions must be imported, no globals
- **Structure**: Use `describe()` and `it()` (not `test()`)
- **React Testing**: Use React Testing Library with `screen` object, avoid direct DOM access
- **Setup**: Test configuration in `src/test/setup.ts`

### Database Workflow
1. Modify schema in `src/db/schema/schema.ts`
2. Run `npm run db:generate` to create migration
3. Run `npm run db:migrate` to apply changes

## Application Context

This is a timestamp management system for live streams or recording sessions. The API is intentionally unsecured and designed for local use only. Users create sessions and add timestamps to them, with support for multiple export formats through the UI.