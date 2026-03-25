# CLAUDE.md

This file provides guidance to Claude Code when working with the cashbackServer repository.

## Project Overview

NestJS backend server for a cashback management application. Users manage bank cards and cashback offers from Russian banks. Auth is handled via Google/Yandex OAuth2 with JWT tokens. Data is stored in MongoDB via Mongoose.

**Stack:** TypeScript, NestJS v10, MongoDB/Mongoose, Passport.js (JWT + OAuth), Docker, Yarn

## Development Setup

```bash
# Install dependencies
yarn install

# Start in development mode (with watch)
yarn start:dev

# Start with Docker (app + MongoDB + mongo-express UI)
docker-compose up

# Build
yarn build

# Run tests
yarn test
yarn test:e2e
```

**Ports:**
- App: `3001` (mapped to `81` in Docker)
- mongo-express UI: `8081`

**Required environment variables** (see `docker-compose.yml` for reference):
- `DATABASE_URL`, `PORT`, `JWT_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `YANDEX_CLIENT_ID`, `YANDEX_CLIENT_SECRET`
- `CLIENT_URL`, `URL`

## Architecture

```
src/
├── auth/        # OAuth (Google, Yandex) + JWT strategies, guards, service
├── user/        # User CRUD, schemas, cascading deletes
├── card/        # Card management (bank, name, userId)
├── cashback/    # Cashback offers (percentage, icon, color, expiry)
├── app.module.ts
└── main.ts
```

Each module follows NestJS conventions: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `schemas/`, `utils/`, DTOs.

Key shared library: `cashback-check-types` — provides the `EBank` enum and shared types.

## Code Style

- **Formatter:** Prettier — run `yarn format` before committing
- **Linter:** ESLint — run `yarn lint` (auto-fixes on save)
- **TypeScript:** ESNext target, NodeNext modules; `strict` mode is off (no `noImplicitAny`, no `strictNullChecks`)
- Follow existing NestJS module/service/controller patterns when adding features

## Must-Follow Rules

### 1. Use Context7 MCP for Library Lookups

When working with any external library (NestJS, Mongoose, Passport, class-validator, etc.), **always use the Context7 MCP server** to fetch up-to-date documentation before writing code. Do not rely on training-data knowledge for API details.

```
# Example: resolve library ID then fetch docs
mcp: context7 → resolve-library-id("@nestjs/mongoose")
mcp: context7 → get-library-docs(libraryId, topic="schemas")
```

This prevents using deprecated APIs and ensures compatibility with the exact versions in `package.json`.

### 2. Module Boundaries

Each NestJS module owns its own data. Cross-module access must go through the module's exported service — never import another module's repository/schema directly.

### 3. DTO Validation

All incoming request data must be typed with a DTO and validated with `class-validator` decorators. Never accept raw `any` types from controllers.

### 4. Authentication

All non-public routes must be protected with the appropriate guard (`JwtAuthGuard`, or OAuth guards). Do not add unguarded endpoints that expose user data.

### 5. Environment Variables

Never hardcode secrets, URLs, or credentials. Always read from `process.env` and document new variables in `docker-compose.yml`.

## Testing

```bash
yarn test          # Unit tests (Jest)
yarn test:e2e      # End-to-end tests
```

Tests live alongside source files (`*.spec.ts`) or in `test/` for e2e. Follow existing patterns — mock services with Jest, use `@nestjs/testing` `TestingModule` for controller/service tests.

## Common Patterns

**Adding a new module:**
1. Generate with `nest g module <name>`, `nest g controller <name>`, `nest g service <name>`
2. Define Mongoose schema in `schemas/`
3. Create DTOs with `class-validator` decorators
4. Import the module into `app.module.ts`

**Cashback icons/colors:**
- Mapping lives in `src/cashback/cashback.constants.ts`
- Icons are assigned by Russian category name via `getCashbackIcon()`
- Colors are derived from icons via `getCashbackColor()`
