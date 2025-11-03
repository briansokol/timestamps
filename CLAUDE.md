<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

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

- **Framework**: Next.js 16 with App Router and React Server Components
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

### Looking up documentation

- Always use **context7** MCP when I need code generation, setup or configuration steps, or library/API documentation. Use the context7 MCP server to get the library ID from the name of the library, and then get the library docs without me having to ask.
- Some common context7 library IDs are:
    - **NextJS**: /vercel/next.js
    - **React**: /reactjs/react.dev
    - **Mantine**: /mantinedev/mantine
    - **Drizzle ORM**: /replit/drizzle-orm
    - **Vitest**: /vitest-dev/vitest
    - **React Testing Library**: /testing-library/react-testing-library

### Working with Claude Code

#### Custom Subagents

Leverage specialized subagents to handle complex, multi-step tasks more efficiently. Let subagents run autonomously for their specialized tasks rather than performing all steps manually.

##### `unit-test-expert`

**Use for all test-related work:**

- Writing new unit tests for functions or components
- Updating existing tests after code changes
- Running tests and analyzing failures
- Debugging test issues or flaky tests
- Improving test coverage for specific modules
- Proactively after implementing new features or fixing bugs

**When to use:**

- User explicitly asks for test-related work (e.g., "write tests for...", "fix the failing test...")
- After implementing a new feature (proactive use to ensure proper test coverage)
- After fixing a bug (proactive use to add regression tests)

**Examples:**

- "Write tests for the new session export feature"
- "The timestamp validation tests are failing, can you fix them?"
- After implementing a feature: proactively use to add comprehensive test coverage

##### `Explore`

**Use for codebase exploration and understanding:**

- Finding files by patterns or naming conventions (e.g., "all React components", "API routes")
- Searching for specific keywords or code patterns across the codebase
- Answering architectural questions (e.g., "How does authentication work?", "Where are errors handled?")
- Understanding code flow and relationships between modules
- Locating specific implementations when unsure of the exact file location

**When to use:**

- Questions starting with "Where is...", "How does...", "What is the structure of..."
- Need to understand existing patterns before implementing new features
- Looking for multiple files or components that follow a pattern
- Searching for usage of a specific library or function across the codebase

**Thoroughness levels:**

- `quick`: Basic searches, known patterns
- `medium`: Moderate exploration, some uncertainty
- `very thorough`: Comprehensive analysis, multiple naming conventions

**Examples:**

- "Where are API endpoints defined in this project?"
- "How is session state managed across components?"
- "Find all components that use the useTimestamps hook"
- "What is the overall codebase structure?"

##### `playwright-visual-tester`

**Use for browser-based testing and visual validation:**

- Validating UI changes render correctly in a real browser
- Testing user interactions and workflows end-to-end
- Taking screenshots for visual regression testing
- Verifying responsive design across different viewport sizes
- Testing form submissions and data persistence
- Validating client-side JavaScript behavior

**When to use:**

- After making UI changes that need visual verification
- When implementing new user-facing features
- Testing complete user workflows (e.g., create session → add timestamp → export)
- Validating responsive design changes
- Debugging layout or styling issues

**Examples:**

- "I just updated the session card layout, can you verify it renders correctly?"
- "Test the complete flow of creating a session and adding timestamps"
- "Check if the export modal displays properly on mobile viewports"
- "Validate that the timestamp deletion workflow works end-to-end"

##### `docs-fetcher`

**Use for retrieving library and framework documentation:**

- Looking up API documentation for specific libraries
- Understanding how to use a framework feature correctly
- Getting up-to-date documentation for dependencies
- Learning best practices for a library being used

**When to use:**

- Need current documentation for a library (automatically uses context7 MCP)
- Implementing a feature with a library you're less familiar with
- Want to verify correct API usage for a dependency

**Examples:**

- "How do I use React Query mutations properly?"
- "What's the correct way to handle forms with Mantine?"
- "Get the latest documentation for Drizzle ORM migrations"

##### `general-purpose`

**Use for complex, multi-step tasks that don't fit other categories:**

- Complex research requiring multiple rounds of searching
- Tasks that span multiple domains (codebase + documentation + web research)
- Multi-step refactoring across many files
- Open-ended investigations that may require adaptive searching

**When to use:**

- Task requires more than 3-4 distinct steps
- Uncertain about the full scope of work needed
- Need to gather information from multiple sources
- Combining exploration, implementation, and testing in a complex workflow

**Examples:**

- "Analyze the entire codebase and suggest performance improvements"
- "Research and implement a new feature for batch timestamp operations"
- "Investigate why the application is slow and propose solutions"

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
- **Visual Testing**: Use the Playwright MCP for browser-based visual testing, UI interaction validation, and end-to-end testing scenarios

### Database Workflow

1. Modify schema in `src/db/schema/schema.ts`
2. Run `npm run db:generate` to create migration
3. Run `npm run db:migrate` to apply changes

## Application Context

This is a timestamp management system for live streams or recording sessions. The API is intentionally unsecured and designed for local use only. Users create sessions and add timestamps to them, with support for multiple export formats through the UI.
