# AGENTS.md — Brand Studio

Agent guide for Brand Studio. Read this before touching any file.

---

## What this project is

Brand Studio is a **standalone Next.js 16 single-page application**.

It is part of the **Content Platform**, alongside Content Factory (the Python CLI engine).

It is **NOT** inside Content Factory. The two projects share no code today.

---

## Current state

Bootstrap + full UI shell complete.
BrandKit system wired (mybestsim).
Canvas overlay engine implemented.
PNG export working client-side.
MP4 export stubbed (not implemented).

---

## Do not touch

- `public/brands/*/brand.json` — source of truth for brand config. Edit the TOML in content-factory and re-export.
- `types/brandkit.ts` — any schema change must be coordinated with the branding engine in `lib/branding/engine.ts`.

---

## Constraints

- No FFmpeg inside Next.js. Rendering stays client-side (canvas) or delegates to a future Server Action → Content Factory CLI subprocess.
- No Zustand, no Context for overlay state — keep it in `useOverlay.ts` (useReducer).
- All values from BrandKit. Zero hardcoded brand colors/sizes in components.
- Tailwind v4 CSS-first. No `tailwind.config.ts`. All tokens in `globals.css @theme`.

---

## Adding features

Before adding a new component: check whether `SettingsSidebar.tsx` can be extended instead.

Before adding a new hook: check whether `useOverlay.ts` or `useMediaFile.ts` can be extended.

For a new brand: see README "Adding a New Brand" section.

For MP4 export: wire `hooks/useExport.ts` → `app/actions/render.ts` → Content Factory CLI subprocess.

---

## Verification before shipping

```bash
npx tsc --noEmit      # type check
npm run build         # production build
npm run lint          # lint
```
