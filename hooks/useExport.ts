/**
 * hooks/useExport.ts
 * Exports the branded canvas as PNG.
 * Future: add MP4 export via Server Action / API call.
 */
"use client";

import { useState, useCallback } from "react";
import { exportCanvasToPng, saveBlob } from "@/lib/branding/engine";

type ExportStatus = "idle" | "exporting" | "done" | "error";

export function useExport() {
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const exportPng = useCallback(
    async (canvas: HTMLCanvasElement | null, filename = "branded-image.png") => {
      if (!canvas) return;
      setStatus("exporting");
      setError(null);
      try {
        const blob = await exportCanvasToPng(canvas, 0.95);
        const completed = await saveBlob(blob, filename);
        if (completed) {
          setStatus("done");
          setTimeout(() => setStatus("idle"), 2000);
        } else {
          setStatus("idle");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Export failed");
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    },
    []
  );

  return { status, error, exportPng } as const;
}
