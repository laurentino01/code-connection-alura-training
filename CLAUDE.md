# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`code-connect` is a pnpm monorepo (`pnpm-workspace.yaml`) with two independent apps under `apps/`:

- **apps/api** — NestJS backend (TypeScript), unmodified `@nestjs/cli` starter.
- **apps/web** — React 19 + Vite frontend (TypeScript), unmodified Vite React starter using Oxlint.

Both apps are currently at scaffold stage (default starter code, no custom domain logic yet).

## Commands

Run from the repo root using the workspace scripts, or `cd` into the relevant app and use its own scripts directly.

### Root (pnpm workspace)

```bash
pnpm install          # install all workspace deps
pnpm dev:web           # apps/web dev server (vite)
pnpm dev:api           # apps/api dev server, watch mode (nest start --watch)
pnpm build:web          # build apps/web
pnpm build:api          # build apps/api
pnpm start:api          # run apps/api (nest start, no watch)
pnpm build             # build all apps (pnpm -r build)
pnpm lint              # lint all apps (pnpm -r lint)
```

### apps/api (NestJS)

```bash
pnpm --filter api start:dev     # dev server, watch mode
pnpm --filter api start:debug   # dev server, debug + watch mode
pnpm --filter api build          # compile (nest build)
pnpm --filter api start:prod     # run compiled dist/main
pnpm --filter api lint           # eslint --fix
pnpm --filter api format         # prettier --write
pnpm --filter api test           # jest unit tests
pnpm --filter api test:watch     # jest watch mode
pnpm --filter api test:cov       # jest with coverage
pnpm --filter api test:e2e       # e2e tests (test/jest-e2e.json config)
```

To run a single unit test file, `cd apps/api` and use Jest directly, e.g. `npx jest app.controller.spec.ts`. Unit test files live alongside source as `*.spec.ts` (Jest `rootDir` is `src`); e2e specs live in `apps/api/test/*.e2e-spec.ts`.

### apps/web (Vite + React)

```bash
pnpm --filter web dev      # dev server
pnpm --filter web build     # tsc -b && vite build
pnpm --filter web lint      # oxlint
pnpm --filter web preview   # preview production build
```

No test runner is configured for `apps/web` yet.

## Architecture notes

- Apps are fully independent — no shared packages/libs between `apps/api` and `apps/web` exist yet, and there is no cross-app import path configured.
- `apps/api` follows standard Nest module structure: `AppModule` wires `AppController` + `AppService`; new features should follow the Nest convention of one module per domain area (`*.module.ts`, `*.controller.ts`, `*.service.ts`).
- `apps/web` uses Oxlint (not ESLint) for linting — config is in `apps/web/.oxlintrc.json`. Type-aware lint rules are not enabled by default.
- `apps/api` uses ESLint + Prettier — config in `apps/api/eslint.config.mjs` and `apps/api/.prettierrc`.

## Frontend conventions (apps/web)

- **Atomic design**: structure components by atoms → molecules → organisms → templates → pages.
- **Tailwind CSS** is the styling approach (not yet installed in the scaffold — set up `tailwindcss` + `@tailwindcss/vite` before/while adding the first styled component).
- Components are built to be **reused** — favor generic, prop-driven components over one-off, page-specific ones.
- Every component must have **fundamental tests** (rendering, key interactions/props) alongside it.

## Backend conventions (apps/api)

- Follow **REST API principles** throughout: resource-oriented URLs, correct HTTP verbs/status codes, statelessness, and consistent request/response shapes across endpoints.

## Commits

- Both `apps/api` and `apps/web` use **Conventional Commits** (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`, etc.) for commit messages.

## Plans

- Implementation plans are kept as files in a `plans/` folder at the repo root (not yet created — create it when the first plan is written).
