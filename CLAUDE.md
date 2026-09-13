# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`code-connect` is a pnpm monorepo (`pnpm-workspace.yaml`) with two independent apps under `apps/`:

- **apps/api** — NestJS backend (TypeScript), unmodified `@nestjs/cli` starter.
- **apps/web** — React 19 + Vite frontend (TypeScript), Oxlint for linting. Has the login (`/login`) and signup (`/cadastro`) screens implemented with atomic design + Tailwind v4; see `plans/tela-de-login.md` and `plans/tela-de-cadastro.md`.

`apps/api` is still at scaffold stage (default starter code, no custom domain logic yet).

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
pnpm --filter web test      # vitest run
pnpm --filter web test:watch # vitest watch mode
```

Test runner is Vitest + React Testing Library (jsdom). Unit test files live alongside source as `*.test.tsx`/`*.test.ts` (e.g. `Button.test.tsx` next to `Button.tsx`); config lives in `apps/web/vite.config.ts` (`test` key) and `apps/web/src/test/setup.ts`.

## Architecture notes

- Apps are fully independent — no shared packages/libs between `apps/api` and `apps/web` exist yet, and there is no cross-app import path configured.
- `apps/api` follows standard Nest module structure: `AppModule` wires `AppController` + `AppService`; new features should follow the Nest convention of one module per domain area (`*.module.ts`, `*.controller.ts`, `*.service.ts`).
- `apps/web` uses Oxlint (not ESLint) for linting — config is in `apps/web/.oxlintrc.json`. Type-aware lint rules are not enabled by default.
- `apps/api` uses ESLint + Prettier — config in `apps/api/eslint.config.mjs` and `apps/api/.prettierrc`.

## Frontend conventions (apps/web)

- **Atomic design**: structure components by atoms → molecules → organisms → templates → pages, under `apps/web/src/components/{atoms,molecules,organisms,templates,pages}`. Each component folder holds `<Name>.tsx`, `<Name>.test.tsx`, and an `index.ts` barrel.
- **Tailwind CSS v4** via `@tailwindcss/vite` — CSS-first config, no `tailwind.config.*`. Design tokens (colors, font, type scale, radii) live in `apps/web/src/index.css` under `@theme`.
- **No raw hex or px font sizes directly in Tailwind classes/components.** Always go through a token in `@theme`; components consume semantic classes (`bg-canvas`, `text-brand`, `text-body`, ...), never `bg-[#...]` or `text-[18px]`.
  - **Colors** — two-tier palette in `apps/web/src/index.css`:
    - Primitives (raw hex, not used directly in components): `--color-neutral-950` (`#00090e`), `--color-neutral-900` (`#171d1f`), `--color-neutral-500` (`#888888`), `--color-neutral-100` (`#e1e1e1`), `--color-green-950` (`#132e35`), `--color-green-400` (`#81fe88`), `--color-green-500` (`#6ee676`).
    - Semantic tokens (used in classes, each aliases a primitive via `var()`): `--color-canvas`, `--color-card`, `--color-card-border`, `--color-field`, `--color-field-ink`, `--color-line`, `--color-ink`, `--color-ink-muted`, `--color-brand`, `--color-brand-hover`, `--color-brand-ink`, `--color-glyph`.
    - Adding a new color: add/reuse a primitive first, then add a semantic token that references it — never inline a new hex value directly on a semantic token or in a component.
  - **Font sizes** — semantic tokens (`--text-label`, `--text-small`, `--text-body`, `--text-subtitle`, `--text-heading`) must each alias Tailwind's built-in scale (`var(--text-xs)`, `var(--text-sm)`, `var(--text-lg)`, `var(--text-2xl)`, `var(--text-3xl)`, ...) picking the closest default step to the design spec — never a custom pixel/rem value. All carry a `--text-*--line-height: 1.5` companion per the Figma spec.
- Components are built to be **reused** — favor generic, prop-driven components over one-off, page-specific ones. The `atoms/`/`molecules/`/`organisms/` shared between the login and signup screens are the reference example.
- Every component must have **fundamental tests** (rendering, key interactions/props) alongside it, using Vitest + Testing Library.
- No form library — forms use plain `useState` + native `required` validation (see `LoginForm`/`SignupForm`).

## Backend conventions (apps/api)

- Follow **REST API principles** throughout: resource-oriented URLs, correct HTTP verbs/status codes, statelessness, and consistent request/response shapes across endpoints.

## Commits

- Both `apps/api` and `apps/web` use **Conventional Commits** (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`, etc.) for commit messages.

## Plans

- Implementation plans are kept as files in a `plans/` folder at the repo root (e.g. `plans/tela-de-login.md`, `plans/tela-de-cadastro.md`).
