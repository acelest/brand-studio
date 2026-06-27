/**
 * hooks/useBrandKit.ts
 * Fetches and caches a BrandKit from /brands/[id]/brand.json.
 */
"use client";

import { useState, useEffect } from "react";
import type { BrandKit } from "@/types/brandkit";

interface UseBrandKitResult {
  brandKit: BrandKit | null;
  loading: boolean;
  error: string | null;
}

const kitCache = new Map<string, BrandKit>();

export function useBrandKit(brandId: string): UseBrandKitResult {
  const [brandKit, setBrandKit] = useState<BrandKit | null>(
    kitCache.get(brandId) ?? null
  );
  const [loading, setLoading] = useState(!kitCache.has(brandId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (kitCache.has(brandId)) {
      setBrandKit(kitCache.get(brandId)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/brands/${brandId}/brand.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<BrandKit>;
      })
      .then((kit) => {
        kitCache.set(brandId, kit);
        setBrandKit(kit);
      })
      .catch((err) => {
        setError(err.message ?? "Failed to load brand kit");
      })
      .finally(() => setLoading(false));
  }, [brandId]);

  return { brandKit, loading, error };
}
