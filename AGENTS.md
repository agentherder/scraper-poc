# Repository Guidelines

## Project Structure & Module Organization

- Source: `src/`
  - `entrypoints/`: extension surfaces — `background.ts`, `popup/`, `sidepanel/`, `chatgpt.content.ts`.
  - `scrape/`: DOM and ChatGPT scraping (`messages.ts`, `thread.ts`, `dom.ts`).
  - `components/`: React UI and store helpers.
  - `store/`: TinyBase-backed persisted/ephemeral stores.
  - `lib/` and `assets/`: utilities, Tailwind/CSS/assets.
- Config: `wxt.config.ts`, `tsconfig.json`, `.prettierrc`.
- Static: `public/`.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies (first run).
- `pnpm dev`: start WXT dev server (Chromium).
- `pnpm dev:firefox`: dev server targeting Firefox.
- `pnpm build` / `pnpm build:firefox`: production builds to `.output/`.
- `pnpm zip` / `pnpm zip:firefox`: package build artifacts.
- `pnpm compile`: type-check TypeScript only.
- `pnpm format` / `pnpm format:check`: auto-format or verify formatting.

## Coding Style & Naming Conventions

- Formatting: Prettier (Tailwind plugin). Run `pnpm format` before PRs.
- TypeScript: prefer explicit types for public APIs; use path alias `@/…`.
- React: components PascalCase (e.g., `App.tsx`); hooks/utils lowercase (e.g., `utils.ts`).
- CSS: Tailwind v4; keep class lists ordered (plugin-enforced).
- Indentation: 2 spaces; trailing commas enabled.

## Testing Guidelines

- Current: no test runner configured. If adding tests, use Vitest + React Testing Library.
- Naming: co-locate as `*.test.ts(x)` or under `__tests__/`.
- Execution: add a future `pnpm test` script; ensure `pnpm compile` passes.

## Commit & Pull Request Guidelines

- Commits: short, imperative summaries (e.g., "fix scrape selector", "scaffold sidepanel").
- PRs: include what/why, linked issues, and screenshots/GIFs for UI changes (popup/sidepanel).
- Quality gates: `pnpm build` succeeds, `pnpm compile` clean, `pnpm format:check` passes.
- Include manual test steps for affected flows (e.g., chat page scrape, popup interactions).

## Security & Configuration Tips

- Avoid secrets in code; prefer WXT config and browser storage when needed.
- Guard DOM selectors in content scripts; handle nulls and permission changes.
- Persisted data uses TinyBase (IndexedDB); avoid storing sensitive content.
