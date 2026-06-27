/**
 * types/brandkit.ts
 * Simplified TypeScript types for Codex-style Brand Studio.
 */

export interface OverlayConfig {
  logoSize: number;       // Slider value: 5 – 40 (percent of image width)
  verticalPosition: number; // Slider value: 10 – 90 (percent of image height)
  zoom: number;           // Slider value: 100 – 300 (percent zoom)
  format: "original" | "vertical"; // Format aspect ratio selection
}

export interface MediaFile {
  type: "image";
  file: File;
  objectUrl: string;
  width: number;
  height: number;
}

export interface BrandKit {
  id: string;
  displayName: string;
  logoUrl: string;
  logoWhiteUrl: string;
}

export const CURRENT_BRAND: BrandKit = {
  id: "mybestsim",
  displayName: "MyBestSim",
  logoUrl: "/brands/mybestsim/logo-billboard.png",
  logoWhiteUrl: "/brands/mybestsim/logo-billboard.png",
};
