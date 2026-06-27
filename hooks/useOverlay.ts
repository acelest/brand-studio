/**
 * hooks/useOverlay.ts
 * Manages Codex Billboard overlay settings state.
 */
"use client";

import { useState, useCallback } from "react";
import type { OverlayConfig } from "@/types/brandkit";

const DEFAULTS: OverlayConfig = {
  logoSize: 18,
  verticalPosition: 50,
  zoom: 100,
  format: "original",
};

export function useOverlay() {
  const [config, setConfig] = useState<OverlayConfig>(DEFAULTS);

  const update = useCallback((partial: Partial<OverlayConfig>) => {
    setConfig((v) => ({ ...v, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setConfig(DEFAULTS);
  }, []);

  return { config, update, reset } as const;
}
