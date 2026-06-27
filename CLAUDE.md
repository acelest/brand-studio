# CLAUDE.md — Brand Studio

## Project

Next.js 16 / TypeScript / Tailwind CSS v4 / shadcn Nova / Motion.

Single-page branding application. Upload image or video → apply brand overlay → export.

## Key files

- `app/page.tsx` — main page, state orchestration
- `lib/branding/engine.ts` — canvas draw math (pure function, no React)
- `types/brandkit.ts` — all TypeScript types + AVAILABLE_BRANDS registry
- `public/brands/mybestsim/brand.json` — BrandKit config source of truth

## Rules

1. Tailwind v4 CSS-first. Use `globals.css @theme` for tokens. Never create `tailwind.config.ts`.
2. shadcn/ui: add components via `npx shadcn@canary add <component> --yes`.
3. No FFmpeg. Canvas export only today.
4. State lives in hooks only. No prop drilling beyond one level.
5. Run `npx tsc --noEmit` + `npm run build` before marking done.

## Commands

```bash
npm run dev       # dev server
npx tsc --noEmit  # type check
npm run build     # production build
npm run lint      # lint
```
