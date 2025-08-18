# Repository Guidelines

## Project Structure & Module Organization

- `src/entrypoints/`: Web extension entry points (`background.ts`, `chatgpt.content.ts`, `popup/`, `sidepanel/`).
- `src/lib/`: Core logic.
  - `store/`: TinyBase schemas, provider, and ID helpers.
  - `scrape/`: DOM helpers and ChatGPT scrapers.
- `src/components/`: Reusable UI (e.g., `ui/button.tsx`, store utilities).
- `public/`: Icons and static assets.
- `.wxt/`, `wxt.config.ts`: WXT configuration. `tsconfig.json` defines `@/*` path alias.

## Build, Test, and Development Commands

- `pnpm dev` / `pnpm dev:firefox`: Run the extension in a browser via WXT.
- `pnpm build` / `pnpm build:firefox`: Production build to `.output/`.
- `pnpm zip` / `pnpm zip:firefox`: Package build artifacts.
- `pnpm compile`: Type-check TypeScript only.
- `pnpm format` / `pnpm format:check`: Auto-format or verify formatting.

Example: `pnpm dev` then load the extension per WXT’s prompt.

## Coding Style & Naming Conventions

- Language: TypeScript (`.ts`, `.tsx`) with React.
- Formatting: Prettier (Tailwind plugin). Run `pnpm format` before pushing.
- Imports: Use `@/...` alias for `src` (e.g., `import { q } from "@/lib/scrape/dom"`).
- Components: PascalCase files in `src/components/`; hooks and utilities in `src/lib/`.
- Keep modules focused: scraping in `src/lib/scrape/`, state in `src/lib/store/`.

## Testing Guidelines

- No automated tests are configured yet. Preferred stack: Vitest for units, Playwright for E2E.
- For now, validate flows manually:
  - Start with `pnpm dev` and navigate to `https://chatgpt.com/*`.
  - Verify content script capture and background store updates (TinyBase in IndexedDB).
- Name prospective test files `*.test.ts` and colocate with sources.

## Commit & Pull Request Guidelines

- Commits: Imperative, concise, present tense (e.g., "capture on react hydrate").
- PRs: Include purpose, context, and screenshots/GIFs of popup/sidepanel as relevant.
- Link issues, list manual test steps, and note any schema or entrypoint changes.

## Security & Configuration Tips

- Scope content scripts narrowly (`matches: ["https://chatgpt.com/*"]`). Avoid logging sensitive content.
- Persistent data lives in IndexedDB via TinyBase; provide a reset path (see `ResetStoreButton`).
- When changing `wxt.config.ts` or Tailwind setup, restart dev.

## Architecture Overview

- Content script scrapes ChatGPT pages and emits a typed envelope to the background.
- Background persists threads/messages in TinyBase and exposes UI via popup/sidepanel.
