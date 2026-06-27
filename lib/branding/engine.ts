/**
 * lib/branding/engine.ts
 * Pure canvas overlay renderer matching Codex Billboard math exactly.
 */

import type { BrandKit, OverlayConfig } from "@/types/brandkit";

const logoCache = new Map<string, HTMLImageElement>();

function loadLogoImage(url: string): Promise<HTMLImageElement> {
  if (logoCache.has(url)) {
    return Promise.resolve(logoCache.get(url)!);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      logoCache.set(url, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Draws the source image onto the canvas and overlays logo and text.
 */
export async function drawOverlay(
  canvas: HTMLCanvasElement,
  source: HTMLImageElement,
  brandKit: BrandKit,
  config: OverlayConfig
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  // 1. Clear
  ctx.clearRect(0, 0, W, H);

  // 2. Draw source image with cover-crop and zoom math
  const canvasRatio = W / H;
  const imageRatio = source.naturalWidth / source.naturalHeight;

  let drawX = 0, drawY = 0, drawW = W, drawH = H;

  if (imageRatio > canvasRatio) {
    drawH = H;
    drawW = H * imageRatio;
    drawX = (W - drawW) / 2;
  } else {
    drawW = W;
    drawH = W / imageRatio;
    drawY = (H - drawH) / 2;
  }

  const scale = (config.zoom || 100) / 100;
  const zoomedW = drawW * scale;
  const zoomedH = drawH * scale;
  const zoomedX = drawX - (zoomedW - drawW) / 2;
  const zoomedY = drawY - (zoomedH - drawH) / 2;

  ctx.drawImage(source, zoomedX, zoomedY, zoomedW, zoomedH);

  // 3. Load logo image
  let logoImg: HTMLImageElement | null = null;
  try {
    logoImg = await loadLogoImage(config.customLogoUrl || brandKit.logoUrl);
  } catch (err) {
    console.error("Failed to load logo", err);
  }

  // 4. Codex Overlay Math
  // Logo Size (a): W * (logoSizeSliderValue / 100)
  const a = W * (config.logoSize / 100);

  // Vertical Center Line (s), clamped to prevent sticking to top/bottom edges
  const verticalMargin = H * 0.06;
  const minS = verticalMargin + a / 2;
  const maxS = H - verticalMargin - a / 2;
  const s = Math.max(minS, Math.min(maxS, H * (config.verticalPosition / 100)));

  // Left Edge X (d): 10% of W
  const d = W * 0.10;

  // Draw Logo
  if (logoImg) {
    ctx.save();
    // Center logo vertically around 's'
    ctx.drawImage(logoImg, d, s - a / 2, a, a);
    ctx.restore();
  }

  // Draw Text "MyBestSim"
  ctx.save();
  const textHeight = a * 0.58;
  // Font size set to match textHeight
  ctx.font = `600 ${Math.round(textHeight)}px "Geist", system-ui, sans-serif`;
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.textAlign = "right";

  // Position: Right edge X = W - 10% of W
  const textX = W - d;
  const textY = s;

  // Subtle drop shadow for readability
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = textHeight * 0.3;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = textHeight * 0.05;

  ctx.fillText((config.customBrandName || brandKit.displayName || "MyBestSim").slice(0, 25), textX, textY);
  ctx.restore();
}

/**
 * Exports the current canvas to a PNG Blob.
 */
export function exportCanvasToPng(
  canvas: HTMLCanvasElement,
  quality = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas export failed"));
      },
      "image/png",
      quality
    );
  });
}

/**
 * Saves a blob using the native share sheet when available (iOS "Save to Photos",
 * Android share targets), otherwise falls back to a file download.
 * Returns false only when the user cancels the share sheet.
 */
export async function saveBlob(blob: Blob, filename: string): Promise<boolean> {
  const file = new File([blob], filename, { type: blob.type });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return true;
    } catch (err) {
      // User dismissed the sheet → don't fall back to a download.
      if (err instanceof Error && err.name === "AbortError") return false;
      // Any other share failure → fall through to download.
    }
  }
  downloadBlob(blob, filename);
  return true;
}

/**
 * Triggers a browser download for a given Blob.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revoke: revoking synchronously cancels the download on mobile browsers.
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
