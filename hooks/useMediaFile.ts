/**
 * hooks/useMediaFile.ts
 * Simplified image-only media loader for Codex-style Brand Studio.
 */
"use client";

import { useState, useCallback, useEffect } from "react";
import type { MediaFile } from "@/types/brandkit";

export function useMediaFile() {
  const [media, setMedia] = useState<MediaFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Revoke stale object URLs
  useEffect(() => {
    return () => {
      if (media?.objectUrl) URL.revokeObjectURL(media.objectUrl);
    };
  }, [media?.objectUrl]);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setMedia({
        type: "image",
        file,
        objectUrl,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.src = objectUrl;
  }, []);

  const clearMedia = useCallback(() => {
    if (media?.objectUrl) URL.revokeObjectURL(media.objectUrl);
    setMedia(null);
  }, [media]);

  return {
    media,
    isDragging,
    setIsDragging,
    loadFile,
    clearMedia,
  } as const;
}
