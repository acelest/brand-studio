# Brand Studio

> Upload an image or video. Apply a professional brand identity in seconds. Export PNG or MP4.
>
> Inspired by the awesome [codex-billboard](https://codex-billboard.vercel.app/) project created by [Jess Yin (@jessyin)](https://github.com/jessyin).

Brand Studio is a standalone Next.js 16 web application — part of the Content Platform ecosystem, independent from the Content Factory CLI engine.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first) |
| Components | shadcn/ui (Nova preset — Geist + Lucide) |
| Animation | Motion (Framer Motion v11+) |
| Canvas | HTML5 2D Canvas API |
| Fonts | Geist Sans + Geist Mono |

---

## Quick Start

```bash
cd brand-studio
npm install
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
brand-studio/
├── app/
│   ├── layout.tsx          # Root layout: fonts, dark mode, TooltipProvider
│   ├── page.tsx            # Studio page (single-page app)
│   └── globals.css         # Design tokens + utility classes
│
├── components/studio/
│   ├── BrandToolbar.tsx    # Top bar: Studio logo + brand switcher
│   ├── BrandSelector.tsx   # Brand kit dropdown
│   ├── UploadDropzone.tsx  # Drag-drop file upload
│   ├── PreviewCanvas.tsx   # Live branded canvas
│   ├── SettingsSidebar.tsx # Right panel orchestrator
│   ├── LogoSettings.tsx    # Logo size, opacity, position
│   ├── TypographySettings.tsx # Company name, text controls
│   └── ExportPanel.tsx     # PNG/MP4 export actions
│
├── hooks/
│   ├── useBrandKit.ts      # Fetch + cache brand.json
│   ├── useOverlay.ts       # Overlay config state (useReducer)
│   ├── useMediaFile.ts     # File selection + object URL lifecycle
│   └── useExport.ts        # canvas → Blob → download
│
├── lib/branding/
│   └── engine.ts           # Pure canvas overlay math + export utilities
│
├── types/
│   └── brandkit.ts         # BrandKit, OverlayConfig, MediaFile types
│
└── public/brands/
    └── mybestsim/
        ├── brand.json      # BrandKit configuration (from TOML)
        ├── logo.png
        └── logo-billboard.png
```

---

## Adding a New Brand

1. Create `public/brands/<id>/brand.json` following the `BrandKit` schema in `types/brandkit.ts`.
2. Add `logo.png` and `logo-billboard.png` assets.
3. Register the brand in `types/brandkit.ts → AVAILABLE_BRANDS`.

No code changes needed elsewhere.

---

## Architecture Notes

- **Rendering is client-side only.** The canvas is drawn in the browser via the HTML5 2D Canvas API. No FFmpeg, no server-side rendering.
- **BrandKit is config-driven.** All overlay values come from `brand.json`. Zero hardcoded values in components.
- **Mocked services.** MP4 export is stubbed. When the Content Factory API is ready, wire `hooks/useExport.ts` to the Server Action in `app/actions/render.ts`.
- **State is pure React.** No Zustand, no Context. `useReducer` in `useOverlay.ts` is the single source of truth for overlay config.
