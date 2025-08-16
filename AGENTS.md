# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` (primary code).
  - `entrypoints/`: Extension surfaces — `background.ts`, `popup/`, `sidepanel/`, and `chatgpt.content.ts`.
  - `scrape/`: DOM and ChatGPT scraping utilities.
  - `components/`: React UI and store-related components.
  - `stores/`: TinyBase-backed persisted/ephemeral stores.
  - `lib/` and `assets/`: utilities and Tailwind/CSS/assets.
- Config: `wxt.config.ts`, `tsconfig.json`, `.prettierrc`.
- Static: `public/`.

## Build, Test, and Development Commands
- `pnpm install`: Install dependencies (required first run).
- `pnpm dev`: Start WXT dev server; loads the extension for Chromium.
- `pnpm dev:firefox`: Run dev server targeting Firefox.
- `pnpm build`: Production build to `.output/`.
- `pnpm build:firefox`: Build targeting Firefox.
- `pnpm zip` / `pnpm zip:firefox`: Package build artifacts.
- `pnpm compile`: Type-check TypeScript only (`tsc --noEmit`).
- `pnpm format` / `pnpm format:check`: Auto-format or verify formatting.

## Coding Style & Naming Conventions
- Formatting: Prettier with Tailwind plugin; run `pnpm format` before PRs.
- Indentation: Prettier defaults (2 spaces); trailing commas enabled.
- React: Components in PascalCase (e.g., `App.tsx`); hooks/utilities in lowercase (e.g., `utils.ts`).
- TypeScript: Prefer explicit types for public APIs; use `src/@/*` path alias (`@/…`).
- CSS: Tailwind v4 via Vite plugin; keep class lists ordered (plugin-enforced).

## Testing Guidelines
- Current state: No test runner configured.
- If adding tests: prefer Vitest + React Testing Library.
  - Naming: co-locate as `*.test.ts(x)` or under `__tests__/`.
  - Run via a future `pnpm test` script; ensure type checks pass (`pnpm compile`).

## Commit & Pull Request Guidelines
- Commits: Short, imperative summaries (e.g., “fix scrape selector”, “scaffold sidepanel”). Scope tags optional.
- PRs: Include what/why, linked issues, screenshots/GIFs for UI changes (popup/sidepanel), and manual test steps.
- Quality gates: build succeeds (`pnpm build`), type check clean (`pnpm compile`), formatting verified.

## Security & Configuration Tips
- Avoid secrets in code; use WXT config for platform-specific settings.
- Be cautious with selectors and DOM access in content scripts; guard for nulls and permission changes.
- Persisted data lives in IndexedDB via TinyBase; avoid storing sensitive content unless required.
